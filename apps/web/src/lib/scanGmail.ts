// Gmail inbox scanner — 100% client-side metadata extraction
// Only reads From + Subject headers; no email bodies; no persistence

export type DiscoveredAccount = {
  domain: string;
  name: string;
  count: number;
  matchedServiceId?: string;
};

type GmailListResponse = {
  messages?: { id?: string }[];
  nextPageToken?: string;
};

type GmailMessageResponse = {
  payload?: {
    headers?: { name?: string; value?: string }[];
  };
};

const GMAIL_API_BASE = "https://www.googleapis.com/gmail/v1";

// List of known personal/infrastructure email domains (exclude these)
const PERSONAL_OR_INFRA_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "icloud.com", "live.com", "me.com",
  "msn.com", "outlook.com", "pm.me", "proton.me", "protonmail.com", "yahoo.com",
  "amazonses.com", "mailchimpapp.net", "mandrillapp.com", "sendgrid.net",
  "sendinblue.com", "sparkpostmail.com",
]);

// List of second-level domain suffixes to keep
const SECOND_LEVEL_SUFFIXES = new Set([
  "co.uk", "org.uk", "ac.uk", "com.au", "com.br", "com.mx", "com.tr",
  "co.jp", "co.kr", "co.nz", "co.za",
]);

async function listMessageIds(
  headers: Record<string, string>,
  query: string,
  maxResults: number
): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      maxResults: String(maxResults),
      includeSpamTrash: "false",
    });
    if (query) params.set("q", query);

    const res = await fetch(
      `${GMAIL_API_BASE}/users/me/messages?${params.toString()}`,
      { headers }
    );
    if (!res.ok) return [];

    const json = (await res.json()) as GmailListResponse;
    return (json.messages ?? [])
      .map((m) => m.id)
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

async function getMessageMetadata(
  headers: Record<string, string>,
  id: string
): Promise<GmailMessageResponse | null> {
  const params = new URLSearchParams({ format: "metadata" });
  params.append("metadataHeaders", "From");
  params.append("metadataHeaders", "Subject");

  try {
    const res = await fetch(
      `${GMAIL_API_BASE}/users/me/messages/${encodeURIComponent(id)}?${params.toString()}`,
      { headers }
    );
    if (!res.ok) return null;
    return (await res.json()) as GmailMessageResponse;
  } catch {
    return null;
  }
}

function getHeader(msg: GmailMessageResponse, name: string): string {
  return (
    msg.payload?.headers?.find(
      (h) => h.name?.toLowerCase() === name.toLowerCase()
    )?.value ?? ""
  );
}

function parseSender(from: string): { domain: string; name: string } | null {
  const email =
    from.match(/<([^>]+)>/)?.[1] ??
    from.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];

  if (!email || !email.includes("@")) return null;

  const domain = email
    .split("@")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9.-]/g, "");

  if (!domain || !domain.includes(".")) return null;

  const display = from
    .replace(/<[^>]+>/g, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s+via\s+.+$/i, "")
    .trim();

  const fallback = humanizeDomain(baseDomain(domain));
  return {
    domain,
    name: isUsefulDisplayName(display) ? display : fallback,
  };
}

function isUsefulDisplayName(name: string): boolean {
  return Boolean(name) && !name.includes("@") && !isFallbackName(name);
}

function isFallbackName(name: string): boolean {
  return /^(account|accounts|admin|billing|hello|info|mail|newsletter|notification|notifications|no-?reply|receipt|receipts|security|support|team)$/i.test(
    name.trim()
  );
}

function baseDomain(domain: string): string {
  const clean = domain.toLowerCase().replace(/^www\./, "");
  const parts = clean.split(".").filter(Boolean);

  if (parts.length <= 2) return clean;

  const suffix = parts.slice(-2).join(".");
  if (SECOND_LEVEL_SUFFIXES.has(suffix) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

function humanizeDomain(domain: string): string {
  const label = domain.split(".")[0] ?? domain;
  return label
    .split(/[-_]/g)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export async function scanGmailInbox(accessToken: string): Promise<DiscoveredAccount[]> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  // 1. Build queries to find service-related emails
  const queries = [
    "",
    "subject:welcome",
    "subject:verify",
    "subject:verification",
    "subject:confirm",
    "subject:account",
    "subject:login",
    "subject:password",
    "subject:security",
    "subject:receipt",
    "subject:invoice",
    "subject:subscription",
    "subject:order",
    "from:noreply",
    "from:no-reply",
    "from:notification",
    "from:billing",
    "from:receipts",
    "from:support",
  ];

  // 2. Collect all message IDs
  const messageIds = new Set<string>();
  for (const query of queries) {
    const ids = await listMessageIds(headers, query, 100);
    ids.forEach((id) => messageIds.add(id));
  }

  // 3. Fetch metadata for each message
  const accounts = new Map<string, DiscoveredAccount>();

  for (const messageId of Array.from(messageIds).slice(0, 500)) {
    const msg = await getMessageMetadata(headers, messageId);
    if (!msg) continue;

    const from = getHeader(msg, "From");
    const sender = parseSender(from);
    if (!sender) continue;

    // Skip personal/infra domains
    if (PERSONAL_OR_INFRA_DOMAINS.has(sender.domain.toLowerCase())) {
      continue;
    }

    const key = sender.domain;
    const existing = accounts.get(key);
    accounts.set(key, {
      domain: key,
      name: existing?.name ?? sender.name,
      count: (existing?.count ?? 0) + 1,
    });
  }

  return Array.from(accounts.values()).sort((a, b) => b.count - a.count);
}
