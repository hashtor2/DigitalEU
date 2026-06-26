import { useParams, Link } from "react-router-dom";
import { ALTERNATIVES, getAffiliateUrl, hasVerifiedAffiliate, type ServiceCategory } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { COUNTRY_FLAGS } from "@/lib/flags";
import { TrustBadges } from "@/components/TrustBadges";

const COMPLEMENTARY_CATEGORY_MAP: Record<ServiceCategory, ServiceCategory[]> = {
  email: ["cloud-storage", "password-manager", "vpn"],
  vpn: ["browser", "search", "messaging"],
  "cloud-storage": ["email", "office", "password-manager"],
  browser: ["search", "vpn", "password-manager"],
  "password-manager": ["email", "browser", "security"],
  search: ["browser", "vpn", "email"],
  office: ["cloud-storage", "messaging", "project-management"],
  messaging: ["email", "vpn", "security"],
  "code-hosting": ["cloud-infra", "project-management", "security"],
  "cloud-infra": ["code-hosting", "security", "analytics"],
  analytics: ["cloud-infra", "security", "project-management"],
  hardware: ["security", "vpn", "browser"],
  ai: ["cloud-infra", "security", "analytics"],
  fintech: ["security", "analytics", "project-management"],
  "project-management": ["messaging", "office", "code-hosting"],
  security: ["password-manager", "vpn", "browser"],
  social: ["messaging", "browser", "search"],
  transport: ["fintech", "security", "analytics"],
};

export function AlternativePage() {
  const { id } = useParams<{ id: string }>();

  const alternative = ALTERNATIVES.find((a) => a.id === id);

  if (!alternative) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-2">Alternative not found</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">The alternative you're looking for doesn't exist.</p>
          <Link
            to="/directory"
            className="inline-block px-4 py-2 rounded-sm bg-accent text-white hover:bg-accent-hover transition"
          >
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const affiliateUrl = getAffiliateUrl(alternative.id, alternative.url);
  const hasAffiliate = hasVerifiedAffiliate(alternative.id);

  const replacesServices = alternative.replaces || [];

  const complementaryCategories = COMPLEMENTARY_CATEGORY_MAP[alternative.category] || [];
  const crossLinkedAlternatives = ALTERNATIVES.filter(
    (entry) => entry.id !== alternative.id && complementaryCategories.includes(entry.category)
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <title>{alternative.name} — European Alternative to {replacesServices.join(", ")} | digitaleu.me</title>
      <meta name="description" content={`Read about ${alternative.name}, a secure European alternative to ${replacesServices.join(" and ")} hosted in ${alternative.dataLocation || alternative.country}.`} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": alternative.name,
          "applicationCategory": alternative.category,
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": alternative.pricing?.includes("Free") ? "0" : "custom",
            "priceCurrency": "EUR"
          },
          "description": alternative.description,
          "publisher": {
            "@type": "Organization",
            "name": "DigitalEU",
            "url": "https://digitaleu.me"
          }
        })}
      </script>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-text-secondary dark:text-dark-text-secondary">
          <Link to="/directory" className="hover:text-text-primary dark:hover:text-dark-text-primary transition">
            Directory
          </Link>
          <span>/</span>
          <span className="text-text-primary dark:text-dark-text-primary">{alternative.name}</span>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-start gap-6 mb-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-sm bg-surface dark:bg-dark-surface border border-border dark:border-dark-border overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${alternative.url}&sz=64`}
                alt={alternative.name}
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-4xl font-bold">{alternative.name}</h1>
                <span className="rounded-sm border border-accent/25 bg-accent/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  Sovereign EU Tech
                </span>
              </div>
              <div className="mb-2">
                <TrustBadges alternative={alternative} />
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-dark-text-secondary">
                <span>{COUNTRY_FLAGS[alternative.country] || ""} {alternative.country}</span>
                {alternative.dataLocation && (
                  <>
                    <span>·</span>
                    <span>📍 {alternative.dataLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {alternative.pricing && (
              <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary uppercase font-mono mb-1">Pricing</p>
                <p className="text-sm text-text-primary dark:text-dark-text-primary font-semibold">{alternative.pricing}</p>
              </div>
            )}
            {alternative.category && (
              <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary uppercase font-mono mb-1">Category</p>
                <p className="text-sm text-text-primary dark:text-dark-text-primary capitalize font-semibold">
                  {alternative.category.replace("-", " ")}
                </p>
              </div>
            )}
            {(alternative.dataLocation || alternative.country) && (
              <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary uppercase font-mono mb-1">Jurisdiction</p>
                <p className="text-sm text-text-primary dark:text-dark-text-primary font-semibold">{alternative.country} (GDPR / EU-Residency)</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Description */}
        <div className="mb-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary font-normal">
              {alternative.longDescription || alternative.description}
            </p>
          </div>
        </div>

        {/* Features */}
        {alternative.features && alternative.features.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Key Privacy & Operational Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternative.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4 hover:border-accent/20 transition"
                >
                  <span className="text-accent flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replaces Section */}
        {replacesServices.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-dark-text-primary">
              Replaces {replacesServices.length === 1 ? "service" : "services"}
            </h2>
            <div className="space-y-2">
              {replacesServices.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-sm border border-orange-500/20 bg-orange-500/5 px-4 py-3"
                >
                  <span className="text-orange-400">→</span>
                  <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tested By Us Section */}
        <div className="mb-10 rounded-sm border border-accent/30 bg-accent/5 p-6">
          <h2 className="text-lg font-semibold mb-4 text-accent flex items-center gap-2">
            <span>✓ Tested by us</span>
          </h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
            All outbound links on DigitalEU.me are carefully curated. Click below to visit {alternative.name}.
          </p>

          <div className="space-y-3">
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-sm">
                Try {alternative.name} {hasAffiliate ? "(Affiliate link)" : ""}
              </Button>
            </a>

            {alternative.relatedGuides && alternative.relatedGuides.length > 0 && (
              <div className="pt-3 border-t border-accent/20">
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary uppercase font-mono mb-3">Related Guides</p>
                <div className="space-y-2">
                  {alternative.relatedGuides.map((guideId) => (
                    <Link
                      key={guideId}
                      to={`/guides/${guideId}`}
                      className="block px-4 py-2 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 transition"
                    >
                      📖 How to migrate to {alternative.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-accent/20 flex flex-wrap gap-2">
              <a
                href={`${alternative.url}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary underline transition"
              >
                Privacy Policy
              </a>
              <span className="text-text-secondary/40 dark:text-dark-text-secondary/40">·</span>
              <a
                href={alternative.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary underline transition"
              >
                Official Website
              </a>
            </div>
          </div>
        </div>

        {/* Cross-links: complete your stack */}
        {crossLinkedAlternatives.length > 0 && (
          <div className="mb-10 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
            <h2 className="text-lg font-semibold mb-2 text-text-primary dark:text-dark-text-primary">Complete your stack</h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
              Teams replacing {replacesServices.join(", ") || "Big Tech"} often combine {alternative.name} with these categories.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {crossLinkedAlternatives.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/alternative/${entry.id}`}
                  className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-3 hover:border-accent/30 transition"
                >
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1">{entry.name}</p>
                  <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary mb-2 uppercase tracking-wide">{entry.category.replace("-", " ")}</p>
                  <TrustBadges alternative={entry} compact />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Directory */}
        <div className="text-center pt-6 border-t border-border dark:border-dark-border">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition"
          >
            ← Back to all alternatives
          </Link>
        </div>
    </div>
  );
}
