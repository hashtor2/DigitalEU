/**
 * Supabase Edge Function: scan-email
 *
 * Scans a user's Gmail/Outlook inbox server-side, extracts sender domains,
 * and returns a list of detected services.
 *
 * SECURITY & PRIVACY:
 * - Runs server-side (no CORS issues, no browser token exposure)
 * - Fetches metadata only (From headers, message IDs)
 * - Never accesses email bodies or attachments
 * - Returns only extracted domains to the browser
 * - Token is ephemeral (not stored)
 *
 * Request body:
 * {
 *   "accessToken": "...",      // OAuth access token from browser
 *   "provider": "gmail" | "outlook",
 *   "maxResults": 100          // optional, defaults to 100
 * }
 *
 * Response:
 * {
 *   "senders": ["netflix.com", "spotify.com", "gmail.com"],
 *   "count": 3,
 *   "scannedCount": 50
 * }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Extract domain from a raw "From" email header.
 * Examples:
 * - "Netflix <info@netflix.com>" -> "netflix.com"
 * - "<support@spotify.co.uk>" -> "spotify.co.uk"
 */
function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/([a-zA-Z0-9.-]+@([a-zA-Z0-9.-]+))/);
  if (!match) return null;
  return match[2].toLowerCase();
}

/** Number of message-metadata requests to run in parallel. */
const FETCH_CONCURRENCY = 20;
/** Page size for Gmail message listing (Gmail caps this at 500). */
const GMAIL_PAGE_SIZE = 500;

/**
 * Fetch a URL with retry/backoff on transient 429 (rate-limit) responses.
 */
async function fetchWithRetry(
  url: string,
  accessToken: string,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if ((res.status === 429 || res.status === 503) && attempt < retries) {
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
      continue;
    }
    return res;
  }
}

/**
 * Fetch Gmail senders server-side using an access token.
 *
 * Lists message IDs across multiple pages, then fetches each message's `From`
 * header (metadata only) in bounded-concurrency batches, counting how many
 * messages came from each sender domain.
 */
async function scanGmailServer(
  accessToken: string,
  maxResults: number = 500
): Promise<{ counts: Map<string, number>; scannedCount: number }> {
  const counts = new Map<string, number>();
  const GMAIL_API_BASE = "https://www.googleapis.com/gmail/v1/users/me";

  // Step 1: Collect message IDs with pagination.
  // NOTE: the `gmail.metadata` OAuth scope does NOT permit the `q` search
  // parameter — including it makes Gmail return HTTP 403. So we list recent
  // messages without a query filter.
  const messageIds: string[] = [];
  let pageToken: string | undefined;
  while (messageIds.length < maxResults) {
    const listUrl = new URL(`${GMAIL_API_BASE}/messages`);
    listUrl.searchParams.append(
      "maxResults",
      String(Math.min(GMAIL_PAGE_SIZE, maxResults - messageIds.length))
    );
    if (pageToken) listUrl.searchParams.append("pageToken", pageToken);

    const listResponse = await fetchWithRetry(listUrl.toString(), accessToken);
    if (!listResponse.ok) {
      if (listResponse.status === 401) {
        throw new Error("Gmail access expired. Please reconnect your account.");
      }
      throw new Error(
        `Gmail API error: ${listResponse.status} ${listResponse.statusText}`
      );
    }

    const listData = await listResponse.json();
    for (const m of listData.messages ?? []) messageIds.push(m.id);
    pageToken = listData.nextPageToken;
    if (!pageToken) break;
  }

  // Step 2: Fetch each message's From header (metadata only) in parallel
  // batches to stay fast while respecting Gmail's per-user rate limit.
  for (let i = 0; i < messageIds.length; i += FETCH_CONCURRENCY) {
    const batch = messageIds.slice(i, i + FETCH_CONCURRENCY);
    const domains = await Promise.all(
      batch.map(async (messageId) => {
        const msgUrl = new URL(`${GMAIL_API_BASE}/messages/${messageId}`);
        msgUrl.searchParams.append("format", "metadata");
        msgUrl.searchParams.append("metadataHeaders", "From");

        const msgResponse = await fetchWithRetry(msgUrl.toString(), accessToken);
        if (!msgResponse.ok) return null;

        const msgData = await msgResponse.json();
        const headers = msgData.payload?.headers || [];
        const fromHeader = headers.find((h: any) => h.name === "From")?.value;
        return fromHeader ? extractDomainFromEmail(fromHeader) : null;
      })
    );

    for (const domain of domains) {
      if (domain) counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }
  }

  return { counts, scannedCount: messageIds.length };
}

/**
 * Fetch Outlook senders server-side using an access token.
 */
async function scanOutlookServer(
  accessToken: string,
  maxResults: number = 500
): Promise<{ counts: Map<string, number>; scannedCount: number }> {
  const counts = new Map<string, number>();
  const OUTLOOK_API_BASE = "https://graph.microsoft.com/v1.0/me/messages";

  // Microsoft Graph returns at most 1000 messages per page and paginates via
  // an `@odata.nextLink` URL. Follow the links until we reach `maxResults`.
  let nextUrl: string | null =
    `${OUTLOOK_API_BASE}?$select=from&$top=${Math.min(100, maxResults)}`;
  let scannedCount = 0;

  while (nextUrl && scannedCount < maxResults) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Outlook access expired. Please reconnect your account.");
      }
      throw new Error(
        `Outlook API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const messages = data.value || [];

    for (const msg of messages) {
      scannedCount++;
      const fromEmail = msg.from?.emailAddress?.address;
      if (fromEmail) {
        const domain = extractDomainFromEmail(fromEmail);
        if (domain) counts.set(domain, (counts.get(domain) ?? 0) + 1);
      }
    }

    nextUrl = data["@odata.nextLink"] ?? null;
  }

  return { counts, scannedCount };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { accessToken, provider, maxResults } = await req.json();

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "accessToken is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!provider || !["gmail", "outlook"].includes(provider)) {
      return new Response(
        JSON.stringify({
          error: 'provider must be "gmail" or "outlook"',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let result;
    if (provider === "gmail") {
      result = await scanGmailServer(accessToken, maxResults || 500);
    } else {
      result = await scanOutlookServer(accessToken, maxResults || 500);
    }

    // Sort detected sender domains by how many messages came from each
    // (most frequent first) so the most relevant services surface at the top.
    const senders = Array.from(result.counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([domain]) => domain);
    const senderCounts = Object.fromEntries(result.counts);

    return new Response(
      JSON.stringify({
        senders,
        senderCounts,
        count: senders.length,
        scannedCount: result.scannedCount,
        provider,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
