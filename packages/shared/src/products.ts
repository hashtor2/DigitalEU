import type { PhysicalProduct } from "./types";

/**
 * Katalog over fysiske, europeiske produkter vi kan videreselge (resell/dropship)
 * eller tjene affiliate på. Søsterfil til `alternatives.ts`, men for hardware.
 *
 * Forretningsmodell: kunden bestiller hos oss → vi legger inn bestillingen hos
 * produsenten → produsenten sender direkte til kunden (manuell dropship). For
 * det trenger vi et RESELLER-program (kjøp med rabatt, selg med påslag).
 * `affiliate` er fallback når reseller ikke er mulig (ren henvisning).
 *
 * KILDE: web-research 2026-06-25. Felt merket `"unclear"` må bekreftes ved
 * direkte B2B-kontakt før vi publiserer pris/margin. Ingen URL er gjettet.
 *
 * SIKKERHET (crypto-wallets): hardware-wallets er tamper-følsomme. Trezor/Ledger/
 * BitBox advarer kjøpere mot uoffisielle ledd. Dropship er kun forsvarlig hvis
 * produsenten sender fabrikkforseglede enheter direkte til kunden og vi er
 * oppført som autorisert forhandler. Bryt aldri forsegling.
 *
 * EKSKLUDERT (ikke EU/EØS/Sveits): OnlyKey (US), Keepser (Andorra), Teracube (US).
 */
