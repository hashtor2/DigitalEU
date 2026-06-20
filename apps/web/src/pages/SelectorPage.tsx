import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SERVICES, type ServiceInfo } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORY_LABELS: Record<ServiceInfo["category"], string> = {
  social: "Social Media",
  email: "Email",
  cloud: "Cloud Storage",
  streaming: "Streaming",
  shopping: "Shopping",
  travel: "Travel",
  search: "Search",
  productivity: "Productivity",
  communication: "Messaging",
  finance: "Finance",
  security: "Security",
  tech: "Tech",
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
  const logoUrl = `https://logo.clearbit.com/${service.domain}`;
  const fallbackIcon = service.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
        checked
          ? "border-sky-400 bg-sky-500/10 shadow-md shadow-sky-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      {/* Checkbox indicator */}
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-sky-400 bg-sky-400 text-white"
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

      {/* Logo */}
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        <img
          src={logoUrl}
          alt=""
          className="h-7 w-7 object-contain"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
            const next = target.nextElementSibling as HTMLElement | null;
            if (next) next.style.display = "flex";
          }}
        />
        <span
          className="hidden h-full w-full items-center justify-center text-sm font-bold text-slate-700"
          aria-hidden
        >
          {fallbackIcon}
        </span>
      </span>

      {/* Name */}
      <span
        className={`text-sm font-semibold leading-tight transition-colors ${
          checked ? "text-sky-300" : "text-slate-200 group-hover:text-white"
        }`}
      >
        {service.name}
      </span>
    </button>
  );
}

export function SelectorPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const navigate = useNavigate();

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
    // Store selected IDs in sessionStorage so the dashboard can read them
    sessionStorage.setItem("digitaleu_selected", JSON.stringify(Array.from(selected)));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Conversion hero */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs font-semibold text-sky-400">
            🇪🇺 Free · Takes 30 seconds · No account needed
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Find out which of your accounts put your privacy at risk
          </h1>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Tick the services you use. We'll score each one for privacy risk, data breaches, and
            GDPR compliance — then show you the best European alternatives.
          </p>
          {/* Trust indicators */}
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {SERVICES.length} services tracked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              149 EU alternatives catalogued
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Zero data sent to our servers
            </span>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-sky-400"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "border-sky-400 bg-sky-500/15 text-sky-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "border-sky-400 bg-sky-500/15 text-sky-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Service grid */}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No services match your search.</p>
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

        {/* Sticky bottom bar */}
        <div className="sticky bottom-0 mt-10 -mx-4 border-t border-white/10 bg-slate-950/90 backdrop-blur px-4 py-4 sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              {selected.size === 0 ? (
                "Select services to get started"
              ) : (
                <>
                  <span className="font-bold text-white">{selected.size}</span> service
                  {selected.size !== 1 ? "s" : ""} selected
                </>
              )}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="bg-sky-500 font-bold text-white hover:bg-sky-400 disabled:opacity-40"
              size="lg"
            >
              Get My Privacy Report →
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
