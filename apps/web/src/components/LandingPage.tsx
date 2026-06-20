import { Link } from "react-router-dom";
import { ALTERNATIVES, SERVICES, type Alternative } from "@digitaleu/shared";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { Header } from "@/components/Header";
import { COUNTRY_FLAGS } from "@/lib/flags";

const THREAT_DOT: Record<string, string> = {
  HIGH: "bg-red-400",
  MEDIUM: "bg-amber-400",
  LOW: "bg-emerald-400",
};
const THREAT_TEXT: Record<string, string> = {
  HIGH: "text-red-400",
  MEDIUM: "text-amber-400",
  LOW: "text-emerald-400",
};

const CATEGORY_LABELS: Record<string, string> = {
  email: "Email",
  vpn: "VPN",
  "cloud-storage": "Cloud Storage",
  browser: "Browser",
  "password-manager": "Passwords",
  search: "Search",
  office: "Office Suite",
  messaging: "Messaging",
  "code-hosting": "Code Hosting",
  "cloud-infra": "Infrastructure",
  analytics: "Analytics",
  hardware: "Hardware",
  ai: "AI Tools",
  fintech: "Fintech",
  "project-management": "Project Mgmt",
  security: "Security",
  social: "Social Media",
  transport: "Transport",
};

const PREVIEW = SERVICES.filter(s => s.threatScore === "HIGH" && s.breachSummary).slice(0, 5);

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

function groupByCategory(alts: Alternative[]): [string, Alternative[]][] {
  const map = new Map<string, Alternative[]>();
  for (const alt of alts) {
    const existing = map.get(alt.category) ?? [];
    existing.push(alt);
    map.set(alt.category, existing);
  }
  return Array.from(map.entries());
}

