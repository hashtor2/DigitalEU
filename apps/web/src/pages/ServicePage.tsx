import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ALTERNATIVES, type Alternative } from "@digitaleu/shared";
import { COUNTRY_FLAGS } from "@/lib/flags";
import {
  fetchServiceProfile,
  fetchServiceIncidents,
  PRIVACY_ATTRIBUTES,
  type ServiceProfile,
  type ServiceIncident,
} from "@/lib/serviceProfiles";

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

function StarRating({ stars, estimated }: { stars: number; estimated?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`text-lg leading-none select-none ${i < stars ? "text-amber-400" : "text-text-secondary/30 dark:text-dark-text-secondary/30"}`}
          >
            ★
          </span>
        ))}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{stars}</span>
        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">/10</span>
      </div>
      {estimated && (
        <span className="text-[10px] text-text-secondary dark:text-dark-text-secondary font-mono uppercase tracking-wide">estimated</span>
      )}
      {!estimated && (
        <span className="text-[10px] text-text-secondary dark:text-dark-text-secondary font-mono uppercase tracking-wide">privacy score</span>
      )}
    </div>
  );
}

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high:     "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low:      "bg-border/40 text-text-secondary border-border",
};

const COUNTRY_JURISDICTION: Record<string, string> = {
  CH: "Swiss nFADP — stricter than GDPR in some areas, GDPR-adequate, and not subject to the US CLOUD Act.",
  DE: "German BDSG + GDPR. Germany has some of Europe's most rigorous data protection enforcement.",
  SE: "Swedish IMY enforces GDPR. Strong digital rights tradition.",
  FI: "Finnish Tietosuojavaltuutettu. Strong digital rights and GDPR enforcement.",
  NO: "Norwegian Datatilsynet. Part of EEA — applies GDPR directly.",
  IS: "Icelandic Persónuvernd. Part of EEA. No mass surveillance programmes.",
  NL: "Dutch Autoriteit Persoonsgegevens. Active DPA with significant enforcement history.",
  FR: "French CNIL. Active enforcement. Note: France has domestic intelligence laws.",
  AT: "Austrian Datenschutzbehörde. GDPR jurisdiction.",
  BE: "Belgian GBA/APD. Active DPA, enforces GDPR for EU institutions.",
  DK: "Danish Datatilsynet. GDPR jurisdiction.",
  EE: "Estonian AKI. GDPR jurisdiction. Strong e-governance tradition.",
  LU: "Luxembourg CNPD. GDPR jurisdiction.",
  IT: "Italian Garante. One of Europe's most active DPAs.",
  ES: "Spanish AEPD. Active enforcement with significant fines.",
  PT: "Portuguese CNPD. GDPR jurisdiction.",
  PL: "Polish UODO. GDPR jurisdiction.",
  CZ: "Czech ÚOOÚ. GDPR jurisdiction.",
};

