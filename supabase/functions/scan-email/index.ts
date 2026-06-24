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

/**
 * Fetch Gmail senders server-side using an access token.
 */
async function scanGmailServer(
  accessToken: string,
  maxResults: number = 100
): Promise<{ domains: Set<string>; scannedCount: number }> {
  const domains = new Set<string>();
  const GMAIL_API_BASE = "https://www.googleapis.com/gmail/v1/users/me";

  try {
    // Step 1: Fetch recent message IDs
    const listUrl = new URL(`${GMAIL_API_BASE}/messages`);
    listUrl.searchParams.append("maxResults", String(maxResults));
    listUrl.searchParams.append("q", "NOT is:draft");

    const listResponse = await fetch(listUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!listResponse.ok) {
      if (listResponse.status === 401) {
        throw new Error("Gmail access expired. Please reconnect your account.");
      }
      throw new Error(
        `Gmail API error: ${listResponse.status} ${listResponse.statusText}`
      );
    }

    const listData = await listResponse.json();
    const messageIds = listData.messages?.map((m: any) => m.id) || [];

    // Step 2: Fetch headers for each message (metadata only)
    for (const messageId of messageIds) {
      const msgUrl = new URL(`${GMAIL_API_BASE}/messages/${messageId}`);
      msgUrl.searchParams.append("format", "metadata");
      msgUrl.searchParams.append("metadataHeaders", "From");

      const msgResponse = await fetch(msgUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!msgResponse.ok) {
        continue;
      }

      const msgData = await msgResponse.json();
      const headers = msgData.payload?.headers || [];
      const fromHeader = headers.find((h: any) => h.name === "From")?.value;

      if (fromHeader) {
        const domain = extractDomainFromEmail(fromHeader);
        if (domain) {
          domains.add(domain);
        }
      }
    }

    return {
      domains,
      scannedCount: messageIds.length,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch Outlook senders server-side using an access token.
 */
async function scanOutlookServer(
  accessToken: string,
  maxResults: number = 100
): Promise<{ domains: Set<string>; scannedCount: number }> {
  const domains = new Set<string>();
  const OUTLOOK_API_BASE = "https://graph.microsoft.com/v1.0/me/messages";

  try {
    const url = new URL(OUTLOOK_API_BASE);
    url.searchParams.append("$top", String(maxResults));
    url.searchParams.append("$select", "from");

    const response = await fetch(url.toString(), {
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
      const fromEmail = msg.from?.emailAddress?.address;
      if (fromEmail) {
        const domain = extractDomainFromEmail(fromEmail);
        if (domain) {
          domains.add(domain);
        }
      }
    }

    return {
      domains,
      scannedCount: messages.length,
    };
  } catch (error) {
    throw error;
  }
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
      result = await scanGmailServer(accessToken, maxResults || 100);
    } else {
      result = await scanOutlookServer(accessToken, maxResults || 100);
    }

    const senders = Array.from(result.domains).sort();

    return new Response(
      JSON.stringify({
        senders,
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
