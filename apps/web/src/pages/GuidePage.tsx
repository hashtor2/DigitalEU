import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { GUIDE_CONTENT, type GuideService } from "@/data/guide-content";

function AffiliateBadge() {
  return (
    <span className="inline-block rounded border border-[#f0c040]/20 bg-[#f0c040]/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#f0c040]/60 tracking-wide">
      partner
    </span>
  );
}

function ServiceCard({ service }: { service: GuideService }) {
  return (
    <div className={`rounded border p-5 ${service.isAffiliate ? "border-[#f0c040]/20 bg-[#f0c040]/[0.02]" : "border-white/[0.07]"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-white">{service.name}</h3>
            <span className="text-[11px] text-slate-500">{service.country}</span>
            {service.isAffiliate && <AffiliateBadge />}
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">{service.tagline}</p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">{service.price}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1.5">Pros</p>
          <ul className="space-y-1">
            {service.pros.map((p) => (
              <li key={p} className="flex gap-2 text-[12px] text-slate-400">
                <span className="text-emerald-600 flex-shrink-0 mt-0.5">+</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Cons</p>
          <ul className="space-y-1">
            {service.cons.map((c) => (
              <li key={c} className="flex gap-2 text-[12px] text-slate-500">
                <span className="text-slate-600 flex-shrink-0 mt-0.5">−</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 rounded px-4 py-1.5 text-[12px] font-semibold transition ${
          service.isAffiliate
            ? "bg-[#f0c040] text-[#06090f] hover:bg-[#f0c040]/90"
            : "border border-white/[0.1] text-slate-300 hover:text-white hover:border-white/20"
        }`}
      >
        Visit {service.name} ↗
      </a>
    </div>
  );
}

export function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const guide = id ? GUIDE_CONTENT[id] : null;

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col">
        <title>Guide not found | digitaleu.me</title>
        <Header />
        <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-16 text-center">
          <p className="text-slate-500 text-sm mb-4">Guide not found.</p>
          <Link to="/guides" className="text-[#f0c040] text-sm hover:underline">
            ← Back to guides
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col">
      <title>{guide.metaTitle}</title>
      <meta name="description" content={guide.metaDescription} />
      <meta property="og:title" content={guide.metaTitle} />
      <meta property="og:description" content={guide.metaDescription} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://digitaleu.me/guides/${guide.id}`} />
      <Header />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-10">
        <Link
          to="/guides"
          className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition mb-8"
        >
          ← All guides
        </Link>

        {/* Hero */}
        <div className="mb-8">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-600 border border-white/[0.06] rounded px-2 py-0.5 mb-3">
            {guide.category}
          </span>
          <h1 className="text-2xl font-bold text-white leading-tight mb-3">{guide.title}</h1>
          <p className="text-[14px] text-slate-400 leading-relaxed">{guide.intro}</p>
        </div>

        {/* Why switch */}
        <div className="mb-8 rounded border border-white/[0.06] bg-white/[0.01] p-5">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Why switch?
          </h2>
          <ul className="space-y-2">
            {guide.whySwitch.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-[13px] text-slate-400">
                <span className="text-[#f0c040]/60 flex-shrink-0 mt-0.5">→</span>
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
          {guide.services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>

        {/* Verdict */}
        <div className="mb-8 rounded border border-white/[0.07] bg-white/[0.015] p-5">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Our verdict
          </h2>
          <p className="text-[13px] text-slate-300 leading-relaxed">{guide.verdict}</p>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-[13px] font-semibold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {guide.faq.map(({ q, a }) => (
              <div key={q} className="border-l-2 border-white/[0.08] pl-4">
                <p className="text-[13px] font-medium text-white mb-1">{q}</p>
                <p className="text-[12px] text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="border-t border-white/[0.06] pt-6 text-center">
          <Link to="/directory" className="text-[12px] text-slate-600 hover:text-slate-400 transition">
            Browse all 200+ European alternatives →
          </Link>
        </div>
      </main>
    </div>
  );
}
