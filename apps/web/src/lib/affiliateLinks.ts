/**
 * Affiliate links and tracking utilities for DigitalEU scanner
 */

export const PROTON_AFFILIATE_CONFIG = {
  // TODO: Update with actual Proton affiliate ID after onboarding
  affiliateId: "digitaleu",
  baseUrl: "https://proton.me/mail",
  trackingParams: {
    utm_source: "digitaleu",
    utm_medium: "affiliate",
    utm_campaign: "scanner",
  },
};

/**
 * Get Proton affiliate URL with tracking parameters
 */
export const getProtonAffiliateUrl = (): string => {
  const params = new URLSearchParams(PROTON_AFFILIATE_CONFIG.trackingParams);
  // TODO: Add affiliate ID to URL once available from Proton
  return `${PROTON_AFFILIATE_CONFIG.baseUrl}?${params.toString()}`;
};

/**
 * Track affiliate click in Plausible analytics
 */
export const trackAffiliateClick = (provider: string): void => {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible("Affiliate Click", {
      props: {
        provider,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Log affiliate conversion (payment success)
 */
export const trackAffiliateConversion = (
  provider: string,
  amount: number,
  currency: string
): void => {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible("Affiliate Conversion", {
      props: {
        provider,
        amount,
        currency,
        timestamp: new Date().toISOString(),
      },
    });
  }
};