/**
 * Delte typer brukt av både web-appen (apps/web) og nettleserutvidelsen
 * (apps/extension). Dette er den eneste kilden til sannhet for datamodellen.
 */

/** Kategori et tjenestealternativ tilhører. */
export type ServiceCategory =
  | "email"
  | "vpn"
  | "cloud-storage"
  | "browser"
  | "password-manager"
  | "search"
  | "office"
  | "messaging"
  | "code-hosting"
  | "cloud-infra"
  | "analytics"
  | "hardware"
  | "ai"
  | "fintech"
  | "project-management"
  | "security"
  | "social"
  | "transport";

/**
 * Hvordan verktøyet tjener penger på et gitt alternativ.
 * "other" = ingen affiliate-relasjon ennå; rent redaksjonell oppføring.
 */
export type MonetizationModel = "affiliate" | "ethical-direct" | "other";

/** Et personvernvennlig, europeisk alternativ til en Big Tech-tjeneste. */
export interface Alternative {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2, f.eks. "CH", "SE", "DE". */
  country: string;
  category: ServiceCategory;
  /** Big Tech-produktene dette erstatter, f.eks. ["Gmail", "Outlook"]. */
  replaces: string[];
  url: string;
  description: string;
  monetization: MonetizationModel;
  /** Affiliate-lenke når monetization === "affiliate". */
  affiliateUrl?: string;
  /** Eksplisitt markedsoverride; utledet fra kategori hvis ikke satt. */
  market?: ('b2b' | 'b2c')[];

  // NEW: Detail page fields
  /** Detailed summary for /alternative/:id page (2-4 paragraphs) */
  longDescription?: string;
  /** Key features/benefits of this alternative */
  features?: string[];
  /** Pricing tier (e.g., "Free or €5.99/month", "Lifetime €99") */
  pricing?: string;
  /** Where data is stored: EU, US, etc. */
  dataLocation?: string;
  /** Related guide IDs to link from detail page */
  relatedGuides?: string[];
  /** Whether this is a "tested by us" recommendation with affiliate link */
  verifiedAffiliate?: boolean;
}

/** Målmarked for et alternativ. */
export type MarketSegment = 'b2b' | 'b2c';

/** To moduser for datahåndtering, jf. dashbordet. */
export type StorageMode = "guest" | "profile";

/** Status for migrering av én konto/tjeneste. */
export type MigrationStatus = "detected" | "in-progress" | "switched" | "skipped";

/** En konto oppdaget av innboksskanneren som kandidat for migrering. */
export interface DetectedAccount {
  id: string;
  /** Avsenderdomenet som avslørte kontoen, f.eks. "netflix.com". */
  domain: string;
  serviceName: string;
  status: MigrationStatus;
  /** Foreslått europeisk alternativ, hvis relevant. */
  suggestedAlternativeId?: string;
}

/**
 * Melding fra web-appen til utvidelsen for å autofylle ny e-postadresse
 * på en ekstern side (Netflix, Spotify, ...).
 */
export interface FillEmailMessage {
  type: "FILL_EMAIL";
  /** Ny e-postadresse, f.eks. "bruker@proton.me". */
  ny_epost: string;
  /** Målside å navigere til / fylle inn på. */
  targetUrl: string;
}


/** Kobling mellom et avsenderdomene og en B2C-tjeneste, brukt av innboksskanneren og utvidelsen. */
export interface DomainMapping {
  id: string;
  serviceName: string;
  /** Primærdomene, f.eks. "netflix.com". */
  domain: string;
  /** Liste over alternative avsenderdomener, f.eks. ["info.netflix.com", "mail.netflix.com"]. */
  alternativeDomains: string[];
  /** Kategori for sortering, f.eks. "entertainment" eller "social". */
  category: string;
  /** URL til siden der brukeren kan endre e-postadresse. */
  settingsUrl: string;
  /** Standard foreslått europeisk alternativ-ID, f.eks. "proton-mail". */
  suggestedAlternativeId?: string;
}

/** Tillatte filtyper for manuell kontoopplasting i V1. */
export type UploadedAccountFileType = "csv" | "json" | "txt";

/** Hvor sikkert en opplastet konto ble matchet mot en kjent tjeneste. */
export type MatchConfidenceLevel = "high" | "medium" | "low";

/** En normalisert konto oppdaget i opplastet fil. */
export interface UploadedAccountEntry {
  id: string;
  /** Rålinje eller råverdi fra filen (trimmet). */
  rawValue: string;
  /** Normalisert e-post, hvis funnet. */
  email?: string;
  /** Normalisert domene (fra e-post/URL/domeneverdi). */
  domain?: string;
  sourceType: UploadedAccountFileType;
  matchedServiceId?: string;
  matchedServiceName?: string;
  confidence: MatchConfidenceLevel;
}

