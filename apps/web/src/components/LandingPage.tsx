import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ALTERNATIVES, SERVICES, type Alternative, type ServiceInfo } from "@digitaleu/shared";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { Header } from "@/components/Header";
import { COUNTRY_FLAGS } from "@/lib/flags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS: Record<ServiceInfo["category"], string> = {
  email: "Email",
  cloud: "Cloud Storage",
  search: "Search",
  security: "Security",
  social: "Social Media",
  shopping: "Shopping",
  productivity: "Productivity",
  streaming: "Streaming",
  communication: "Communication",
  finance: "Finance",
  travel: "Travel",
  tech: "Tech",
  gaming: "Gaming",
  dating: "Dating",
  food: "Food",
  fitness: "Fitness",
  education: "Education",
};

function ServiceCard({
  service,
  checked,
  onToggle,
}: {
  service: ServiceInfo;
  checked: boolean;
  onToggle: () => void;
}) {
  const logoUrl = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=64`;
  const fallbackUrl = `https://${service.domain}/favicon.ico`;
  const fallbackIcon = service.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56db] ${
        checked
          ? "border-[#1a56db] bg-[#1a56db]/10"
          : "border-[#2d4a6e] bg-[#1e293b] hover:border-[#2a3d5f] hover:bg-[#0f2040]"
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-[#1a56db] bg-[#1a56db] text-white"
            : "border-slate-600 group-hover:border-slate-400"
        }`}
        aria-hidden
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden>
            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        <img
          src={logoUrl}
          alt=""
          className="h-7 w-7 object-contain"
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            if (t.src !== fallbackUrl) { t.src = fallbackUrl; return; }
            t.style.display = "none";
            const next = t.nextElementSibling as HTMLElement | null;
            if (next) next.style.display = "flex";
          }}
        />
        <span
          className="hidden h-full w-full items-center justify-center text-sm font-bold text-slate-600"
          aria-hidden
        >
          {fallbackIcon}
        </span>
      </span>

      <div className="flex-1 flex items-center gap-2">
        <span
          className={`text-sm font-semibold leading-tight transition-colors ${
            checked ? "text-[#93c5fd]" : "text-slate-200 group-hover:text-white"
          }`}
        >
          {service.name}
        </span>
        {COUNTRY_FLAGS[service.ownerCountry] && (
          <span className="text-base flex-shrink-0" title={service.ownerCountry} aria-hidden>
            {COUNTRY_FLAGS[service.ownerCountry]}
          </span>
        )}
      </div>
    </button>
  );
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

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

export function LandingPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const navigate = useNavigate();
  const grouped = groupByCategory(ALTERNATIVES);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SERVICES.filter((s) => {
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || s.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    SERVICES.forEach((s) => seen.add(s.category));
    return Array.from(seen) as ServiceInfo["category"][];
  }, []);

  const handleSubmit = () => {
    if (selected.size === 0) return;
    sessionStorage.setItem("digitaleu_selected", JSON.stringify(Array.from(selected)));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-full bg-[#0d1117] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">

        {/* ── Hero with service selector ── */}
        <div className="mb-12">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f0c040]">
              Free · Takes 30 seconds · No account needed
            </p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Find out which of your accounts put your privacy at risk
            </h1>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Tick the services you use. We'll score each one for privacy risk, data breaches, and
              GDPR compliance — then show you the best European alternatives.
            </p>

            {/* Quick Email Scanner CTA */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 mb-6">
              <Link
                to="/emailscanner"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1a56db] to-[#2563eb] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#1a56db]/50 transition transform hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Scan Your Email
              </Link>
              <span className="text-xs text-slate-400 self-center">
                or manually select below →
              </span>
            </div>

            {/* Trust indicators */}
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {SERVICES.length} services tracked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5b8ff9]" />
                {ALTERNATIVES.length} EU alternatives catalogued
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Zero data sent to our servers
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <Input
                placeholder="Search services…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-[#1e293b] border-[#2d4a6e] text-white placeholder:text-slate-400 focus:border-[#1a56db]"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded border px-3 py-1 text-xs font-medium transition ${
                activeCategory === "all"
                  ? "border-[#1a56db] bg-[#1a56db]/15 text-[#93c5fd]"
                  : "border-[#2d4a6e] text-slate-400 hover:border-[#2a3d5f] hover:text-white"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded border px-3 py-1 text-xs font-medium transition ${
                  activeCategory === cat
                    ? "border-[#1a56db] bg-[#1a56db]/15 text-[#93c5fd]"
                    : "border-[#2d4a6e] text-slate-400 hover:border-[#2a3d5f] hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Service grid */}
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-slate-400">No services match your search.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  checked={selected.has(service.id)}
                  onToggle={() => toggle(service.id)}
                />
              ))}
            </div>
          )}

          {/* CTA bar */}
          <div className="sticky bottom-0 mt-10 -mx-4 border-t border-[#2d4a6e] bg-[#0d1117]/95 backdrop-blur px-4 py-4 sm:-mx-6 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {selected.size === 0 ? (
                  "Select services to get started"
                ) : (
                  <>
                    <span className="font-semibold text-white">{selected.size}</span> service
                    {selected.size !== 1 ? "s" : ""} selected
                  </>
                )}
              </p>
              <Button
                onClick={handleSubmit}
                disabled={selected.size === 0}
                className="bg-[#1a56db] font-semibold text-white hover:bg-[#2563eb] disabled:opacity-40 rounded-md"
                size="lg"
              >
                Get My Privacy Report →
              </Button>
            </div>
          </div>
        </div>

        {/* ── Alternatives section ── */}
        <section className="mt-20">
          <div className="mb-4 flex items-baseline justify-between border-b border-[#30363d] pb-3">
            <h2 className="text-sm font-semibold text-white">European Privacy Alternatives</h2>
            <Link
              to="/directory"
              className="text-[11px] text-slate-500 hover:text-slate-400 transition"
            >
              Browse all {ALTERNATIVES.length} →
            </Link>
          </div>

          {grouped.slice(0, 8).map(([category, alts]) => (
            <div key={category}>
              <div className="flex items-center gap-3 py-2 border-b border-[#30363d]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 w-28 flex-shrink-0">
                  {CATEGORY_LABELS[category as ServiceInfo["category"]] ?? category}
                </span>
                <span className="text-[10px] text-slate-800 font-mono">{alts.length}</span>
              </div>

              {alts.slice(0, 3).map(alt => {
                const domain = getDomain(alt.url);
                return (
                  <Link
                    key={alt.id}
                    to={`/services/${alt.id}`}
                    className="group flex items-center gap-3 py-2.5 pl-4 border-b border-[#21262d] hover:bg-[#21262d] transition-colors"
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
                    <span className="text-[11px] text-slate-500 hidden sm:block truncate">
                      replaces {alt.replaces.slice(0, 2).join(", ")}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-400 hidden lg:block pr-4 truncate max-w-[200px]">
                      {alt.description}
                    </span>
                  </Link>
                );
              })}

              {alts.length > 3 && (
                <div className="py-2 pl-4 border-b border-[#21262d]">
                  <Link
                    to="/directory"
                    className="text-[10px] text-slate-400 hover:text-slate-400 transition pl-7"
                  >
                    +{alts.length - 3} more →
                  </Link>
                </div>
              )}
            </div>
          ))}

          {grouped.length > 8 && (
            <div className="mt-4 pt-4 border-t border-[#30363d] text-center">
              <Link
                to="/directory"
                className="text-xs text-slate-500 hover:text-slate-400 transition"
              >
                View all {grouped.length} categories and {ALTERNATIVES.length} alternatives →
              </Link>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#30363d] py-8 mt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">{SITE.brand}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
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
                className="text-[11px] text-slate-400 hover:text-slate-400 transition"
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

export default LandingPage;
