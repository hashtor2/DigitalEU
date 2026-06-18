import type { Alternative } from "./types";

/**
 * Startkatalog over europeiske alternativer. Utvides over tid; kildedata
 * ligger i forskningsrapporten i prosjektroten.
 */
export const ALTERNATIVES: Alternative[] = [
  {
    id: "proton-mail",
    name: "Proton Mail",
    country: "CH",
    category: "email",
    replaces: ["Gmail", "Outlook"],
    url: "https://proton.me/mail",
    description:
      "Kryptert e-post fra Sveits med zero-access-kryptering og åpen kildekode.",
    monetization: "affiliate",
    affiliateUrl: "https://proton.me/mail",
  },
  {
    id: "tuta",
    name: "Tuta Mail",
    country: "DE",
    category: "email",
    replaces: ["Gmail", "Outlook"],
    url: "https://tuta.com",
    description:
      "Tysk, ende-til-ende-kryptert e-post og kalender med fokus på personvern.",
    monetization: "ethical-direct",
  },
  {
    id: "mullvad-vpn",
    name: "Mullvad VPN",
    country: "SE",
    category: "vpn",
    replaces: ["NordVPN", "ExpressVPN"],
    url: "https://mullvad.net",
    description:
      "Svensk VPN med fast pris, anonyme kontonumre og ingen sporing av brukere.",
    monetization: "ethical-direct",
  },
  {
    id: "mullvad-browser",
    name: "Mullvad Browser",
    country: "SE",
    category: "browser",
    replaces: ["Chrome", "Edge"],
    url: "https://mullvad.net/browser",
    description:
      "Personvernfokusert nettleser utviklet sammen med Tor-prosjektet.",
    monetization: "ethical-direct",
  },
  {
    id: "proton-drive",
    name: "Proton Drive",
    country: "CH",
    category: "cloud-storage",
    replaces: ["Google Drive", "iCloud", "Dropbox"],
    url: "https://proton.me/drive",
    description: "Kryptert skylagring fra Sveits, integrert i Proton-økosystemet.",
    monetization: "affiliate",
    affiliateUrl: "https://proton.me/drive",
  },
  {
    id: "proton-pass",
    name: "Proton Pass",
    country: "CH",
    category: "password-manager",
    replaces: ["LastPass", "Google Password Manager"],
    url: "https://proton.me/pass",
    description: "Kryptert passordhåndterer med innebygd e-postalias-funksjon.",
    monetization: "affiliate",
    affiliateUrl: "https://proton.me/pass",
  },
];
