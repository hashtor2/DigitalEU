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
    <div className="min-h-screen bg-[#0a1628] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#f0c040] mb-3">
              EU Catalogue
            </p>
            <h1 className="text-3xl font-bold text-white">European Privacy Catalogue</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              We vet every service ourselves. High-performance, legally compliant alternatives that keep your data under European data jurisdictions.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {ALTERNATIVES.length} alternatives vetted
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search (e.g. 'Proton', 'Gmail')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0d1b33] border border-[#1a2d4f] focus:border-[#1a56db] focus:outline-none rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d1b33] border border-[#1a2d4f] focus:border-[#1a56db] focus:outline-none rounded-lg px-4 py-2 text-sm text-white"
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
          <div className="border border-dashed border-[#1a2d4f] rounded-lg p-12 text-center text-slate-500 text-sm">
            No European alternatives found matching "{search}".
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((alt) => (
              <a
                key={alt.id}
                href={alt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2.5 rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-5 transition hover:border-[#1a56db]/40 hover:bg-[#0f2040]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white group-hover:text-[#93c5fd] transition text-sm">
                      {alt.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
                      {CATEGORY_LABELS[alt.category] || alt.category}
                    </span>
                  </div>
                  <span className="text-xl" aria-hidden="true" title={`Hosted in ${alt.country}`}>
                    {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{alt.description}</p>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#1a2d4f] text-[10px] text-slate-500">
                  <span>Replaces: {alt.replaces.join(", ")}</span>
                  <span className={`px-1.5 py-0.5 rounded uppercase tracking-wide text-[9px] font-semibold ${
                    alt.monetization === "affiliate"
                      ? "bg-[#f0c040]/10 text-[#f0c040]/70 border border-[#f0c040]/20"
                      : "bg-[#1a2d4f] text-slate-400"
                  }`}>
                    {alt.monetization === "affiliate" ? "Partner" : "Independent Pick"}
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
