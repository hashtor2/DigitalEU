/**
 * domainMatching.ts — Match extracted domains against the services catalog
 *
 * Takes a list of sender domains and matches them against known B2C services
 * to suggest European alternatives.
 *
 * 100% client-side logic — runs in browser after backend returns domains.
 */

import type { DetectedAccount } from "@digitaleu/shared";
import { ALTERNATIVES, DOMAIN_MAPPINGS } from "@digitaleu/shared";

export interface Sender {
  domain: string;
  displayName: string;
  count: number;
}

/**
 * Match sender domains against the services catalog.
 * Returns a list of detected accounts with suggested EU alternatives.
 *
 * @param senders Array of sender domains extracted from email
 * @returns DetectedAccount[] sorted by frequency
 */
export function matchDomainsToServices(senders: Sender[]): DetectedAccount[] {
  const detected: DetectedAccount[] = [];
  const seen = new Set<string>();

  for (const sender of senders) {
    if (seen.has(sender.domain)) continue; // Deduplicate

    // Find mapping for this domain
    const mapping = DOMAIN_MAPPINGS.find(
      (m) =>
        m.domain === sender.domain ||
        m.alternativeDomains?.includes(sender.domain)
    );

    if (mapping) {
      // Find the suggested alternative
      const alt = ALTERNATIVES.find(
        (a) => a.id === mapping.suggestedAlternativeId
      );

      detected.push({
        id: sender.domain,
        domain: sender.domain,
        serviceName: mapping.serviceName,
        status: "detected",
        suggestedAlternativeId: alt?.id,
      });

      seen.add(sender.domain);
    }
  }

  // Sort by sender frequency (most common first)
  return detected.sort((a, b) => {
    const countA = senders.find((s) => s.domain === a.domain)?.count ?? 0;
    const countB = senders.find((s) => s.domain === b.domain)?.count ?? 0;
    return countB - countA;
  });
}
