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
  | "messaging";

/** Hvordan verktøyet tjener penger på et gitt alternativ. */
export type MonetizationModel = "affiliate" | "ethical-direct";

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
}

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
