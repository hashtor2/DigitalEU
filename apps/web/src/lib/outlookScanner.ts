import { DOMAIN_MAPPINGS, type DetectedAccount } from "@digitaleu/shared";

/**
 * Client-side Microsoft Outlook & Hotmail-innboksskanner via Microsoft Graph API.
 *
 * SIKKERHET & PERSONVERN:
 * All skanning skjer 100 % klientside i brukerens nettleser. E-postadresser, headers,
 * eller innhold sendes ALDRI til våre servere. Vi bruker det mest begrensende OAuth-scopet
 * som er mulig: `Mail.ReadBasic`. Dette tillater oss kun å lese grunnleggende meldingsheaders
 * (From, SentDateTime osv.) uten tilgang til selve e-postinnholdet eller vedlegg.
 */

const MS_AUTH_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

/** Henter Microsoft Client ID fra Vite miljøvariabler. */
export const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID || "";

/** Sjekker om Microsoft-skanningen er fullstendig konfigurert. */
export const isMicrosoftConfigured = Boolean(MICROSOFT_CLIENT_ID);

/**
 * Genererer Microsoft OAuth-autorisasjonslenken.
 * Vi bruker standard Implicit Flow (`response_type=token`) som fungerer
 * utmerket for rene klientside-apper (SPAs) uten backend-krav.
 */
export function getMicrosoftAuthUrl(): string {
  if (!isMicrosoftConfigured) {
    console.warn(
      "[outlookScanner] VITE_MICROSOFT_CLIENT_ID er ikke konfigurert i .env. " +
        "Microsoft OAuth vil ikke fungere."
    );
  }

  const redirectUri = `${window.location.origin}/dashboard`;
  // Mail.ReadBasic lar oss hente 'from'-adresse og emne, men IKKE selve innholdet i e-posten.
  const scope = "https://graph.microsoft.com/Mail.ReadBasic";

  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: scope,
    prompt: "select_account",
  });

  return `${MS_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Parser URL-hashen og trekker ut access_token hvis det er tilstede.
 * Fjerner hashen fra adressefeltet umiddelbart etterpå av sikkerhetsgrunner.
 */
export function extractOutlookAccessTokenFromUrl(): string | null {
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

interface GraphMessage {
  from?: {
    emailAddress?: {
      name?: string;
      address?: string;
    };
  };
}

interface GraphResponse {
  value?: GraphMessage[];
}

/**
 * Kjører selve innboksskanningen mot Microsoft Graph API.
 * Henter de 150 nyeste e-postene i ett enkelt, lynraskt API-kall og matcher dem.
 */
export async function scanOutlookInbox(
  accessToken: string,
  onProgress?: (percent: number, step: string) => void
): Promise<DetectedAccount[]> {
  const updateProgress = (percent: number, step: string) => {
    if (onProgress) onProgress(percent, step);
  };

  updateProgress(15, "Connecting securely to Microsoft Graph (Read-Only)...");

  // Microsoft Graph tillater oss å hente kun 'from'-feltet for de 150 nyeste meldingene i ett enkelt kall!
  const url = "https://graph.microsoft.com/v1.0/me/messages?$select=from&$top=150";

  updateProgress(45, "Fetching mail headers from Outlook...");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Microsoft Graph API failed: ${response.statusText}`);
  }

  updateProgress(75, "Analyzing inbox sender addresses...");

  const data = (await response.json()) as GraphResponse;
  const messages = data.value || [];

  if (messages.length === 0) {
    updateProgress(100, "Scan finished. No messages found.");
    return [];
  }

  const uniqueDomains = new Set<string>();

  for (const msg of messages) {
    const fromAddress = msg.from?.emailAddress?.address;
    if (fromAddress) {
      const parts = fromAddress.toLowerCase().split("@");
      if (parts.length === 2) {
        uniqueDomains.add(parts[1]);
      }
    }
  }

  updateProgress(95, "Matching sender domains and creating checklist...");

  const detectedAccountsMap = new Map<string, DetectedAccount>();

  for (const domain of uniqueDomains) {
    const mapping = DOMAIN_MAPPINGS.find(
      (m) =>
        m.domain === domain ||
        m.alternativeDomains.includes(domain) ||
        domain.endsWith(`.${m.domain}`) // Støtt subdomener
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

  updateProgress(100, "Done! Your secure Outlook migration checklist is ready.");

  return Array.from(detectedAccountsMap.values());
}
