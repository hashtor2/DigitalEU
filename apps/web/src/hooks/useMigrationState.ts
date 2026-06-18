import { useEffect, useState, useRef } from "react";
import type { MigrationStatus, StorageMode, DetectedAccount } from "@digitaleu/shared";
import {
  DEMO_ACCOUNTS,
  loadGuestState,
  saveGuestState,
  clearGuestState,
  type MigrationState,
} from "@/lib/guestStorage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { encryptJSON, decryptJSON, DecryptionError } from "@/lib/crypto";
import type { User } from "@supabase/supabase-js";

/**
 * Styrer migreringsfremgang, lagringsmodus og synkronisering mot Supabase i Profilmodus.
 *
 * - Gjestemodus: lagrer rådata lokalt i sessionStorage. Ingenting sendes til serveren.
 * - Profilmodus: klientside-kryptering (zero-knowledge) før lagring i Supabase `user_vault`.
 *   Nøkkelen avledes fra en passphrase som aldri sendes til serveren.
 */
export function useMigrationState(initialMode: StorageMode = "guest") {
  const [mode, setMode] = useState<StorageMode>(initialMode);
  const [state, setState] = useState<MigrationState>(() => {
    const loaded = loadGuestState();
    return loaded.accounts.length ? loaded : { accounts: DEMO_ACCOUNTS };
  });

  const [user, setUser] = useState<User | null>(null);
  const [passphrase, setPassphraseState] = useState<string | null>(() => {
    return sessionStorage.getItem("digitaleu:passphrase");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ignoreNextSave = useRef(false);

  const setPassphrase = (val: string | null) => {
    setPassphraseState(val);
    if (val) {
      sessionStorage.setItem("digitaleu:passphrase", val);
    } else {
      sessionStorage.removeItem("digitaleu:passphrase");
    }
  };

  // Lytt på autentiseringsstatus fra Supabase
  useEffect(() => {
    if (!supabase) return;

    // Hent aktiv bruker med en gang
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setMode("profile");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          setMode("profile");
        } else {
          setMode("guest");
          setPassphrase(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Last kryptert profil fra Supabase når vi er logget inn og har passphrase
  useEffect(() => {
    if (mode !== "profile" || !user || !passphrase || !supabase) {
      // Fallback til gjestetilstand hvis man bytter tilbake
      if (mode === "guest") {
        const guestState = loadGuestState();
        setState(guestState.accounts.length ? guestState : { accounts: DEMO_ACCOUNTS });
      }
      return;
    }

    let isCancelled = false;

    async function loadProfileState() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase!
          .from("user_vault")
          .select("ciphertext")
          .eq("user_id", user!.id)
          .single();

        if (dbError) {
          if (dbError.code === "PGRST116") {
            // Rad finnes ikke i DB ennå. Opprett den med gjeldende tilstand.
            const ciphertext = await encryptJSON(state, passphrase!);
            const { error: insertError } = await supabase!
              .from("user_vault")
              .insert({ user_id: user!.id, ciphertext });
            if (insertError) throw insertError;
          } else {
            throw dbError;
          }
        } else if (data?.ciphertext) {
          const decrypted = await decryptJSON<MigrationState>(
            data.ciphertext,
            passphrase!
          );
          if (!isCancelled) {
            ignoreNextSave.current = true;
            setState(decrypted);
          }
        }
      } catch (err) {
        console.error("Feil ved lasting eller dekryptering av profil:", err);
        if (!isCancelled) {
          if (err instanceof DecryptionError) {
            setError("Feil personvern-passord (passphrase). Klarte ikke å dekryptere dine data.");
          } else {
            setError("Klarte ikke å hente dine lagrede profildata fra skyen.");
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadProfileState();

    return () => {
      isCancelled = true;
    };
  }, [mode, user, passphrase]);

  // Persister automatisk ved tilstandsendringer
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (mode === "guest") {
      saveGuestState(state);
      return;
    }

    if (ignoreNextSave.current) {
      ignoreNextSave.current = false;
      return;
    }

    if (mode === "profile" && user && passphrase && supabase && !loading) {
      async function saveProfileState() {
        try {
          const ciphertext = await encryptJSON(state, passphrase!);
          const { error: dbError } = await supabase!
            .from("user_vault")
            .upsert({ user_id: user!.id, ciphertext, updated_at: new Date().toISOString() });

          if (dbError) throw dbError;
        } catch (err) {
          console.error("Klarte ikke å lagre profil til Supabase:", err);
          setError("Feil: Klarte ikke å synkronisere endringer til skyen.");
        }
      }

      saveProfileState();
    }
  }, [state, mode, user, passphrase]);

  function setStatus(id: string, status: MigrationStatus) {
    setState((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  }

  function mergeDetectedAccounts(scanned: DetectedAccount[]) {
    setState((current) => {
      // Sjekk om brukeren kun har DEMO_ACCOUNTS akkurat nå, uten endringer.
      const isDemoOnly =
        current.accounts.length === DEMO_ACCOUNTS.length &&
        current.accounts.every(
          (curr) =>
            DEMO_ACCOUNTS.some((demo) => demo.id === curr.id) &&
            curr.status === "detected"
        );

      const baseAccounts = isDemoOnly ? [] : current.accounts;
      const merged = [...baseAccounts];

      for (const scan of scanned) {
        const existingIdx = merged.findIndex((a) => a.id === scan.id);
        if (existingIdx === -1) {
          merged.push(scan);
        }
      }

      return { accounts: merged };
    });
  }

  function reset() {
    if (mode === "guest") {
      clearGuestState();
      setState({ accounts: DEMO_ACCOUNTS });
    } else {
      // Tilbakestill tilstand i skyen
      setState({ accounts: DEMO_ACCOUNTS });
    }
  }

  async function registerProfile(email: string, pass: string, passphr: string) {
    if (!supabase) throw new Error("Supabase er ikke konfigurert.");
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (authError) throw authError;
      if (data.user) {
        setPassphrase(passphr);
        const ciphertext = await encryptJSON(state, passphr);
        const { error: dbError } = await supabase
          .from("user_vault")
          .insert({ user_id: data.user.id, ciphertext });
        if (dbError) throw dbError;
        setUser(data.user);
        setMode("profile");
      }
    } catch (err: any) {
      setError(err.message || "Registrering feilet.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginProfile(email: string, pass: string, passphr: string) {
    if (!supabase) throw new Error("Supabase er ikke konfigurert.");
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (authError) throw authError;
      if (data.user) {
        setPassphrase(passphr);
        const { data: vault, error: dbError } = await supabase
          .from("user_vault")
          .select("ciphertext")
          .eq("user_id", data.user.id)
          .single();

        if (dbError && dbError.code !== "PGRST116") {
          throw dbError;
        }

        if (vault?.ciphertext) {
          const decrypted = await decryptJSON<MigrationState>(
            vault.ciphertext,
            passphr
          );
          ignoreNextSave.current = true;
          setState(decrypted);
        } else {
          const ciphertext = await encryptJSON(state, passphr);
          await supabase
            .from("user_vault")
            .insert({ user_id: data.user.id, ciphertext });
        }
        setUser(data.user);
        setMode("profile");
      }
    } catch (err: any) {
      if (err instanceof DecryptionError) {
        setError("Feil personvern-passord (passphrase). Klarte ikke å dekryptere.");
      } else {
        setError(err.message || "Innlogging feilet.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGitHub() {
    if (!supabase) throw new Error("Supabase is not configured.");
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || "GitHub authentication failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logoutProfile() {
    if (!supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signOut();
      clearGuestState();
      setPassphrase(null);
      setUser(null);
      setMode("guest");
      setState({ accounts: DEMO_ACCOUNTS });
    } catch (err: any) {
      setError(err.message || "Utlogging feilet.");
    } finally {
      setLoading(false);
    }
  }

  function unlockProfile(passphr: string) {
    setPassphrase(passphr);
  }

  return {
    mode,
    setMode,
    state,
    setStatus,
    mergeDetectedAccounts,
    reset,
    user,
    passphrase,
    loading,
    error,
    setError,
    registerProfile,
    loginProfile,
    loginWithGitHub,
    logoutProfile,
    unlockProfile,
    isConfigured: isSupabaseConfigured,
  };
}