export const PRODUCTS: PhysicalProduct[] = [
  // ─── CRYPTO WALLETS ─────────────────────────────────────────────────────────
  {
    id: "tangem",
    name: "Tangem",
    country: "CH",
    category: "crypto-wallet",
    url: "https://tangem.com",
    description:
      "Swiss card-format hardware wallet. No firmware screen — tamper anxiety is low, which (with no MOQ) makes it the single best dropship fit.",
    products: ["2-card pack (~$55)", "3-card pack (~$70)", "Tangem Ring"],
    priceRange: "$55–$70",
    reseller: {
      available: "yes",
      signupUrl: "https://tangem.com/en/partnership/",
      dropshipFriendly: true,
      terms: "No minimum order quantity, free express delivery, dedicated account manager.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://tangem.com/en/affiliates/",
      network: "in-house (referral)",
      commission: "5 USDT per referred purchase",
    },
    notes: "Best dropship candidate: no MOQ + free shipping + card format = no firmware-tamper risk.",
  },
  {
    id: "trezor",
    name: "Trezor",
    country: "CZ",
    category: "crypto-wallet",
    url: "https://trezor.io",
    description:
      "SatoshiLabs (Prague) — the original hardware wallet and a marquee EU privacy brand.",
    products: ["Safe 5 (~€169)", "Safe 3 (~€79)", "Model One (~€49)"],
    priceRange: "€49–€169",
    reseller: {
      available: "yes",
      signupUrl: "https://trezor.io/reseller-program",
      dropshipFriendly: undefined,
      terms: "Tiered volume discount; dropshipping not explicitly stated — confirm before relying on it.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://partners.trezor.io/",
      network: "in-house (also via financeAds)",
      commission: "up to 15% of net order value, 30-day cookie, payout EUR/BTC",
    },
    notes: "Tamper-sensitive: source only sealed factory stock and advertise authorized-reseller status.",
  },
  {
    id: "ledger",
    name: "Ledger",
    country: "FR",
    category: "crypto-wallet",
    url: "https://www.ledger.com",
    description: "French hardware wallet maker (Paris/Vierzon) with the widest global retail footprint.",
    products: ["Nano S Plus (~€79)", "Nano X (~€99)", "Flex (~€249)", "Stax (~€399)"],
    priceRange: "€79–€399",
    reseller: {
      available: "yes",
      signupUrl: "https://www.ledger.com/become-a-ledger-reseller",
      dropshipFriendly: undefined,
      terms: "Application form; discount/min-order disclosed post-approval; dropship not explicitly endorsed.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://affiliate.ledger.com/",
      network: "in-house",
      commission: "10% of net sale, weekly BTC payout, €50 min withdrawal",
    },
    notes: "Strong anti-counterfeit stance; resold units must be verifiable as genuine/unopened.",
  },
  {
    id: "bitbox",
    name: "BitBox (Shift Crypto)",
    country: "CH",
    category: "crypto-wallet",
    url: "https://bitbox.swiss",
    description: "Swiss-made, security-focused hardware wallet.",
    products: ["BitBox02 Multi / Bitcoin-only (~CHF 149)", "Steel backup"],
    priceRange: "~CHF 149",
    reseller: {
      available: "yes",
      signupUrl: "https://contact.bitbox.swiss/en/contact/",
      dropshipFriendly: false,
      terms: "~10-unit minimum order, payment in advance, registered business required — kills pure dropship.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://bitbox.swiss/affiliates/",
      network: "in-house",
      commission: "referral-link program (rate not public)",
    },
    notes: "10-unit MOQ makes dropship impractical; affiliate is the realistic path here.",
  },

  // ─── SECURITY KEYS (2FA / FIDO2) ────────────────────────────────────────────
  {
    id: "token2",
    name: "Token2",
    country: "CH",
    category: "security-key",
    url: "https://www.token2.com",
    description: "Swiss FIDO2/TOTP security keys at the lowest price point — best margin headroom.",
    products: ["PIN+ USB-A (€22)", "PIN+ TypeC (€23)", "PIN+ Dual (€26)", "PIN+ Bio3 (€37)", "Pico (€7)"],
    priceRange: "€7–€37",
    reseller: {
      available: "yes",
      signupUrl: "https://www.token2.com/site/page/resellers-and-distributors",
      dropshipFriendly: true,
      terms: 'Site notes "online orders may be fulfilled by authorized resellers/distributors" → dropship feasible; MOQ/margin unclear — contact them.',
    },
    affiliate: { available: "no" },
    notes: "Cheapest + most reseller-friendly of the EU security keys.",
  },
  {
    id: "nitrokey",
    name: "Nitrokey",
    country: "DE",
    category: "security-key",
    url: "https://www.nitrokey.com",
    description: "German open-source, EAL6+ security keys — the most on-brand choice for a sovereignty site.",
    products: ["Nitrokey 3A (€48)", "3A NFC (€60)", "3C NFC (€65)", "3A Mini (€54)", "Passkey (€32)"],
    priceRange: "€32–€65",
    reseller: {
      available: "yes",
      signupUrl: "https://www.nitrokey.com/contact",
      dropshipFriendly: undefined,
      terms: "No public portal — email sales@nitrokey.com with company details for wholesale/bulk discount.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://www.nitrokey.com/affiliate-program",
      network: "in-house",
      commission: "10%",
    },
    notes: "Open-source + German-made; turnkey 10% affiliate, wholesale via email.",
  },
  {
    id: "yubico",
    name: "Yubico / YubiKey",
    country: "SE",
    category: "security-key",
    url: "https://www.yubico.com",
    description: "Swedish market-leader in FIDO2 hardware keys, but premium-priced and channel-gated.",
    products: ["YubiKey 5 NFC / 5C NFC (~€101)", "5 FIPS (~€105)", "Security Key Series (cheaper)"],
    priceRange: "~€101",
    reseller: {
      available: "yes",
      signupUrl: "https://partners.yubico.com/",
      dropshipFriendly: false,
      terms: "YubiNation 4-tier channel via authorized distributors (deal-registration); hard for a small reseller.",
    },
    affiliate: {
      available: "unclear",
      signupUrl: "https://affiliate-program.amazon.com",
      network: "Amazon Associates only (Yubico's own program retired)",
      commission: "~10% via Amazon",
    },
    notes: "High margin but distributor-gated; only Amazon-affiliate route for publishers.",
  },

  // ─── SEED BACKUP & PRIVACY GADGETS ──────────────────────────────────────────
  {
    id: "cryptosteel",
    name: "Cryptosteel",
    country: "PL",
    category: "seed-backup",
    url: "https://cryptosteel.com",
    description:
      "Polish metal seed-phrase backups — the only brand found with BOTH a drop-ship-capable wholesale platform and an affiliate program.",
    products: ["Capsule Solo", "Cassette", "Seed12 / Seed24"],
    priceRange: "€55–€99",
    reseller: {
      available: "yes",
      signupUrl: "https://cryptosteel.com/become-a-reseller/",
      dropshipFriendly: true,
      terms: "Account approval, bulk discounts, direct-delivery/drop-ship option, crypto payment accepted.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://cryptosteel.com/affiliate-program/",
      network: "in-house",
      commission: "10%, 30-day cookie",
    },
    notes: "Gold standard for this model: confirmed dropship wholesale + 10% affiliate.",
  },
  {
    id: "cryptotag",
    name: "Cryptotag",
    country: "NL",
    category: "seed-backup",
    url: "https://cryptotag.io",
    description: "Dutch titanium seed-backup kits with a large existing reseller network.",
    products: ["Zeus / Loki / Thor titanium kits"],
    priceRange: "~€60–€130 (confirm)",
    reseller: {
      available: "yes",
      signupUrl: "https://cryptotag.io/resellers/",
      dropshipFriendly: undefined,
      terms: "Email contact only; MOQ/terms undisclosed.",
    },
    affiliate: { available: "no" },
    notes: "Made-in-Netherlands; must email for wholesale terms.",
  },
  {
    id: "spy-fy",
    name: "Spy-Fy",
    country: "NL",
    category: "privacy-gadget",
    url: "https://spy-fy.com",
    description:
      "Dutch one-stop source for physical privacy gadgets — the easiest way to stock the whole accessory category.",
    products: [
      "USB data blockers",
      "Webcam covers",
      "RFID-blocking wallets",
      "Microphone blockers",
      "Faraday bags (from €44.95)",
      "Privacy phone cases (€53.95–€56.95)",
    ],
    priceRange: "€8–€57",
    reseller: {
      available: "yes",
      signupUrl: "https://spy-fy.com/pages/for-business",
      dropshipFriendly: undefined,
      terms: "B2B / custom-branded program, free samples; MOQ undisclosed (contact wesley@spy-fy.com).",
    },
    affiliate: { available: "no" },
    notes: "Best single supplier for the small privacy-gadget category (covers + blockers + Faraday).",
  },

  // ─── COMPUTERS & NETWORKING ─────────────────────────────────────────────────
  {
    id: "turris",
    name: "Turris (CZ.NIC)",
    country: "CZ",
    category: "networking",
    url: "https://www.turris.com",
    description:
      "Czech open-source privacy routers from the .CZ registry. Stocked SKUs (not built-to-order) → resale-viable.",
    products: ["Omnia NG (~€459 pre-VAT)", "Omnia NG Wired (~€420–499)", "MOX modular"],
    priceRange: "€420–€499",
    reseller: {
      available: "yes",
      signupUrl: "https://www.turris.com/en/",
      dropshipFriendly: true,
      terms: "Distributor/B2B via sales@turris.com; resold by Discomp, LinITX, Alza. Stocked SKU.",
    },
    affiliate: { available: "unclear" },
    notes: "Most resale-viable privacy networking hardware (stocked, not BTO).",
  },
  {
    id: "olimex",
    name: "Olimex",
    country: "BG",
    category: "computer",
    url: "https://www.olimex.com",
    description: "Bulgarian open-source single-board computers and dev boards — low-cost, easy to stock and ship.",
    products: ["OLinuXino SBCs", "dev boards (€20–€80)", "TERES open-hardware laptop kit"],
    priceRange: "€20–€80 (boards)",
    reseller: {
      available: "yes",
      signupUrl: "https://www.olimex.com/Distributors/",
      dropshipFriendly: true,
      terms: "Qualified distributor program (info@olimex.com); existing channel: Mouser, DigiKey, TME.",
    },
    affiliate: { available: "no" },
    notes: "Boards ship easily vs. laptops — good low-cost stockable line.",
  },
  {
    id: "novacustom",
    name: "NovaCustom",
    country: "NL",
    category: "computer",
    url: "https://novacustom.com",
    description:
      "Dutch privacy laptops with Dasharo/coreboot open firmware — highly on-brand; strongest combined affiliate+B2B offer.",
    products: ["PrivacyGuard / SecurityTitan Linux laptops"],
    priceRange: "€1,000+",
    reseller: {
      available: "yes",
      signupUrl: "https://novacustom.com/clevo-reseller-europe/",
      dropshipFriendly: false,
      terms: "B2B partner platform; laptops are built-to-order (poor dropship fit).",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://novacustom.com/clevo-reseller-europe/",
      network: "in-house",
      commission: "5%",
    },
    notes: "Built-to-order → promote via the 5% affiliate rather than dropship.",
  },
  {
    id: "tuxedo",
    name: "TUXEDO Computers",
    country: "DE",
    category: "computer",
    url: "https://www.tuxedocomputers.com",
    description: "German Linux laptops (InfinityBook / Stellaris). Built-to-order → poor dropship fit.",
    products: ["InfinityBook Pro", "Stellaris (~€1,100–€2,500)"],
    priceRange: "€1,100–€2,500",
    reseller: {
      available: "yes",
      signupUrl: "https://www.tuxedocomputers.com/en/B2B.tuxedo",
      dropshipFriendly: false,
      terms: "Business-customer registration (reseller@tuxedocomputers.com), no MOQ, custom B2B quotes; BTO units.",
    },
    affiliate: { available: "unclear" },
    notes: "Built-to-order; pursue referral/affiliate rather than dropship.",
  },

  // ─── PHONES & SMART-HOME ────────────────────────────────────────────────────
  {
    id: "shelly",
    name: "Shelly",
    country: "BG",
    category: "smart-home",
    url: "https://www.shelly.com",
    description:
      "Bulgarian Wi-Fi smart relays/plugs/sensors — cheap impulse-buy price points and the easiest dual monetization (reseller + networked affiliate).",
    products: ["Relays, plugs, sensors, bulbs (mostly €10–€40)"],
    priceRange: "€10–€40",
    reseller: {
      available: "yes",
      signupUrl: "https://www.shelly.com/pages/resellers",
      dropshipFriendly: true,
      terms: "Reseller/partner program (sales@shelly.com); EU wholesale distributors exist.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://www.flexoffers.com/affiliate-programs/shelly-eu-us-affiliate-program/",
      network: "FlexOffers",
      commission: "~7%, 30-day cookie",
    },
    notes: "Easiest dual-monetization: clear reseller + 7% affiliate, low-priced impulse items.",
  },
  {
    id: "nuki",
    name: "Nuki",
    country: "AT",
    category: "smart-home",
    url: "https://nuki.io",
    description: "Austrian smart locks with the most mature reseller program of the gadget group (700+ partners).",
    products: ["Smart Lock Pro 5th gen (€269)", "Smart Lock Go", "Keypad", "Bridge"],
    priceRange: "€99–€269",
    reseller: {
      available: "yes",
      signupUrl: "https://pro.nuki.io/en/member-register/",
      dropshipFriendly: undefined,
      terms: "Nuki Pro partner program, exclusive reseller pricing + volume discounts (aimed at security/electrical trades).",
    },
    affiliate: { available: "unclear" },
    notes: "Mature reseller program with strong upsell value.",
  },
  {
    id: "mudita",
    name: "Mudita",
    country: "PL",
    category: "phone",
    url: "https://mudita.com",
    description: "Polish minimalist E-Ink phones and low-distraction devices.",
    products: ["Kompakt E-Ink phone (€439)", "Mudita Pure", "Harmony alarm clocks"],
    priceRange: "€439 (phone)",
    reseller: {
      available: "yes",
      signupUrl: "https://mudita.com/for-retailers/",
      dropshipFriendly: false,
      terms: "Retail wholesale (request price table); VAT invoice, 24-mo warranty, reseller handles customs.",
    },
    affiliate: {
      available: "yes",
      signupUrl: "https://mudita.com/",
      network: "Kickbooster (campaign-tied)",
      commission: "10% per pledge (crowdfunding campaigns, not the standing store)",
    },
    notes: "Wholesale fits manual-order reselling; affiliate only runs during crowdfunding campaigns.",
  },
  {
    id: "fairphone",
    name: "Fairphone",
    country: "NL",
    category: "phone",
    url: "https://www.fairphone.com",
    description: "Dutch modular, repairable, ethical smartphones — the strongest brand with a documented B2B reseller path.",
    products: ["Fairphone 6 (€599)", "Fairphone earbuds"],
    priceRange: "€599",
    reseller: {
      available: "yes",
      signupUrl: "https://www.fairphone.com/partner-program",
      dropshipFriendly: undefined,
      terms: "Sales-Partner program with B2B shop, training, marketing tools; conditions not public.",
    },
    affiliate: {
      available: "no",
      commission: "refer-a-friend only (€25 friend discount / €20 reward)",
    },
    notes: "Good reseller path; no true publisher affiliate — only refer-a-friend.",
  },
];

/** Produkter med et bekreftet reseller-program (kandidater for dropship-modellen). */
export function productsWithReseller(): PhysicalProduct[] {
  return PRODUCTS.filter((p) => p.reseller.available === "yes");
}

/** Produkter med et bekreftet affiliate-program. */
export function productsWithAffiliate(): PhysicalProduct[] {
  return PRODUCTS.filter((p) => p.affiliate.available === "yes");
}
