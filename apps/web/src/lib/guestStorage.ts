import type { DetectedAccount } from "@digitaleu/shared";

/**
 * Lagringslag for GJESTEMODUS: all data lever kun i `sessionStorage` og
 * forsvinner når fanen lukkes. Ingenting forlater klienten. (Profilmodus
 * bruker i stedet zero-knowledge-kryptering + Supabase — se crypto.ts.)
 */

export interface MigrationState {
  accounts: DetectedAccount[];
}

export const EMPTY_MIGRATION_STATE: MigrationState = { accounts: [] };

const STORAGE_KEY = "digitaleu:migration-state";

/**
 * Demo-data som vises inntil innboksskanneren er bygget. Markert tydelig som
 * eksempel i UI-et. Koblet til ekte alternativer fra `@digitaleu/shared`.
 */
export const DEMO_ACCOUNTS: DetectedAccount[] = [
  { id: "gmail", domain: "gmail.com", serviceName: "Gmail", status: "detected", suggestedAlternativeId: "proton-mail" },
  { id: "outlook", domain: "outlook.com", serviceName: "Outlook", status: "detected", suggestedAlternativeId: "tuta" },
  { id: "dropbox", domain: "dropbox.com", serviceName: "Dropbox", status: "detected", suggestedAlternativeId: "proton-drive" },
  { id: "lastpass", domain: "lastpass.com", serviceName: "LastPass", status: "detected", suggestedAlternativeId: "proton-pass" },
  { id: "netflix", domain: "netflix.com", serviceName: "Netflix", status: "detected" },
];

export function loadGuestState(): MigrationState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_MIGRATION_STATE;
    const parsed = JSON.parse(raw) as MigrationState;
    if (!parsed || !Array.isArray(parsed.accounts)) return EMPTY_MIGRATION_STATE;
    return parsed;
  } catch {
    // Korrupt/ulesbar state skal aldri krasje appen.
    return EMPTY_MIGRATION_STATE;
  }
}

export function saveGuestState(state: MigrationState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearGuestState(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
