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
      <span className="text-[11px] text-slate-500">{name}</span>
    </span>
  );
}

function AffiliateBadge() {
  return (
    <span className="inline-block rounded border border-[#f0c040]/20 bg-[#f0c040]/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#f0c040]/60 tracking-wide">
      partner
    </span>
  );
}

function ServiceCard({ service, rank }: { service: GuideService; rank: number }) {
  const domain = getDomain(service.url);
  const isTop = rank === 1;

  // Try to find matching alternative by name
  const matchingAlternative = ALTERNATIVES.find(
    (alt) => alt.name.toLowerCase() === service.name.toLowerCase()
  );

  return (
    <div className={`rounded border ${
      isTop
        ? "border-[#f0c040]/25 bg-[#f0c040]/[0.025]"
        : "border-[#30363d] bg-[#0d1117]"
    }`}>

      {/* Card header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[#21262d]">
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
            <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none bg-[#f0c040] text-[#111827] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-white">{service.name}</h3>
            <CountryFlag country={service.country} />
            {service.isAffiliate && <AffiliateBadge />}
          </div>
          <p className="text-[12px] text-slate-400 mt-0.5 truncate">{service.tagline}</p>
        </div>

        <span className="text-[12px] text-slate-400 font-mono flex-shrink-0 hidden sm:block">{service.price}</span>
      </div>

      {/* Pros / cons */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-2">Pros</p>
          <ul className="space-y-1.5">
            {service.pros.map((p) => (
              <li key={p} className="flex gap-2 text-[12px] text-slate-400 leading-snug">
                <span className="text-emerald-600 flex-shrink-0 mt-0.5 font-bold">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Cons</p>
          <ul className="space-y-1.5">
            {service.cons.map((c) => (
              <li key={c} className="flex gap-2 text-[12px] text-slate-400 leading-snug">
                <span className="text-slate-500 flex-shrink-0 mt-0.5">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[12px] text-slate-400 font-mono sm:hidden">{service.price}</span>
        {matchingAlternative ? (
          <Link
            to={`/alternative/${matchingAlternative.id}`}
            className={`inline-flex items-center gap-2 rounded px-4 py-2 text-[12px] font-semibold transition ${
              service.isAffiliate
                ? "bg-[#f0c040] text-[#111827] hover:bg-[#f0c040]/90"
                : "border border-[#30363d] text-slate-300 hover:text-white hover:border-white/20"
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
            className={`inline-flex items-center gap-2 rounded px-4 py-2 text-[12px] font-semibold transition ${
              service.isAffiliate
                ? "bg-[#f0c040] text-[#111827] hover:bg-[#f0c040]/90"
                : "border border-[#30363d] text-slate-300 hover:text-white hover:border-white/20"
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
      <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
        <title>Guide not found | digitaleu.me</title>
        <Header />
        <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-16 text-center">
          <p className="text-slate-400 text-sm mb-4">Guide not found.</p>
          <Link to="/guides" className="text-[#f0c040] text-sm hover:underline">
            ← Back to guides
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
      <title>{guide.metaTitle}</title>
      <meta name="description" content={guide.metaDescription} />
      <meta property="og:title" content={guide.metaTitle} />
      <meta property="og:description" content={guide.metaDescription} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://digitaleu.me/guides/${guide.id}`} />
      <Header />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-10">

        {/* Breadcrumb */}
        <nav className="mb-8 text-[11px] font-mono text-slate-500">
          <Link to="/" className="hover:text-slate-400 transition">home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/guides" className="hover:text-slate-400 transition">guides</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-400">{guide.category}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          {/* Service logo strip */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {guide.services.map(s => {
              const d = getDomain(s.url);
              const flag = s.country.split(" ").at(-1);
              return d ? (
                <div key={s.name} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${d}&sz=32`}
                    alt={s.name}
                    className="h-4 w-4 rounded"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="text-[12px] font-medium text-slate-300">{s.name}</span>
                  <span className="text-sm leading-none">{flag}</span>
                </div>
              ) : null;
            })}
          </div>

          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-500 border border-[#21262d] rounded px-2 py-0.5 mb-3">
            {guide.category}
          </span>
          <h1 className="text-2xl font-bold text-white leading-tight mb-3">{guide.title}</h1>
          <p className="text-[14px] text-slate-400 leading-relaxed max-w-2xl">{guide.intro}</p>
        </div>

        {/* Why switch */}
        <div className="mb-8 rounded border border-[#30363d] bg-[#161b22] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Why switch?
          </h2>
          <ul className="space-y-2">
            {guide.whySwitch.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-[13px] text-slate-400">
                <span className="text-[#f0c040]/60 flex-shrink-0 mt-0.5 font-bold">→</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <h2 className="text-[13px] font-semibold text-white mb-4">
          The best options compared
        </h2>
        <div className="space-y-4 mb-10">
          {guide.services.map((service, i) => (
            <ServiceCard key={service.name} service={service} rank={i + 1} />
          ))}
        </div>

        {/* Verdict */}
        <div className="mb-8 rounded border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600/70 mb-2">
            Our verdict
          </h2>
          <p className="text-[13px] text-slate-300 leading-relaxed">{guide.verdict}</p>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-[13px] font-semibold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {guide.faq.map(({ q, a }) => (
              <div key={q} className="border-l-2 border-[#30363d] pl-4">
                <p className="text-[13px] font-medium text-white mb-1">{q}</p>
                <p className="text-[12px] text-slate-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div className="border-t border-[#30363d] pt-6 flex items-center justify-between">
          <Link to="/guides" className="text-[12px] text-slate-500 hover:text-slate-400 transition">
            ← All guides
          </Link>
          <Link to="/directory" className="text-[12px] text-slate-500 hover:text-slate-400 transition">
            Browse all European alternatives →
          </Link>
        </div>
      </main>
    </div>
  );
}
