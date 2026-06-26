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


/**
 * Direkte lenker til handlingsider for en tjeneste.
 * Brukes av Account Action Cards (Tool 1) i Migration Toolkit.
 */
export interface ServiceActions {
  /** URL til side for å bytte e-postadresse. Seeder fra settingsUrl hvis ikke satt separat. */
  changeEmailUrl?: string;
  /** URL til side for å slette kontoen. */
  deleteAccountUrl?: string;
  /** URL til side for å eksportere data (GDPR Art. 20). */
  dataExportUrl?: string;
  /** Hvor vanskelig tjenesten gjør det å utføre handlingene. */
  difficulty?: "easy" | "medium" | "hard";
  /** Kortmerknad til brukeren, f.eks. "Krever e-postbekreftelse for sletting". */
  notes?: string;
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
  /** Direkte handlingslenker for Migration Toolkit Tool 1. */
  actions?: ServiceActions;
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
  /** CSS-selector når steget trenger DOM-mål. (Nå brukt som hint) */
  selector?: string;
  /** NEW: Text content to match for (e.g. "Cancel Subscription") */
  textContentHint?: string;
  /** NEW: ARIA label to match for (e.g. "Email address") */
  ariaLabelHint?: string;
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

/** Lokal tilstand for utvidelsen (lagres kun i browser storage.local). */
export interface ExtensionLocalState {
  targetEmail?: string;
  switchedCount?: number;
  uploadedEntries?: UploadedAccountEntry[];
  guideRuns?: GuideRunState[];
  privacyRatings?: PrivacyRating[];
}
