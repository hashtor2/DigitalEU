import { useParams, Link } from "react-router-dom";
import { ALTERNATIVES } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { GUIDE_CONTENT, type GuideService } from "@/data/guide-content";

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

function CountryFlag({ country }: { country: string }) {
  const parts = country.split(" ");
  const flag = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(" ");
  return (
    <span className="flex items-center gap-1">
      <span className="text-base leading-none">{flag}</span>
      <span className="text-[11px] text-text-secondary dark:text-dark-text-secondary">{name}</span>
    </span>
  );
}

function AffiliateBadge() {
  return (
    <span className="inline-block rounded-sm border border-accent/20 bg-accent/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent/60 tracking-wide">
      partner
    </span>
  );
}

function ServiceCard({ service, rank }: { service: GuideService; rank: number }) {
  const domain = getDomain(service.url);
  const isTop = rank === 1;

  const matchingAlternative = ALTERNATIVES.find(
    (alt) => alt.name.toLowerCase() === service.name.toLowerCase()
  );

  return (
    <div className={`rounded-sm border ${
      isTop
        ? "border-accent/25 bg-accent/[0.025]"
        : "border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas"
    }`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border dark:border-dark-border">
        <div className="relative flex-shrink-0">
          {domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt={service.name}
              className="h-10 w-10 rounded-xl"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          )}
          {isTop && (
            <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none bg-accent text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-text-primary dark:text-dark-text-primary">{service.name}</h3>
            <CountryFlag country={service.country} />
            {service.isAffiliate && <AffiliateBadge />}
          </div>
          <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary mt-0.5 truncate">{service.tagline}</p>
        </div>

        <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary font-mono flex-shrink-0 hidden sm:block">{service.price}</span>
      </div>

      {/* Pros / cons */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">Pros</p>
          <ul className="space-y-1.5">
            {service.pros.map((p) => (
              <li key={p} className="flex gap-2 text-[12px] text-text-secondary dark:text-dark-text-secondary leading-snug">
                <span className="text-accent flex-shrink-0 mt-0.5 font-bold">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-2">Cons</p>
          <ul className="space-y-1.5">
            {service.cons.map((c) => (
              <li key={c} className="flex gap-2 text-[12px] text-text-secondary dark:text-dark-text-secondary leading-snug">
                <span className="text-text-secondary dark:text-dark-text-secondary flex-shrink-0 mt-0.5">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[12px] text-text-secondary dark:text-dark-text-secondary font-mono sm:hidden">{service.price}</span>
        {matchingAlternative ? (
          <Link
            to={`/alternative/${matchingAlternative.id}`}
            className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-[12px] font-semibold transition ${
              service.isAffiliate
                ? "bg-accent text-white hover:bg-accent-hover"
                : "border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary hover:border-accent/30"
            }`}
          >
            {domain && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                alt=""
                className="h-3.5 w-3.5 rounded"
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
              />
            )}
            Learn More ↗
          </Link>
        ) : (
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-[12px] font-semibold transition ${
              service.isAffiliate
                ? "bg-accent text-white hover:bg-accent-hover"
                : "border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary hover:border-accent/30"
            }`}
          >
            {domain && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                alt=""
                className="h-3.5 w-3.5 rounded"
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
              />
            )}
            Visit {service.name} ↗
          </a>
        )}
      </div>
    </div>
  );
}

export function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? GUIDE_CONTENT[id] : null;

  if (!guide) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
        <title>Guide not found | digitaleu.me</title>
        <Header />
        <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-16 text-center">
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">Guide not found.</p>
          <Link to="/guides" className="text-accent text-sm hover:underline">
            ← Back to guides
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <title>{guide.metaTitle}</title>
      <meta name="description" content={guide.metaDescription} />
      <meta property="og:title" content={guide.metaTitle} />
      <meta property="og:description" content={guide.metaDescription} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://digitaleu.me/guides/${guide.id}`} />
      <Header />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[11px] font-mono text-text-secondary dark:text-dark-text-secondary">
          <Link to="/" className="hover:text-text-primary dark:hover:text-dark-text-primary transition">home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/guides" className="hover:text-text-primary dark:hover:text-dark-text-primary transition">guides</Link>
          <span className="mx-1.5">/</span>
          <span className="text-text-primary dark:text-dark-text-primary">{guide.category}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {guide.services.map(s => {
              const d = getDomain(s.url);
              const flag = s.country.split(" ").at(-1);
              return d ? (
                <div key={s.name} className="flex items-center gap-2 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-1.5">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${d}&sz=32`}
                    alt={s.name}
                    className="h-4 w-4 rounded"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="text-[12px] font-medium text-text-primary dark:text-dark-text-primary">{s.name}</span>
                  <span className="text-sm leading-none">{flag}</span>
                </div>
              ) : null;
            })}
          </div>

          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary border border-border dark:border-dark-border rounded-sm px-2 py-0.5 mb-3">
            {guide.category}
          </span>
          <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary leading-tight mb-3">{guide.title}</h1>
          <p className="text-[14px] text-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-2xl">{guide.intro}</p>
        </div>

        {/* Why switch */}
        <div className="mb-8 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary mb-3">
            Why switch?
          </h2>
          <ul className="space-y-2">
            {guide.whySwitch.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-[13px] text-text-secondary dark:text-dark-text-secondary">
                <span className="text-accent/60 flex-shrink-0 mt-0.5 font-bold">→</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <h2 className="text-[13px] font-semibold text-text-primary dark:text-dark-text-primary mb-4">
          The best options compared
        </h2>
        <div className="space-y-4 mb-10">
          {guide.services.map((service, i) => (
            <ServiceCard key={service.name} service={service} rank={i + 1} />
          ))}
        </div>

        {/* Verdict */}
        <div className="mb-8 rounded-sm border border-accent/20 bg-accent/[0.04] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-accent/70 mb-2">
            Our verdict
          </h2>
          <p className="text-[13px] text-text-primary dark:text-dark-text-primary leading-relaxed">{guide.verdict}</p>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-[13px] font-semibold text-text-primary dark:text-dark-text-primary mb-4">FAQ</h2>
          <div className="space-y-4">
            {guide.faq.map(({ q, a }) => (
              <div key={q} className="border-l-2 border-accent/30 pl-4">
                <p className="text-[13px] font-medium text-text-primary dark:text-dark-text-primary mb-1">{q}</p>
                <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div className="border-t border-border dark:border-dark-border pt-6 flex items-center justify-between">
          <Link to="/guides" className="text-[12px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition">
            ← All guides
          </Link>
          <Link to="/directory" className="text-[12px] text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition">
            Browse all European alternatives →
          </Link>
        </div>
      </main>
    </div>
  );
}