const CATEGORY_CONTEXT: Record<string, string> = {
  email: "Your inbox holds some of your most sensitive communications — health, finances, relationships. US providers like Gmail and Outlook operate under the CLOUD Act, meaning law enforcement can demand access without a local court order. European email runs under GDPR with no US legal backdoor.",
  vpn: "A VPN encrypts all traffic between your device and the internet, hiding your activity from your ISP and real IP from websites. European providers fall under GDPR and typically enforce stricter no-logs policies than US or offshore alternatives.",
  "cloud-storage": "Cloud storage providers can see everything you upload. US providers (Google Drive, Dropbox, OneDrive) fall under the CLOUD Act. European alternatives store files under GDPR — stronger access controls, right to deletion, and no US surveillance obligations.",
  "password-manager": "Your password manager holds the keys to your entire digital life. European providers are typically audited under GDPR and offer zero-knowledge architectures, meaning even the provider cannot access your vault.",
  browser: "Your browser sees every site you visit, every search you type, every form you fill. Chromium-based browsers from US companies ship with telemetry enabled. European and independent alternatives default to privacy-first configurations.",
  search: "Search engines build detailed profiles of your interests, politics, and health concerns from your queries. European search tools are subject to GDPR and typically implement no-tracking policies at the architecture level.",
  messaging: "Metadata from messaging (who you talk to, when, how often) can be as revealing as the content itself. European and open-source providers default to end-to-end encryption and minimal metadata retention.",
  "code-hosting": "Your repository contains intellectual property, credentials, and development workflow. European hosting keeps your code under GDPR and removes US jurisdiction exposure over proprietary source code.",
  "cloud-infra": "Infrastructure providers have root-level access to the servers your applications run on. European compute keeps customer data under GDPR and avoids CLOUD Act exposure.",
  analytics: "Web analytics track every visitor. GDPR requires explicit consent for most analytics. Privacy-first European tools are cookieless by design and never transfer data to US servers.",
  ai: "AI assistants process your prompts, which can include sensitive queries. European providers are subject to GDPR and the EU AI Act with clearer data deletion rights than US counterparts.",
  fintech: "Financial services handle sensitive payment data under PSD2 and GDPR. European fintechs operate under strong consumer financial protection with clear data rights.",
  "project-management": "Project tools store business plans, team communications, and internal docs. European providers keep this under GDPR with no US government access risk.",
  security: "Security tools often need deep system access. European providers cannot be compelled by US authorities to install backdoors or hand over data under foreign law.",
  social: "Social platforms collect large amounts of behavioural data. European alternatives have stronger privacy defaults and clearer data rights, though social networks inherently involve some data sharing.",
  transport: "Transport services collect detailed location and travel data. European providers are subject to GDPR's location data protections.",
  hardware: "European hardware is designed under EU product safety and data regulations.",
  office: "Office suites process your most sensitive documents. European providers keep files under GDPR with no US surveillance risk.",
};

const REPLACES_CONTEXT: Record<string, string> = {
  Gmail: "data-mines emails for ad targeting",
  "Google Drive": "scans files for ad profiling",
  "Google Docs": "processes documents on US servers",
  "Google Photos": "trains AI on your photos",
  "Google Search": "builds detailed profiles from queries",
  "Google Chrome": "sends browsing data to Google",
  "Google Analytics": "tracks visitors across the web",
  "Google Meet": "records and processes meetings",
  "Google Maps": "logs location history",
  Outlook: "subject to US CLOUD Act",
  OneDrive: "shares data with Microsoft advertising",
  Office: "telemetry-heavy, US-based processing",
  "Microsoft 365": "telemetry-heavy, US-based processing",
  Teams: "meeting data processed in US",
  GitHub: "US-hosted, Microsoft-owned",
  Slack: "US-hosted, messages accessible to Slack",
  Dropbox: "US-based, CLOUD Act exposure",
  ChatGPT: "trains on your conversations by default",
  "AWS": "US CLOUD Act jurisdiction",
  "Azure": "US CLOUD Act jurisdiction",
  "GCP": "US CLOUD Act jurisdiction",
  "Google Cloud": "US CLOUD Act jurisdiction",
  LastPass: "had major breach in 2022",
  "1Password": "US-based, proprietary",
  WhatsApp: "owned by Meta, metadata collected",
  iMessage: "Apple has US jurisdiction",
  Twitter: "US-based, sold to Musk in 2022",
  "X": "US-based, data practices opaque post-acquisition",
  Facebook: "extensive surveillance advertising model",
  Instagram: "owned by Meta, cross-app tracking",
  TikTok: "Chinese-owned, data transfer concerns",
  Trello: "owned by Atlassian, US-based",
  Asana: "US-based",
  Notion: "US-based, data stored in US",
  Stripe: "US-based, data under US CLOUD Act",
  PayPal: "US-based, sold data to advertisers, credential stuffing breach (2023)",
  "PayPal Credit": "US-based, financial data under US jurisdiction",
  Venmo: "owned by PayPal, US-based",
  Affirm: "US-based buy-now-pay-later",
  "Stripe (Poland)": "US-owned processor",
  Mailchimp: "owned by Intuit (US), email data mined for targeting",
  HubSpot: "US-based, broad data collection",
  Salesforce: "US-based, extensive customer data harvesting",
  Shopify: "Canadian, but US-aligned data practices",
  Greyhound: "US-based, location and travel data collected",
  Zoom: "US-based, privacy incidents; video content scanned",
  Figma: "acquired by Adobe (US), design data on US servers",
  Adobe: "US-based, subscription model with telemetry",
  Canva: "Australian but US-aligned data practices",
  Spotify: "Swedish origin but US HQ, extensive behavioral tracking",
  Netflix: "US-based, viewing habits sold to advertisers",
  Revolut: "UK-based, not EU-regulated bank",
  Cloudflare: "US-based, sits in front of your traffic",
  Datadog: "US-based, cloud infrastructure telemetry",
  Zendesk: "US-based, customer support data on US servers",
  Jira: "owned by Atlassian (US-Australian), project data in US",
  Confluence: "owned by Atlassian (US-Australian)",
  SendGrid: "owned by Twilio (US), email infrastructure in US",
  Twilio: "US-based, communications data in US",
  "GitLab (SaaS)": "US-based SaaS, code data in US",
  GitLab: "US-based SaaS, code data in US",
  Bitbucket: "owned by Atlassian (US-Australian)",
};

