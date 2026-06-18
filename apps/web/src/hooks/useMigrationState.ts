import { useEffect, useState } from "react";
import type { MigrationStatus, StorageMode } from "@digitaleu/shared";
import {
  DEMO_ACCOUNTS,
  loadGuestState,
  saveGuestState,
  clearGuestState,
  type MigrationState,
} from "@/lib/guestStorage";

/**
 * Styrer migreringsfremgang og lagringsmodus.
 *
 * - Gjestemodus: persisteres til sessionStorage (implementert nå).
 * - Profilmodus: vil persisteres zero-knowledge-kryptert til Supabase
 *   (kobles på når auth + env er klart — se crypto.ts / supabase.ts).
 */
export function useMigrationState(initialMode: StorageMode = "guest") {
  const [mode, setMode] = useState<StorageMode>(initialMode);
  const [state, setState] = useState<MigrationState>(() => {
    const loaded = loadGuestState();
    // Seed med demo-data første gang, slik at dashbordet ikke er tomt før
    // innboksskanneren finnes.
    return loaded.accounts.length ? loaded : { accounts: DEMO_ACCOUNTS };
  });

  // Persister i Gjestemodus.
  useEffect(() => {
    if (mode === "guest") saveGuestState(state);
  }, [state, mode]);

  function setStatus(id: string, status: MigrationStatus) {
    setState((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  }

  function reset() {
    clearGuestState();
    setState({ accounts: DEMO_ACCOUNTS });
  }

  return { mode, setMode, state, setStatus, reset };
}
