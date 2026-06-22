/**
 * Centralized affiliate link management for all EU alternatives.
 * This is the ONLY place where outbound links are defined.
 * All user-facing links to services go through this system.
 *
 * Format:
 * - alternativeId: maps to Alternative.id
 * - url: affiliate URL if we have one, otherwise official site
 * - verified: true if this affiliate link has been tested/confirmed
 * - type: "affiliate" (revenue-generating) or "official" (fallback)
 */

export type AffiliateLink = {
  alternativeId: string;
  url: string;
  verified: boolean;
  type: 'affiliate' | 'official';
  lastUpdated: string;
};

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  // ─── Email ───
  'proton-mail': {
    alternativeId: 'proton-mail',
    url: 'https://go.getproton.me/SH1mR',
    verified: true,
    type: 'affiliate',
    lastUpdated: '2026-06-20',
  },
  'proton-vpn': {
    alternativeId: 'proton-vpn',
    url: 'https://go.getproton.me/SH1mR',
    verified: true,
    type: 'affiliate',
    lastUpdated: '2026-06-20',
  },
  'proton-drive': {
    alternativeId: 'proton-drive',
    url: 'https://go.getproton.me/SH1mR',
    verified: true,
    type: 'affiliate',
    lastUpdated: '2026-06-20',
  },
  'proton-pass': {
    alternativeId: 'proton-pass',
    url: 'https://go.getproton.me/SH1mR',
    verified: true,
    type: 'affiliate',
    lastUpdated: '2026-06-20',
  },
  'pcloud': {
    alternativeId: 'pcloud',
    url: 'https://partner.pcloud.com/r/digitaleu',
    verified: true,
    type: 'affiliate',
    lastUpdated: '2026-06-20',
  },
  'codeberg': {
    alternativeId: 'codeberg',
    url: 'https://codeberg.org',
    verified: true,
    type: 'official',
    lastUpdated: '2026-06-20',
  },
  // ─── Add more as we have affiliate links ───
  // For now, unmapped alternatives will fall back to their official URL in AlternativePage
};

/**
 * Get the correct outbound link for an alternative.
 * Returns affiliate link if available, otherwise official site.
 */
export function getAffiliateUrl(alternativeId: string, officialUrl: string): string {
  const link = AFFILIATE_LINKS[alternativeId];
  return link?.url || officialUrl;
}

/**
 * Check if an alternative has a verified affiliate link
 */
export function hasVerifiedAffiliate(alternativeId: string): boolean {
  const link = AFFILIATE_LINKS[alternativeId];
  return !!(link?.verified && link.type === 'affiliate');
}
