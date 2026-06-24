import { hasVerifiedAffiliate, type Alternative } from "@digitaleu/shared";

interface TrustBadgesProps {
  alternative: Alternative;
  compact?: boolean;
}

type Badge = {
  key: string;
  label: string;
  className: string;
};

const EEA_JURISDICTIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS",
  "LI", "NO", "CH", "EU",
]);

function hasEuDataSignal(alternative: Alternative): boolean {
  if (EEA_JURISDICTIONS.has(alternative.country.toUpperCase())) {
    return true;
  }

  const location = (alternative.dataLocation || "").toLowerCase();
  return ["eu", "europe", "switzerland", "norway", "gdpr"].some((keyword) =>
    location.includes(keyword)
  );
}

function hasOpenSourceSignal(alternative: Alternative): boolean {
  const haystacks = [
    alternative.description,
    alternative.longDescription || "",
    ...(alternative.features || []),
  ].join(" ").toLowerCase();

  return (
    haystacks.includes("open-source") ||
    haystacks.includes("open source") ||
    haystacks.includes("self-host") ||
    haystacks.includes("self hosted")
  );
}

function buildBadges(alternative: Alternative): Badge[] {
  const badges: Badge[] = [];

  if (hasEuDataSignal(alternative)) {
    badges.push({
      key: "eu-data",
      label: "EU/EEA data region",
      className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    });
  }

  if (hasVerifiedAffiliate(alternative.id) || alternative.verifiedAffiliate) {
    badges.push({
      key: "verified",
      label: "Tested partner",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    });
  }

  if (hasOpenSourceSignal(alternative)) {
    badges.push({
      key: "open-source",
      label: "Open source option",
      className: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    });
  }

  if ((alternative.relatedGuides || []).length > 0) {
    badges.push({
      key: "guide",
      label: "Migration guide",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    });
  }

  return badges;
}

export function TrustBadges({ alternative, compact = false }: TrustBadgesProps) {
  const badges = buildBadges(alternative);
  const visibleBadges = compact ? badges.slice(0, 2) : badges;

  if (visibleBadges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleBadges.map((badge) => (
        <span
          key={badge.key}
          className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
