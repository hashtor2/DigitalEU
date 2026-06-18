/**
 * Sentrale, faktiske opplysninger om tjenesten — brukt i tillitssignaler i UI.
 * Hold disse ærlige og etterprøvbare (jf. CLAUDE.md §3 «Åpenhet»).
 */
export const SITE = {
  /** Region der brukerdata lagres (Profilmodus, Supabase). */
  dataRegion: "Zürich",
  dataRegionCountry: "Sveits",
  dataRegionLabel: "Sveits (Zürich)",
} as const;
