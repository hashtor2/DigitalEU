import { useState } from "react";
import { ALTERNATIVES, type ServiceCategory } from "@digitaleu/shared";
import { Header } from "@/components/Header";

const COUNTRY_FLAGS: Record<string, string> = {
  CH: "🇨🇭",
  SE: "🇸🇪",
  DE: "🇩🇪",
  FR: "🇫🇷",
  NL: "🇳🇱",
  EE: "🇪🇪",
  PL: "🇵🇱",
};

const CATEGORY_LABELS: Record<ServiceCategory | string, string> = {
  email: "Email & Communication",
  vpn: "VPN",
  "cloud-storage": "Cloud Files & Backup",
  browser: "Browsers",
  "password-manager": "Password Managers",
  search: "Search Engines",
  office: "Office Suites",
  messaging: "Messaging & Chat",
  "code-hosting": "Code Hosting",
  "cloud-infra": "Cloud Infrastructure",
  analytics: "Privacy Analytics",
  hardware: "Hardware & Devices",
};

export function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(ALTERNATIVES.map((a) => a.category)))];

  const filtered = ALTERNATIVES.filter((alt) => {
    const matchesSearch =
      alt.name.toLowerCase().includes(search.toLowerCase()) ||
      alt.description.toLowerCase().includes(search.toLowerCase()) ||
      alt.replaces.some((rep) => rep.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || alt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">European Privacy Catalogue</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              We vet every service ourselves. These are high-performance, legally compliant alternatives that keep your personal files, notes, and emails strictly under European data jurisdictions.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Vetted alternatives: {ALTERNATIVES.length}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-900/40 p-4 rounded-xl border border-white/5">
          <input
            type="text"
            placeholder="Search alternative (e.g. 'Proton', 'Mailchimp')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-950 border border-white/10 focus:border-sky-500 focus:outline-none rounded-lg px-4 py-2 text-sm text-white"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-white/10 focus:border-sky-500 focus:outline-none rounded-lg px-4 py-2 text-sm text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        {/* Grid List */}
        {filtered.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-500 text-sm">
            No European alternatives found matching "{search}".
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((alt) => (
              <a
                key={alt.id}
                href={alt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-400/40 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-sky-300 transition text-base">
                      {alt.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5 tracking-wider">
                      {CATEGORY_LABELS[alt.category] || alt.category}
                    </span>
                  </div>
                  <span className="text-xl" aria-hidden="true" title={`Hosted in ${alt.country}`}>
                    {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{alt.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 text-[10px] text-slate-500 font-semibold">
                  <span>Replaces: {alt.replaces.join(", ")}</span>
                  <span className="bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/10 uppercase tracking-wide text-[9px]">
                    {alt.monetization === "affiliate" ? "Partner" : "Direct Anbefalt"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
