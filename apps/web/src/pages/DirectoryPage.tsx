import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ALTERNATIVES, type ServiceCategory } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { COUNTRY_FLAGS } from "@/lib/flags";
import { TrustBadges } from "@/components/TrustBadges";

const CATEGORY_LABELS: Record<ServiceCategory | string, string> = {
  email: "Email",
  vpn: "VPN",
  "cloud-storage": "Cloud Storage",
  browser: "Browser",
  "password-manager": "Password Manager",
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

const CROSS_LINK_PACKS: { label: string; categories: ServiceCategory[] }[] = [
  { label: "De-Google core", categories: ["email", "search", "browser"] },
  { label: "Secure work stack", categories: ["messaging", "office", "cloud-storage"] },
  { label: "Founder stack", categories: ["code-hosting", "project-management", "analytics"] },
];

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

export function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const allCategories = useMemo(
    () => Array.from(new Set(ALTERNATIVES.map(a => a.category))),
    []
  );

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of ALTERNATIVES) m[a.category] = (m[a.category] ?? 0) + 1;
    return m;
  }, []);

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALTERNATIVES.filter(alt => {
      const matchesSearch =
        !q ||
        alt.name.toLowerCase().includes(q) ||
        alt.description.toLowerCase().includes(q) ||
        alt.replaces.some(r => r.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(alt.category);
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategories]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
      <title>European Privacy Catalogue — {ALTERNATIVES.length}+ Alternatives to Big Tech | digitaleu.me</title>
      <meta name="description" content="Browse vetted European alternatives to Gmail, Google Drive, Dropbox, Slack, and more. All services keep data within EU/EEA/Swiss jurisdiction." />
      <link rel="canonical" href="https://digitaleu.me/directory" />
      <Header />

      <div className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 flex gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Filters</p>

          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent border border-[#30363d] focus:border-[#6e7681] focus:outline-none rounded px-3 py-1.5 text-[12px] text-white placeholder:text-slate-500 mb-4"
          />

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Category</p>
          <div className="space-y-0.5">
            {allCategories.map(cat => {
              const active = selectedCategories.has(cat);
              return (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer py-1 group"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(cat)}
                    className="hidden"
                  />
                  <span className={`w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center transition ${
                    active
                      ? "border-[#f0c040]/50 bg-[#f0c040]/20"
                      : "border-white/[0.12] group-hover:border-white/25"
                  }`}>
                    {active && <span className="text-[#f0c040] text-[8px] leading-none">✓</span>}
                  </span>
                  <span className={`text-[11px] flex-1 transition ${active ? "text-slate-200" : "text-slate-400 group-hover:text-slate-400"}`}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{categoryCounts[cat]}</span>
                </label>
              );
            })}
          </div>

          {selectedCategories.size > 0 && (
            <button
              onClick={() => setSelectedCategories(new Set())}
              className="mt-3 text-[10px] text-slate-500 hover:text-slate-400 transition"
            >
              × Clear filters
            </button>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* Header row */}
          <div className="flex items-baseline justify-between mb-1">
            <h1 className="text-lg font-bold text-white">European Privacy Catalogue</h1>
            <span className="text-[11px] text-slate-500 font-mono">{filtered.length} services</span>
          </div>
          <p className="text-[12px] text-slate-400 mb-5">
            Vetted alternatives keeping data within EU/EEA/Swiss jurisdiction.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {CROSS_LINK_PACKS.map((pack) => (
              <button
                key={pack.label}
                onClick={() => setSelectedCategories(new Set(pack.categories))}
                className="rounded border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 hover:border-[#f0c040]/35 hover:text-[#f0c040] transition"
              >
                {pack.label}
              </button>
            ))}
          </div>

          {/* Mobile search */}
          <div className="md:hidden mb-4">
            <input
              type="search"
              placeholder="Search services or what you want to replace…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent border border-[#30363d] focus:border-[#6e7681] focus:outline-none rounded px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          {/* No results */}
          {filtered.length === 0 ? (
            <div className="border border-[#30363d] rounded py-16 text-center text-slate-500 text-sm">
              No results for &ldquo;{search}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map(alt => {
                const domain = getDomain(alt.url);
                return (
                  <Link
                    key={alt.id}
                    to={`/alternative/${alt.id}`}
                    className="group flex flex-col rounded border border-[#30363d] bg-[#161b22] hover:border-[#484f58] hover:bg-[#21262d] transition-all p-4"
                  >
                    {/* Logo + name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center overflow-hidden">
                        {domain && (
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                            alt={alt.name}
                            className="h-6 w-6"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[13px] font-semibold text-slate-100 group-hover:text-white transition leading-tight">
                            {alt.name}
                          </span>
                          {alt.monetization === "affiliate" && (
                            <span className="rounded border border-[#f0c040]/20 bg-[#f0c040]/[0.06] px-1 py-0.5 text-[8px] font-bold uppercase text-[#f0c040]/60 tracking-wide">
                              partner
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-500 leading-none">
                            {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"} {alt.country}
                          </span>
                          <span className="text-slate-600 text-[10px]">·</span>
                          <span className="text-[10px] font-medium text-slate-500 border border-[#21262d] rounded px-1.5 py-0.5 leading-none">
                            {CATEGORY_LABELS[alt.category] ?? alt.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3 flex-1">
                      {alt.description}
                    </p>

                    <div className="mb-3">
                      <TrustBadges alternative={alt} compact />
                    </div>

                    {/* Replaces chips */}
                    {alt.replaces.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {alt.replaces.slice(0, 3).map(r => (
                          <span
                            key={r}
                            className="inline-block rounded border border-[#21262d] bg-[#161b22] px-1.5 py-0.5 text-[9px] text-slate-500"
                          >
                            {r}
                          </span>
                        ))}
                        {alt.replaces.length > 3 && (
                          <span className="text-[9px] text-slate-600 py-0.5 pl-0.5">
                            +{alt.replaces.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Newsletter CTA */}
      <section className="border-t border-[#2d4a6e] bg-[#080e1c] py-12">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Stay informed on EU tech sovereignty</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">Get weekly updates on privacy regulations, new European alternatives, and digital sovereignty trends.</p>
          </div>
          <NewsletterSignup compact={true} showName={false} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
