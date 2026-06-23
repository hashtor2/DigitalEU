import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SERVICES, type ServiceInfo } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialLinks } from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EarlyAccessSignup } from "@/components/EarlyAccessSignup";
import { COUNTRY_FLAGS } from "@/lib/flags";

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
  gaming: "Gaming",
  dating: "Dating",
  food: "Food & Delivery",
  fitness: "Fitness & Health",
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
      className={`group relative flex items-center gap-3 rounded-sm border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        checked
          ? "border-accent bg-accent/10"
          : "border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas hover:border-accent/50 hover:bg-accent/5"
      }`}
    >
      {/* Checkbox indicator */}
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 transition-colors ${
          checked
            ? "border-accent bg-accent text-white"
            : "border-border dark:border-dark-border group-hover:border-accent"
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
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white">
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
          className="hidden h-full w-full items-center justify-center text-sm font-bold text-text-secondary"
          aria-hidden
        >
          {fallbackIcon}
        </span>
      </span>

      {/* Name + flag */}
      <span
        className={`flex-1 text-sm font-semibold leading-tight transition-colors ${
          checked ? "text-accent" : "text-text-primary dark:text-dark-text-primary"
        }`}
      >
        {service.name}
      </span>
      {COUNTRY_FLAGS[service.ownerCountry] && (
        <span className="text-base flex-shrink-0" title={service.ownerCountry} aria-hidden>
          {COUNTRY_FLAGS[service.ownerCountry]}
        </span>
      )}
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
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />
      <SocialLinks />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">
            Free · Takes 30 seconds · No account needed
          </p>
          <h1 className="text-h1 font-mono text-text-primary dark:text-dark-text-primary mb-6 leading-tight">
            Find out which of your accounts put your privacy at risk
          </h1>
          <p className="mb-4 text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed font-semibold">
            Tick the services you use. We'll score each one for privacy risk, data breaches, and
            GDPR compliance — then show you the best European alternatives.
          </p>
          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-text-secondary dark:text-dark-text-secondary">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="font-medium">{SERVICES.length} services tracked</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium">149 EU alternatives catalogued</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning" />
              <span className="font-medium">Zero data sent to our servers</span>
            </span>
          </div>
        </div>

        {/* Early access: automatic Gmail inbox scan (manual-MVP signup) */}
        <div className="mb-12">
          <EarlyAccessSignup />
          <p className="mt-3 text-center text-xs text-text-secondary dark:text-dark-text-secondary">
            Or tick your services manually below — free, no signup.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
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
              className="pl-9 bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-sm border px-3 py-1 text-xs font-medium transition ${
              activeCategory === "all"
                ? "border-accent bg-accent/15 text-accent"
                : "border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-accent hover:text-text-primary dark:hover:text-dark-text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-sm border px-3 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-accent hover:text-text-primary dark:hover:text-dark-text-primary"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Service grid */}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-text-secondary dark:text-dark-text-secondary">No services match your search.</p>
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
        <div className="sticky bottom-0 mt-10 -mx-4 border-t border-border dark:border-dark-border bg-canvas/95 dark:bg-dark-canvas/95 backdrop-blur px-4 py-4 sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {selected.size === 0 ? (
                "Select services to get started"
              ) : (
                <>
                  <span className="font-semibold text-text-primary dark:text-dark-text-primary">{selected.size}</span> service
                  {selected.size !== 1 ? "s" : ""} selected
                </>
              )}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="bg-accent font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-40 rounded-sm"
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