const REPLACES_DOMAINS: Record<string, string> = {
  Gmail: "gmail.com",
  "Google Drive": "drive.google.com",
  "Google Docs": "docs.google.com",
  "Google Photos": "photos.google.com",
  "Google Search": "google.com",
  "Google Chrome": "google.com",
  "Google Analytics": "analytics.google.com",
  "Google Meet": "meet.google.com",
  "Google Maps": "maps.google.com",
  "Google Cloud": "cloud.google.com",
  GCP: "cloud.google.com",
  Outlook: "outlook.com",
  OneDrive: "onedrive.live.com",
  Office: "office.com",
  "Microsoft 365": "microsoft.com",
  Teams: "teams.microsoft.com",
  Azure: "azure.microsoft.com",
  GitHub: "github.com",
  Slack: "slack.com",
  Zoom: "zoom.us",
  Dropbox: "dropbox.com",
  ChatGPT: "openai.com",
  AWS: "aws.amazon.com",
  LastPass: "lastpass.com",
  "1Password": "1password.com",
  WhatsApp: "whatsapp.com",
  iMessage: "apple.com",
  Twitter: "twitter.com",
  X: "x.com",
  Facebook: "facebook.com",
  Instagram: "instagram.com",
  TikTok: "tiktok.com",
  Trello: "trello.com",
  Asana: "asana.com",
  Notion: "notion.so",
  Stripe: "stripe.com",
  "Stripe (Poland)": "stripe.com",
  PayPal: "paypal.com",
  "PayPal Credit": "paypal.com",
  Venmo: "venmo.com",
  Affirm: "affirm.com",
  Greyhound: "greyhound.com",
  Mailchimp: "mailchimp.com",
  HubSpot: "hubspot.com",
  Salesforce: "salesforce.com",
  Shopify: "shopify.com",
  Cloudflare: "cloudflare.com",
  Figma: "figma.com",
  Adobe: "adobe.com",
  Canva: "canva.com",
  Spotify: "spotify.com",
  Netflix: "netflix.com",
  Revolut: "revolut.com",
  Zendesk: "zendesk.com",
  Jira: "atlassian.com",
  Confluence: "atlassian.com",
  Datadog: "datadoghq.com",
  SendGrid: "sendgrid.com",
  Twilio: "twilio.com",
  "GitLab (SaaS)": "gitlab.com",
  GitLab: "gitlab.com",
  Bitbucket: "bitbucket.org",
};

function getHeuristicStars(alt: Alternative): number {
  const COUNTRY_BASE: Record<string, number> = {
    CH: 9, IS: 9, SE: 8, FI: 8, NO: 8, EE: 8, DE: 8, NL: 8,
    AT: 7, FR: 7, BE: 7, DK: 7, LU: 7, IE: 7,
    IT: 7, ES: 7, PT: 7, PL: 6, CZ: 6, HU: 6, RO: 6,
  };
  const CATEGORY_OFFSET: Record<string, number> = {
    vpn: 1,
    "password-manager": 1,
    social: -2,
    analytics: -1,
    fintech: -1,
    transport: -1,
    ai: -1,
  };
  const base = COUNTRY_BASE[alt.country] ?? 6;
  const offset = CATEGORY_OFFSET[alt.category] ?? 0;
  return Math.max(1, Math.min(10, base + offset));
}

