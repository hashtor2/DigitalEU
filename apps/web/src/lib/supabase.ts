import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-klient for Profilmodus (autentisering + lagring av KRYPTERT
 * brukerdata). Husk: data krypteres alltid klientside (se `crypto.ts`) FØR
 * de lagres her. Supabase ser kun chiffertekst.
 *
 * anon-nøkkelen er offentlig-by-design; den faktiske beskyttelsen ligger i
 * Row Level Security (RLS) på databasen.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Gjestemodus fungerer uten Supabase; Profilmodus krever disse satt.
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY mangler — " +
      "Profilmodus er utilgjengelig til de er konfigurert (se .env.example).",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** True når miljøet er konfigurert for Profilmodus. */
export const isSupabaseConfigured = Boolean(url && anonKey);
