import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ALTERNATIVES, type Alternative } from "@digitaleu/shared";
import { Header } from "@/components/Header";
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

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 75 ? "#22c55e" :
    score >= 50 ? "#f0c040" :
    score >= 30 ? "#f97316" :
    "#ef4444";

  const strokeWidth = 8;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex flex-col items-center gap-1">
      <svg width="104" height="104" viewBox="0 0 104 104" className="-rotate-90">
        <circle cx="52" cy="52" r={r} stroke="#1a2535" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx="52" cy="52" r={r}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-500 font-mono mt-0.5">/ 100</span>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
        {score >= 75 ? "Excellent" : score >= 50 ? "Good" : score >= 30 ? "Fair" : "Poor"}
      </span>
    </div>
  );
}

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high:     "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

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
      <div className="min-h-screen bg-[#06090f] text-slate-100">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-slate-500 text-sm">Service not found.</p>
          <Link to="/directory" className="mt-4 inline-block text-xs text-blue-500 hover:text-blue-400">
            ← Back to directory
          </Link>
        </main>
      </div>
    );
  }

  const name = alt?.name ?? id ?? "";
  const country = alt?.country ?? "";
  const domain = alt ? getDomain(alt.url) : "";
  const affiliateUrl = alt?.affiliateUrl ?? alt?.url ?? "";

  const pageTitle = alt
    ? `${alt.name} — European alternative to ${alt.replaces.slice(0, 2).join(", ")} | digitaleu.me`
    : `${name} | digitaleu.me`;
  const pageDescription = alt
    ? `${alt.description} Switch from ${alt.replaces.join(", ")} to ${alt.name}, a privacy-friendly service from ${alt.country} keeping your data in Europe.`
    : `Privacy-friendly European service on digitaleu.me`;

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100">
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      {alt && <link rel="canonical" href={`https://digitaleu.me/directory/${alt.id}`} />}
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">

        {/* ── Breadcrumb ── */}
        <nav className="mb-6 text-[11px] font-mono text-slate-600">
          <Link to="/" className="hover:text-slate-400 transition">home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/directory" className="hover:text-slate-400 transition">directory</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-500">{name.toLowerCase()}</span>
        </nav>

        {/* ── Hero / identity ── */}
        <div className="flex items-start gap-5 mb-8">
          {domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt=""
              className="h-12 w-12 rounded-xl flex-shrink-0 mt-0.5"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white">{name}</h1>
              <span className="text-xl leading-none">{COUNTRY_FLAGS[country] ?? "🇪🇺"}</span>
              {profile && (
                <span className="inline-block rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                  {profile.headquarters}
                </span>
              )}
            </div>
            {profile?.tagline && (
              <p className="mt-1 text-sm text-slate-400">{profile.tagline}</p>
            )}
            {alt && (
              <p className="mt-1 text-[11px] text-slate-600 font-mono">
                replaces {alt.replaces.slice(0, 4).join(", ")}
              </p>
            )}
          </div>
          {loading && (
            <div className="h-5 w-5 rounded-full border-2 border-slate-700 border-t-slate-400 animate-spin flex-shrink-0" />
          )}
        </div>

        {/* ── Score + attribute grid ── */}
        {profile && (
          <div className="mb-8 rounded border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-6 px-6 py-5 border-b border-white/[0.06]">
              <ScoreGauge score={profile.privacy_score} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 mb-3">Privacy score breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {PRIVACY_ATTRIBUTES.map(attr => {
                    const earned = profile[attr.key] as boolean;
                    return (
                      <div key={String(attr.key)} className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded text-[10px] font-bold ${
                          earned
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/[0.04] text-slate-600"
                        }`}>
                          {earned ? "✓" : "✗"}
                        </span>
                        <span className={`text-[12px] flex-1 ${earned ? "text-slate-300" : "text-slate-600"}`}>
                          {attr.label}
                        </span>
                        <span className={`text-[10px] font-mono flex-shrink-0 ${earned ? "text-emerald-600" : "text-slate-700"}`}>
                          {earned ? `+${attr.points}` : `+0`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Two column: description + company info ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">About</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {profile?.long_description ?? alt?.description ?? ""}
            </p>
          </div>

          {/* Company info */}
          {profile && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">Company</h2>
              <dl className="space-y-2">
                {[
                  { label: "Legal entity", value: profile.legal_entity },
                  { label: "Founded", value: profile.founded_year?.toString() },
                  { label: "Governing law", value: profile.governing_law },
                  { label: "Business model", value: profile.business_model },
                  { label: "Pricing", value: profile.pricing_notes },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <dt className="text-[10px] text-slate-600 font-mono">{label}</dt>
                    <dd className="text-[12px] text-slate-300 mt-0.5">{value}</dd>
                  </div>
                ) : null)}
                {profile.data_center_locations && profile.data_center_locations.length > 0 && (
                  <div>
                    <dt className="text-[10px] text-slate-600 font-mono">Data centers</dt>
                    <dd className="text-[12px] text-slate-300 mt-0.5">{profile.data_center_locations.join(" · ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* ── Data handling ── */}
        {profile && (
          <div className="mb-8 rounded border border-white/[0.06]">
            <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.015]">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Data handling</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {profile.data_collected && profile.data_collected.length > 0 && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Data collected</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.data_collected.map(item => (
                      <span key={item} className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.data_retention_policy && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Retention</span>
                  <span className="text-[12px] text-slate-400">{profile.data_retention_policy}</span>
                </div>
              )}
              {profile.jurisdiction_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Jurisdiction</span>
                  <span className="text-[12px] text-slate-400">{profile.jurisdiction_notes}</span>
                </div>
              )}
              {profile.zero_knowledge_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Encryption</span>
                  <span className="text-[12px] text-slate-400">{profile.zero_knowledge_notes}</span>
                </div>
              )}
              {profile.no_logs_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Logging</span>
                  <span className="text-[12px] text-slate-400">{profile.no_logs_notes}</span>
                </div>
              )}
              {profile.anonymous_payment_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Payment</span>
                  <span className="text-[12px] text-slate-400">{profile.anonymous_payment_notes}</span>
                </div>
              )}
              {profile.tor_notes && (
                <div className="px-4 py-3 flex gap-4">
                  <span className="text-[11px] text-slate-600 w-32 flex-shrink-0 font-mono pt-0.5">Tor / onion</span>
                  <span className="text-[12px] text-slate-400">{profile.tor_notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Audit + links ── */}
        {profile && (profile.has_independent_audit || profile.privacy_policy_url || profile.transparency_report_url || profile.open_source_url) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {profile.open_source_url && (
              <a href={profile.open_source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-white/[0.16] transition">
                <span className="text-emerald-500">⌥</span> Source code
              </a>
            )}
            {profile.audit_url && (
              <a href={profile.audit_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-white/[0.16] transition">
                <span className="text-blue-500">✦</span> Security audit {profile.audit_year ? `(${profile.audit_year})` : ""}
              </a>
            )}
            {profile.privacy_policy_url && (
              <a href={profile.privacy_policy_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-white/[0.16] transition">
                Privacy policy
              </a>
            )}
            {profile.transparency_report_url && (
              <a href={profile.transparency_report_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-white/[0.16] transition">
                Transparency report
              </a>
            )}
          </div>
        )}

        {/* ── Incidents ── */}
        {incidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Known incidents <span className="text-slate-700 font-mono normal-case">({incidents.length})</span>
            </h2>
            <div className="rounded border border-white/[0.06] divide-y divide-white/[0.04]">
              {incidents.map(inc => (
                <div key={inc.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${SEVERITY_STYLE[inc.severity]}`}>
                        {inc.severity}
                      </span>
                      <span className="text-[13px] font-medium text-slate-200">{inc.title}</span>
                      {inc.resolved && (
                        <span className="text-[10px] text-emerald-600 font-mono">resolved</span>
                      )}
                    </div>
                    {inc.incident_date && (
                      <span className="text-[10px] text-slate-600 font-mono flex-shrink-0">
                        {new Date(inc.incident_date).toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                  {inc.description && (
                    <p className="text-[12px] text-slate-500 leading-relaxed">{inc.description}</p>
                  )}
                  {inc.resolution_notes && (
                    <p className="mt-2 text-[11px] text-slate-600 italic">{inc.resolution_notes}</p>
                  )}
                  {inc.source_url && (
                    <a href={inc.source_url} target="_blank" rel="noopener noreferrer"
                      className="mt-1.5 inline-block text-[11px] text-blue-600 hover:text-blue-400 transition">
                      Source →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        {affiliateUrl && (
          <div className="rounded border border-[#1a2d4f] bg-[#0d1b33]/60 px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {profile?.pricing_notes ?? "Visit the official site for plans and pricing."}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-[#1a56db] hover:bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition"
              >
                Get started →
              </a>
              {alt?.affiliateUrl && (
                <span className="text-[10px] text-slate-700">affiliate link</span>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