export function LandingPage() {
  const grouped = groupByCategory(ALTERNATIVES);

  return (
    <div className="min-h-full bg-[#06090f] text-slate-100">
      <Header />

      <main className="mx-auto max-w-[52rem] px-6 py-16 md:py-24">

        {/* ── Hero ── */}
        <div className="max-w-xl">
          <h1 className="text-[2rem] font-bold leading-[1.2] tracking-tight text-white sm:text-[2.375rem]">
            Your data is in the wrong hands.
            <br />
            <span className="text-slate-500">Here's a plan to get it back.</span>
          </h1>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Select which services you use. We score each one on privacy risk, show documented
            breaches, and link directly to the best European alternatives.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to="/b2c"
              className="inline-flex items-center gap-1.5 rounded bg-white px-4 py-2 text-sm font-semibold text-[#06090f] transition hover:bg-slate-200 active:bg-slate-300"
            >
              Check my accounts
            </Link>
            <span className="text-xs text-slate-600 font-mono">no account · runs in browser</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-700">
            <span>data stored in Switzerland 🇨🇭</span>
            <span>·</span>
            <span>zero-knowledge</span>
            <span>·</span>
            <span>{ALTERNATIVES.length} alternatives catalogued</span>
          </div>
        </div>

        {/* ── Preview table ── */}
        <div className="mt-14">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-[11px] text-slate-600 font-mono">
              Sample report — {SERVICES.length} services tracked
            </span>
            <Link
              to="/b2c"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition"
            >
              Run for your accounts →
            </Link>
          </div>

          <div className="overflow-hidden rounded border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-600">
                    Service
                  </th>
                  <th className="py-2.5 text-left text-[11px] font-medium text-slate-600 w-20">
                    Risk
                  </th>
                  <th className="py-2.5 pr-4 text-left text-[11px] font-medium text-slate-600 hidden sm:table-cell">
                    Known issue
                  </th>
                  <th className="py-2.5 pr-4 text-left text-[11px] font-medium text-slate-600">
                    EU alternative
                  </th>
                </tr>
              </thead>
              <tbody>
                {PREVIEW.map((s, i) => {
                  const alt = s.euAlternativeId
                    ? ALTERNATIVES.find(a => a.id === s.euAlternativeId)
                    : null;
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors hover:bg-white/[0.02] ${
                        i < PREVIEW.length - 1 ? "border-b border-white/[0.04]" : ""
                      }`}
                    >
                      <td className="px-4 py-3 w-40">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=32`}
                            alt=""
                            className="h-3.5 w-3.5 rounded flex-shrink-0"
                            onError={e => {
                              (e.currentTarget as HTMLImageElement).style.opacity = "0";
                            }}
                          />
                          <span className="text-[13px] font-medium text-slate-200">{s.name}</span>
                          <span className="text-slate-700">{COUNTRY_FLAGS[s.ownerCountry]}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono ${THREAT_TEXT[s.threatScore]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${THREAT_DOT[s.threatScore]}`}
                          />
                          {s.threatScore}
                        </span>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell max-w-[200px]">
                        <span className="text-[11px] text-slate-600 line-clamp-1">
                          {s.breachSummary}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {alt ? (
                          <span className="text-[12px] text-blue-400 font-medium">
                            {alt.name}{" "}
                            <span className="text-slate-600">{COUNTRY_FLAGS[alt.country]}</span>
                          </span>
                        ) : (
                          <span className="text-slate-700">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="border-t border-white/[0.05] bg-white/[0.01] px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-700 font-mono">
                scores based on public breach data & GDPR enforcement records
              </span>
              <Link
                to="/b2c"
                className="text-[11px] text-blue-500 hover:text-blue-400 transition"
              >
                Run scan →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Alternatives grouped list ── */}
        <section className="mt-20">
          <div className="mb-4 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
            <h2 className="text-sm font-semibold text-white">European Privacy Alternatives</h2>
            <Link
              to="/directory"
              className="text-[11px] text-slate-600 hover:text-slate-400 transition"
            >
              Browse all {ALTERNATIVES.length} →
            </Link>
          </div>

          {grouped.slice(0, 8).map(([category, alts]) => (
            <div key={category}>
              <div className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 w-28 flex-shrink-0">
                  {CATEGORY_LABELS[category] ?? category}
                </span>
                <span className="text-[10px] text-slate-800 font-mono">{alts.length}</span>
              </div>

              {alts.slice(0, 3).map(alt => {
                const domain = getDomain(alt.url);
                return (
                  <Link
                    key={alt.id}
                    to={`/services/${alt.id}`}
                    className="group flex items-center gap-3 py-2.5 pl-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    {domain && (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                        alt=""
                        className="h-3.5 w-3.5 rounded flex-shrink-0"
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).style.opacity = "0";
                        }}
                      />
                    )}
                    <span className="text-[13px] text-slate-300 font-medium group-hover:text-white transition w-28 flex-shrink-0 truncate">
                      {alt.name}
                    </span>
                    <span className="flex-shrink-0 text-base leading-none">
                      {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
                    </span>
                    <span className="text-[11px] text-slate-600 hidden sm:block truncate">
                      replaces {alt.replaces.slice(0, 2).join(", ")}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-700 hidden lg:block pr-4 truncate max-w-[200px]">
                      {alt.description}
                    </span>
                  </Link>
                );
              })}

              {alts.length > 3 && (
                <div className="py-2 pl-4 border-b border-white/[0.03]">
                  <Link
                    to="/directory"
                    className="text-[10px] text-slate-700 hover:text-slate-500 transition pl-7"
                  >
                    +{alts.length - 3} more →
                  </Link>
                </div>
              )}
            </div>
          ))}

          {grouped.length > 8 && (
            <div className="mt-4 pt-4 border-t border-white/[0.04] text-center">
              <Link
                to="/directory"
                className="text-xs text-slate-600 hover:text-slate-400 transition"
              >
                View all {grouped.length} categories and {ALTERNATIVES.length} alternatives →
              </Link>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8 mt-12">
        <div className="mx-auto max-w-[52rem] px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">{SITE.brand}</p>
            <p className="text-[11px] text-slate-700 mt-0.5 font-mono">
              {SITE.domain} · {SITE.dataRegionCountry} 🇨🇭 · free with partner sign-up or €29
              one-time
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {SOCIAL_LINKS.filter(s => !s.placeholder).map(s => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-700 hover:text-slate-500 transition"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