/** Ett steg i den obligatoriske sikkerhetsstigen for sletting av konto. */
export type DeleteSafetyStep =
  | "confirm-site-and-account"
  | "confirm-irreversible"
  | "confirm-backup-considered"
  | "confirm-final-execute";

/** Handlingstyper i en guide/playbook. */
export type PlaybookActionType =
  | "navigate"
  | "wait-for-selector"
  | "click"
  | "fill"
  | "instruction"
  | "confirm";

/** Enkelt steg i en playbook. */
export interface PlaybookStep {
  id: string;
  title: string;
  actionType: PlaybookActionType;
  /** CSS-selector når steget trenger DOM-mål. */
  selector?: string;
  /** Fallback-instruks når automatisk handling ikke lykkes. */
  fallbackInstruction?: string;
}

/** Støttede guide-typer i V1. */
export type GuideType = "change-email" | "delete-account" | "data-export" | "login";

/** Kjøringsstatus for en aktiv eller tidligere guide. */
export type GuideRunStatus = "not-started" | "in-progress" | "blocked" | "completed";

/** Sporbar status for guidet kjøring per tjeneste. */
export interface GuideRunState {
  serviceId: string;
  guideType: GuideType;
  status: GuideRunStatus;
  currentStepId?: string;
  startedAt?: string;
  completedAt?: string;
  completedByUserConfirmation: boolean;
  deleteSafetyStepsCompleted?: DeleteSafetyStep[];
}

/** Dimensjoner i personvern-score (V1-rubrikk). */
export type PrivacyRatingDimension =
  | "data-collection"
  | "third-party-sharing"
  | "deletion-clarity"
  | "export-portability"
  | "security-posture"
  | "jurisdiction";

/** En detaljscore per dimensjon (0-5). */
export interface PrivacyDimensionScore {
  dimension: PrivacyRatingDimension;
  score: number;
  reason: string;
}

/** Aggregert personvernscore per tjeneste (0-100). */
export interface PrivacyRating {
  serviceId: string;
  totalScore: number;
  confidence: MatchConfidenceLevel;
  dimensions: PrivacyDimensionScore[];
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fysiske produkter (EU-laget hardware vi kan videreselge eller tjene affiliate på)
// ─────────────────────────────────────────────────────────────────────────────

/** Produktkategori for fysiske produkter. */
export type ProductCategory =
  | "crypto-wallet"
  | "security-key"
  | "seed-backup"
  | "privacy-gadget"
  | "computer"
  | "networking"
  | "phone"
  | "smart-home";

/** Tilgjengelighet for et program: bekreftet, ikke funnet, eller uavklart. */
export type ProgramAvailability = "yes" | "no" | "unclear";

/**
 * Reseller-/grossist-/dropship-program. Relevant for vår manuelle
 * bestillingsmodell (kunde bestiller hos oss → vi videresender til produsent
 * som sender direkte til kunden).
 */
export interface ResellerProgram {
  available: ProgramAvailability;
  /** Søknads-/kontakt-URL, eller e-post hvis det er eneste vei inn. */
  signupUrl?: string;
  /** Om dropshipping (produsent sender direkte til kunde) er eksplisitt mulig. */
  dropshipFriendly?: boolean;
  /** Minste bestilling, margin, vilkår — fritekst der det er kjent. */
  terms?: string;
}

/** Affiliate-/henvisningsprogram for et produkt eller en tjeneste. */
export interface AffiliateProgram {
  available: ProgramAvailability;
  signupUrl?: string;
  /** "in-house", "Impact", "Awin", "CJ", "PartnerStack", "FlexOffers", ... */
  network?: string;
  /** Kommisjon/utbetaling slik den er offentlig oppgitt. */
  commission?: string;
}

/**
 * Et fysisk, europeisk produkt vi kan videreselge (resell/dropship) eller tjene
 * affiliate på. Skilt fra `Alternative` (programvare/tjenester) fordi
 * monetiseringen og logistikken er fundamentalt annerledes.
 */
export interface PhysicalProduct {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2, f.eks. "CZ", "FR", "SE". */
  country: string;
  category: ProductCategory;
  url: string;
  description: string;
  /** Konkrete produkter + ca. pris. */
  products: string[];
  /** Ca. prisspenn, f.eks. "€22–€37". */
  priceRange?: string;
  reseller: ResellerProgram;
  affiliate: AffiliateProgram;
  /** Sikkerhets-/logistikk-merknad (f.eks. tamper-følsomhet på wallets). */
  notes?: string;
}

/** Lokal tilstand for utvidelsen (lagres kun i browser storage.local). */
export interface ExtensionLocalState {
  targetEmail?: string;
  switchedCount?: number;
  uploadedEntries?: UploadedAccountEntry[];
  guideRuns?: GuideRunState[];
  privacyRatings?: PrivacyRating[];
}
