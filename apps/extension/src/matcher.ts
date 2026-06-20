/**
 * Service matching engine.
 *
 * Takes normalized raw entries from the parser and maps them against
 * DOMAIN_MAPPINGS to produce UploadedAccountEntry results with confidence levels.
 */

import { DOMAIN_MAPPINGS } from "@digitaleu/shared";
import type {
  UploadedAccountEntry,
  MatchConfidenceLevel,
  UploadedAccountFileType,
} from "@digitaleu/shared";
import type { RawEntry } from "./parser";

function buildDomainIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const m of DOMAIN_MAPPINGS) {
    index.set(m.domain, m.id);
    for (const alt of m.alternativeDomains) {
      index.set(alt, m.id);
    }
  }
  return index;
}

const domainIndex = buildDomainIndex();

function matchDomain(domain: string): { serviceId: string; confidence: MatchConfidenceLevel } | null {
  // Exact hit
  const exact = domainIndex.get(domain);
  if (exact) return { serviceId: exact, confidence: "high" };

  // Strip www prefix and try again
  const stripped = domain.replace(/^www\./, "");
  const strippedHit = domainIndex.get(stripped);
  if (strippedHit) return { serviceId: strippedHit, confidence: "high" };

  // Try root domain (e.g. mail.netflix.com → netflix.com)
  const parts = domain.split(".");
  if (parts.length > 2) {
    const root = parts.slice(-2).join(".");
    const rootHit = domainIndex.get(root);
    if (rootHit) return { serviceId: rootHit, confidence: "medium" };
  }

  return null;
}

function getServiceName(serviceId: string): string {
  return DOMAIN_MAPPINGS.find((m) => m.id === serviceId)?.serviceName ?? serviceId;
}

let _counter = 0;
function genId(): string {
  return `entry-${Date.now()}-${++_counter}`;
}

export function matchEntries(
  rawEntries: RawEntry[],
  sourceType: UploadedAccountFileType
): UploadedAccountEntry[] {
  return rawEntries.map((raw): UploadedAccountEntry => {
    // Try matching on domain first, then email domain part
    const domainToMatch = raw.domain;
    const hit = domainToMatch ? matchDomain(domainToMatch) : null;

    if (hit) {
      return {
        id: genId(),
        rawValue: raw.rawValue,
        email: raw.email,
        domain: raw.domain,
        sourceType,
        matchedServiceId: hit.serviceId,
        matchedServiceName: getServiceName(hit.serviceId),
        confidence: hit.confidence,
      };
    }

    return {
      id: genId(),
      rawValue: raw.rawValue,
      email: raw.email,
      domain: raw.domain,
      sourceType,
      confidence: "low",
    };
  });
}
