/**
 * Sentrale, faktiske opplysninger om tjenesten — brukt i tillitssignaler i UI.
 * Hold disse ærlige og etterprøvbare (jf. CLAUDE.md §3 «Åpenhet»).
 */
export const SITE = {
  /** Merkevare/visningsnavn. Domenet er digitaleu.me. */
  brand: "Digital Europe",
  domain: "digitaleu.me",
  /** Slagord — brukervendt, engelsk default (jf. CLAUDE.md §8 i18n). */
  slogan: "Who owns your data and who sees them?",

  /** Region der brukerdata lagres (Profilmodus, Supabase). */
  dataRegion: "Stockholm",
  dataRegionCountry: "Sweden",
  dataRegionLabel: "Sweden (Stockholm)",
} as const;

/**
 * Sosiale kontoer for «Digital Europe».
 * ⚠️ PLACEHOLDER-URLer — bekreft/erstatt med faktiske håndtak når de er opprettet.
 * Vi er aktive på Bluesky. Flere kanaler legges til senere.
 */
export type SocialLink = {
  id: string;
  label: string;
  url: string;
  /** Satt til true inntil håndtaket er bekreftet opprettet. */
  placeholder?: boolean;
};

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "mastodon",
    label: "Mastodon",
    url: "https://mastodon.social/@digitaleu",
  },
  {
    id: "bluesky",
    label: "Bluesky",
    url: "https://bsky.app/profile/digitaleu.me",
    placeholder: true,
  },
  {
    id: "x",
    label: "X",
    url: "https://x.com/digitaleu_me",
    placeholder: true,
  },
  {
    id: "reddit",
    label: "Reddit",
    url: "https://www.reddit.com/r/digitaleu",
    placeholder: true,
  },
  {
    id: "steady",
    label: "Steady",
    url: "https://steadyhq.com/digitaleu",
    placeholder: true,
  },
] as const;
