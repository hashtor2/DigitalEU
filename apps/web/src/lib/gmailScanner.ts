import { DOMAIN_MAPPINGS, type DetectedAccount } from "@digitaleu/shared";

/**
 * Client-side Gmail-innboksskanner.
 *
 * SIKKERHET & PERSONVERN:
 * All skanning skjer 100 % klientside i brukerens nettleser. E-postadresser, headers,
 * eller innhold sendes ALDRI til våre servere. Vi bruker det mest begrensende OAuth-scopet
 * som er mulig: `gmail.metadata`. Dette tillater oss kun å lese headers (From, Date osv.)
 * uten tilgang til selve e-postinnholdet eller vedlegg.
 */

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

/** Henter Google Client ID fra Vite miljøvariabler. */
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

/** Sjekker om Google-skanningen er fullstendig konfigurert. */
export const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID);

/**
 * Genererer Google OAuth-autorisasjonslenken.
 * Vi bruker standard Implicit Flow (`response_type=token`) som fungerer
 * utmerket for rene klientside-apper (SPAs) uten backend-krav.
 */
export function getGoogleAuthUrl(): string {
  if (!isGoogleConfigured) {
    console.warn(
      "[gmailScanner] VITE_GOOGLE_CLIENT_ID er ikke konfigurert i .env. " +
        "Google OAuth vil ikke fungere."
    );
  }

  const redirectUri = `${window.location.origin}/emailscanner`;
  const scope = "https://www.googleapis.com/auth/gmail.metadata";

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: scope,
    prompt: "consent",
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Parser URL-hashen og trekker ut access_token hvis det er tilstede.
 * Fjerner hashen fra adressefeltet umiddelbart etterpå av sikkerhetsgrunner.
 */
export function extractAccessTokenFromUrl(): string | null {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get("access_token");

  if (accessToken) {
    // Fjern sensitivt token fra nettleserens adressefelt
    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search
    );
    return accessToken;
  }

  return null;
}

/**
 * Hjelper til å trekke ut domenenavnet fra en rå "From"-headerverdi.
 * Eksempler:
 * - "Netflix <info@netflix.com>" -> "netflix.com"
 * - "<support@spotify.co.uk>" -> "spotify.co.uk"
 * - "hello@brevo.com" -> "brevo.com"
 */
export function extractDomainFromFromHeader(fromHeader: string): string | null {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = fromHeader.match(emailRegex);
  if (!match) return null;

  const email = match[1].toLowerCase();
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : null;
}

/**
 * Kjører selve innboksskanningen mot Google Gmail API.
 * Henter de 150 nyeste e-postene, slår opp headers, og matcher mot DOMAIN_MAPPINGS.
 */
export async function scanGmailInbox(
  accessToken: string,
  onProgress?: (percent: number, step: string) => void
): Promise<DetectedAccount[]> {
  const updateProgress = (percent: number, step: string) => {
    if (onProgress) onProgress(percent, step);
  };

  updateProgress(10, "Connecting securely to Gmail (Read-Only)...");

  // Step 1: Hent liste over de siste 150 meldinger i brukerens primærboks
  const listUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=150&q=category:primary";
  const listResponse = await fetch(listUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!listResponse.ok) {
    throw new Error(`Failed to fetch message list: ${listResponse.statusText}`);
  }

  const listData = await listResponse.json() as { messages?: { id: string }[] };
  const messages = listData.messages || [];

  if (messages.length === 0) {
    updateProgress(100, "Scan finished. No messages found.");
    return [];
  }

  updateProgress(30, `Found ${messages.length} messages. Fetching sender information...`);

  // Step 2: Hent metadata (Headers) for hver melding.
  // Vi batcher forespørslene i grupper av 15 parallelle kall for å unngå nettstøy og rate-limiting.
  const batchSize = 15;
  const uniqueDomains = new Set<string>();

  for (let i = 0; i < messages.length; i += batchSize) {
    const currentBatch = messages.slice(i, i + batchSize);
    
    // Beregn fremdrift mellom 30% og 90%
    const percent = Math.floor(30 + (i / messages.length) * 60);
    updateProgress(percent, `Processing messages ${i + 1} to ${Math.min(i + batchSize, messages.length)}...`);

    const promises = currentBatch.map(async (msg) => {
      try {
        const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From`;
        const detailResponse = await fetch(detailUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (!detailResponse.ok) return null;

        const detailData = await detailResponse.json() as {
          payload?: { headers?: { name: string; value: string }[] };
        };

        const headers = detailData.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name.toLowerCase() === "from")?.value;

        if (fromHeader) {
          const domain = extractDomainFromFromHeader(fromHeader);
          if (domain) {
            uniqueDomains.add(domain);
          }
        }
      } catch (err) {
        // Ignorer enkeltmeldinger som feiler for å sikre fullføring
        console.error(`Error fetching message ${msg.id}:`, err);
      }
    });

    await Promise.all(promises);
  }

  updateProgress(95, "Analyzing sender domains and matching privacy alternatives...");

  // Step 3: Match unike avsenderdomener mot DOMAIN_MAPPINGS
  const detectedAccountsMap = new Map<string, DetectedAccount>();

  for (const domain of uniqueDomains) {
    // Sjekk om domenet finnes i ordboken
    const mapping = DOMAIN_MAPPINGS.find(
      (m) =>
        m.domain === domain ||
        m.alternativeDomains.includes(domain) ||
        domain.endsWith(`.${m.domain}`) // Støtt subdomener, f.eks. "info.netflix.com" -> "netflix.com"
    );

    if (mapping) {
      detectedAccountsMap.set(mapping.id, {
        id: mapping.id,
        domain: mapping.domain,
        serviceName: mapping.serviceName,
        status: "detected",
        suggestedAlternativeId: mapping.suggestedAlternativeId,
      });
    }
  }

  updateProgress(100, "Done! Your secure local migration vault is ready.");

  return Array.from(detectedAccountsMap.values());
}