export function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const alt: Alternative | undefined = ALTERNATIVES.find(a => a.id === id);

  const [profile, setProfile] = useState<ServiceProfile | null>(null);
  const [incidents, setIncidents] = useState<ServiceIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchServiceProfile(id), fetchServiceIncidents(id)]).then(([p, inc]) => {
      setProfile(p);
      setIncidents(inc);
      setLoading(false);
    });
  }, [id]);

  if (!alt && !loading && !profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Service not found.</p>
        <Link to="/directory" className="mt-4 inline-block text-xs text-accent hover:text-accent-hover">
          ← Back to directory
        </Link>
      </div>
    );
  }

  const name = alt?.name ?? id ?? "";
  const country = alt?.country ?? "";
  const domain = alt ? getDomain(alt.url) : "";

  const stars = profile
    ? Math.max(1, Math.round(profile.privacy_score / 10))
    : alt ? getHeuristicStars(alt) : 6;
  const isEstimated = !profile;

  const pageTitle = alt
    ? `${alt.name} — European alternative to ${alt.replaces.slice(0, 2).join(", ")} | digitaleu.me`
    : `${name} | digitaleu.me`;
  const pageDescription = alt
    ? `${alt.description} Switch from ${alt.replaces.join(", ")} to ${alt.name}, a privacy-friendly service from ${alt.country} keeping your data in Europe.`
    : `Privacy-friendly European service on digitaleu.me`;

  const jurisdictionNote = COUNTRY_JURISDICTION[country];
  const categoryNote = alt ? CATEGORY_CONTEXT[alt.category] : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      {alt && <link rel="canonical" href={`https://digitaleu.me/services/${alt.id}`} />}

        {/* Breadcrumb */}
        <nav className="mb-6 text-[11px] font-mono text-text-secondary dark:text-dark-text-secondary">
          <Link to="/" className="hover:text-text-primary dark:hover:text-dark-text-primary transition">home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/directory" className="hover:text-text-primary dark:hover:text-dark-text-primary transition">directory</Link>
          <span className="mx-1.5">/</span>
          <span className="text-text-primary dark:text-dark-text-primary">{name.toLowerCase()}</span>
        </nav>

        {/* Hero / identity */}
        <div className="flex items-start gap-5 mb-8">
          {domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt=""
              className="h-12 w-12 rounded-sm flex-shrink-0 mt-0.5"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{name}</h1>
              <span className="text-xl leading-none">{COUNTRY_FLAGS[country] ?? "🇪🇺"}</span>
              {profile?.headquarters && (
                <span className="inline-block rounded-sm border border-border dark:border-dark-border px-1.5 py-0.5 text-[10px] font-mono text-text-secondary dark:text-dark-text-secondary">
                  {profile.headquarters}
                </span>
              )}
              {!profile && country && (
                <span className="inline-block rounded-sm border border-border dark:border-dark-border px-1.5 py-0.5 text-[10px] font-mono text-text-secondary dark:text-dark-text-secondary">
                  {country}
                </span>
              )}
            </div>
            {profile?.tagline ? (
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">{profile.tagline}</p>
            ) : alt && (
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">{alt.description}</p>
            )}
            {alt && (
              <p className="mt-1 text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 font-mono">
                replaces {alt.replaces.slice(0, 4).join(", ")}
              </p>
            )}
          </div>
          {loading ? (
            <div className="h-5 w-5 rounded-full border-2 border-border dark:border-dark-border border-t-accent animate-spin flex-shrink-0" />
          ) : (
            <div className="flex-shrink-0">
              <StarRating stars={stars} estimated={isEstimated} />
            </div>
          )}
        </div>

        {/* Score breakdown (only when profile exists) */}
        {profile && (
          <div className="mb-8 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface">
            <div className="px-4 py-3 border-b border-border dark:border-dark-border">
              <p className="text-[11px] font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">Privacy score breakdown</p>
            </div>
            <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {PRIVACY_ATTRIBUTES.map(attr => {
                const earned = profile[attr.key] as boolean;
                return (
                  <div key={String(attr.key)} className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-sm text-[10px] font-bold ${
                      earned
                        ? "bg-accent/20 text-accent"
                        : "bg-surface dark:bg-dark-surface text-text-secondary/50 dark:text-dark-text-secondary/50"
                    }`}>
                      {earned ? "✓" : "✗"}
                    </span>
                    <span className={`text-[12px] flex-1 ${earned ? "text-text-primary dark:text-dark-text-primary" : "text-text-secondary dark:text-dark-text-secondary"}`}>
                      {attr.label}
                    </span>
                    <span className={`text-[10px] font-mono flex-shrink-0 ${earned ? "text-accent" : "text-text-secondary/40 dark:text-dark-text-secondary/40"}`}>
                      {earned ? `+${attr.points}` : `+0`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Two column: description + company/jurisdiction info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">About</h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              {profile?.long_description ?? alt?.description ?? ""}
            </p>

            {!profile && categoryNote && (
              <div className="mt-4 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3">
                <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary font-mono uppercase tracking-wide mb-1.5">
                  Why this category matters
                </p>
                <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">{categoryNote}</p>
              </div>
            )}
          </div>

          {profile ? (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">Company</h2>
              <dl className="space-y-2">
                {[
                  { label: "Legal entity", value: profile.legal_entity },
                  { label: "Founded", value: profile.founded_year?.toString() },
                  { label: "Governing law", value: profile.governing_law },
                  { label: "Business model", value: profile.business_model },
                  { label: "Pricing", value: profile.pricing_notes },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <dt className="text-[10px] text-text-secondary/60 dark:text-dark-text-secondary/60 font-mono">{label}</dt>
                    <dd className="text-[12px] text-text-primary dark:text-dark-text-primary mt-0.5">{value}</dd>
                  </div>
                ) : null)}
                {profile.data_center_locations && profile.data_center_locations.length > 0 && (
                  <div>
                    <dt className="text-[10px] text-text-secondary/60 dark:text-dark-text-secondary/60 font-mono">Data centers</dt>
                    <dd className="text-[12px] text-text-primary dark:text-dark-text-primary mt-0.5">{profile.data_center_locations.join(" · ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">Jurisdiction</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[12px]">
                  <span className="text-accent w-4 text-center flex-shrink-0">✓</span>
                  <span className="text-text-secondary dark:text-dark-text-secondary">EU / EEA / Swiss GDPR coverage</span>
                </div>
                <div className="flex items-center gap-2.5 text-[12px]">
                  <span className="text-accent w-4 text-center flex-shrink-0">✓</span>
                  <span className="text-text-secondary dark:text-dark-text-secondary">Data stays in Europe</span>
                </div>
                <div className="flex items-center gap-2.5 text-[12px]">
                  <span className="text-accent w-4 text-center flex-shrink-0">✓</span>
                  <span className="text-text-secondary dark:text-dark-text-secondary">Not subject to US CLOUD Act</span>
                </div>
                {jurisdictionNote && (
                  <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary leading-relaxed pt-1 border-t border-border dark:border-dark-border">
                    {jurisdictionNote}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* What it replaces */}
        {alt && alt.replaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">
              What {alt.name} replaces
            </h2>
            <div className="space-y-2">
              {alt.replaces.map(r => {
                const context = REPLACES_CONTEXT[r];
                const domain = REPLACES_DOMAINS[r];
                return (
                  <div key={r} className="flex items-center gap-4 rounded-sm border border-orange-500/[0.12] bg-orange-500/[0.04] px-4 py-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-sm bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center overflow-hidden">
                      {domain ? (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                          alt={r}
                          className="h-5 w-5"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                        />
                      ) : (
                        <span className="text-text-secondary dark:text-dark-text-secondary text-xs font-bold">{r[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-text-primary dark:text-dark-text-primary">{r}</span>
                      {context && (
                        <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary mt-0.5 leading-relaxed">{context}</p>
                      )}
                      {!context && (
                        <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary mt-0.5">US-based — data subject to US jurisdiction and legal demands.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Data handling (from profile) */}
        {profile && (
          <div className="mb-8 rounded-sm border border-border dark:border-dark-border">
            <div className="px-4 py-3 border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary">Data handling</h2>
            </div>
            <div className="divide-y divide-border dark:divide-dark-border">
              {profile.data_collected && profile.data_collected.length > 0 && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Data collected</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.data_collected.map(item => (
                      <span key={item} className="rounded-sm bg-surface dark:bg-dark-surface border border-border dark:border-dark-border px-2 py-0.5 text-[11px] text-text-secondary dark:text-dark-text-secondary">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.data_retention_policy && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Retention</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.data_retention_policy}</span>
                </div>
              )}
              {profile.jurisdiction_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Jurisdiction</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.jurisdiction_notes}</span>
                </div>
              )}
              {profile.zero_knowledge_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Encryption</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.zero_knowledge_notes}</span>
                </div>
              )}
              {profile.no_logs_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Logging</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.no_logs_notes}</span>
                </div>
              )}
              {profile.anonymous_payment_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Payment</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.anonymous_payment_notes}</span>
                </div>
              )}
              {profile.tor_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-text-secondary/60 dark:text-dark-text-secondary/60 w-32 flex-shrink-0 font-mono pt-0.5">Tor / onion</span>
                  <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary">{profile.tor_notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audit + links (from profile) */}
        {profile && (profile.has_independent_audit || profile.privacy_policy_url || profile.transparency_report_url || profile.open_source_url) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {profile.open_source_url && (
              <a href={profile.open_source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border dark:border-dark-border px-3 py-1.5 text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 transition">
                <span className="text-accent">⌥</span> Source code
              </a>
            )}
            {profile.audit_url && (
              <a href={profile.audit_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border dark:border-dark-border px-3 py-1.5 text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 transition">
                <span className="text-accent">✦</span> Security audit {profile.audit_year ? `(${profile.audit_year})` : ""}
              </a>
            )}
            {profile.privacy_policy_url && (
              <a href={profile.privacy_policy_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border dark:border-dark-border px-3 py-1.5 text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 transition">
                Privacy policy
              </a>
            )}
            {profile.transparency_report_url && (
              <a href={profile.transparency_report_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border dark:border-dark-border px-3 py-1.5 text-[11px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 transition">
                Transparency report
              </a>
            )}
          </div>
        )}

        {/* Incidents (from profile) */}
        {incidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">
              Known incidents <span className="text-text-secondary/40 dark:text-dark-text-secondary/40 font-mono normal-case">({incidents.length})</span>
            </h2>
            <div className="rounded-sm border border-border dark:border-dark-border divide-y divide-border dark:divide-dark-border">
              {incidents.map(inc => (
                <div key={inc.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase ${SEVERITY_STYLE[inc.severity]}`}>
                        {inc.severity}
                      </span>
                      <span className="text-[13px] font-medium text-text-primary dark:text-dark-text-primary">{inc.title}</span>
                      {inc.resolved && (
                        <span className="text-[10px] text-accent font-mono">resolved</span>
                      )}
                    </div>
                    {inc.incident_date && (
                      <span className="text-[10px] text-text-secondary dark:text-dark-text-secondary font-mono flex-shrink-0">
                        {new Date(inc.incident_date).toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                  {inc.description && (
                    <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">{inc.description}</p>
                  )}
                  {inc.resolution_notes && (
                    <p className="mt-2 text-[11px] text-text-secondary/70 dark:text-dark-text-secondary/70 italic">{inc.resolution_notes}</p>
                  )}
                  {inc.source_url && (
                    <a href={inc.source_url} target="_blank" rel="noopener noreferrer"
                      className="mt-1.5 inline-block text-[11px] text-accent hover:text-accent-hover transition">
                      Source →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {alt && (
          <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">Learn more about {name}</p>
              <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary mt-0.5">
                View detailed information about this service and our verified affiliate link.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to={`/alternative/${alt.id}`}
                className="inline-flex items-center gap-2 rounded-sm bg-accent hover:bg-accent-hover px-5 py-2 text-sm font-semibold text-white transition"
              >
                View Details →
              </Link>
            </div>
          </div>
        )}

    </div>
  );
}
