import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ALTERNATIVES, type ServiceCategory } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { COUNTRY_FLAGS } from "@/lib/flags";

const CATEGORY_LABELS: Record<ServiceCategory | string, string> = {
  email: "Email & Communication",
  vpn: "VPN",
  "cloud-storage": "Cloud Storage",
  browser: "Browser",
  "password-manager": "Password Manager",
  search: "Search Engine",
  office: "Office Suite",
  messaging: "Messaging",
  "code-hosting": "Code Hosting",
  "cloud-infra": "Infrastructure",
  analytics: "Analytics",
  hardware: "Hardware",
  ai: "AI Tools",
  fintech: "Fintech",
  "project-management": "Project Management",
  security: "Security",
  social: "Social Media",
  transport: "Transport",
};

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

export function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(ALTERNATIVES.map(a => a.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALTERNATIVES.filter(alt => {
      const matchesSearch =
        !q ||
        alt.name.toLowerCase().includes(q) ||
        alt.description.toLowerCase().includes(q) ||
        alt.replaces.some(r => r.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === "all" || alt.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const alt of filtered) {
      const existing = map.get(alt.category) ?? [];
      existing.push(alt);
      map.set(alt.category, existing);
    }
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col">
      <title>European Privacy Catalogue — 200+ Alternatives to Big Tech | digitaleu.me</title>
      <meta name="description" content="Browse 200+ vetted European alternatives to Gmail, Google Drive, Dropbox, Slack, and more. All services keep data within EU/EEA/Swiss jurisdiction." />
      <Header />

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <h1 className="text-xl font-bold text-white">European Privacy Catalogue</h1>
            <span className="text-[11px] text-slate-600 font-mono">{ALTERNATIVES.length} alternatives</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
            Vetted European alternatives. Every service keeps data within EU/EEA/Swiss jurisdiction.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
          <input
            type="search"
            placeholder="Search by name or replaces (e.g. 'Gmail')…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent border border-white/[0.08] focus:border-white/[0.18] focus:outline-none rounded px-3 py-1.5 text-sm text-white placeholder:text-slate-600"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#06090f] border border-white/[0.08] focus:border-white/[0.18] focus:outline-none rounded px-3 py-1.5 text-sm text-slate-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All categories" : CATEGORY_LABELS[cat] ?? cat}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="border border-white/[0.06] rounded py-16 text-center text-slate-600 text-sm">
            No results for &ldquo;{search}&rdquo;.
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-600">
                    Service
                  </th>
                  <th className="py-2.5 text-left text-[11px] font-medium text-slate-600 w-14 hidden sm:table-cell">
                    Country
                  </th>
                  <th className="py-2.5 pr-4 text-left text-[11px] font-medium text-slate-600 hidden md:table-cell">
                    Description
                  </th>
                  <th className="py-2.5 pr-4 text-left text-[11px] font-medium text-slate-600 hidden sm:table-cell">
                    Replaces
                  </th>
                  <th className="py-2.5 pr-4 w-16" />
                </tr>
              </thead>

              {Array.from(grouped.entries()).map(([category, alts]) => (
                <tbody key={category}>
                  {/* Category header row */}
                  <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                    <td colSpan={5} className="px-4 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {CATEGORY_LABELS[category] ?? category}
                        </span>
                        <span className="text-[10px] text-slate-700 font-mono">{alts.length}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Service rows */}
                  {alts.map(alt => {
                    const domain = getDomain(alt.url);
                    return (
                      <tr
                        key={alt.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/directory/${alt.id}`}
                            className="flex items-center gap-2.5"
                          >
                            {domain && (
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                                alt=""
                                className="h-4 w-4 rounded flex-shrink-0"
                                onError={e => {
                                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                                }}
                              />
                            )}
                            <span className="text-[13px] font-medium text-slate-200 group-hover:text-white transition">
                              {alt.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <span
                            className="text-base leading-none"
                            title={alt.country}
                          >
                            {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
                          </span>
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell max-w-[240px]">
                          <span className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {alt.description}
                          </span>
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">
                          <span className="text-[11px] text-slate-600">
                            {alt.replaces.slice(0, 3).join(", ")}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {alt.monetization === "affiliate" && (
                            <span className="inline-block rounded border border-[#f0c040]/20 bg-[#f0c040]/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#f0c040]/60 tracking-wide">
                              partner
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
