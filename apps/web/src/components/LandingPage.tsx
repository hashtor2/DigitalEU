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

export function LandingPage() {
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
    sessionStorage.setItem("digitaleu_selected", JSON.stringify(Array.from(selected)));
    navigate("/report");
  };

  const handleAutoScan = () => {
    navigate("/emailscanner");
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />
      <SocialLinks />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ====== HERO + TWO-COLUMN LAYOUT ====== */}
        <div className="mb-16">
          {/* Hero headline */}
          <div className="mb-12">
            <h1 className="text-h1 font-mono text-text-primary dark:text-dark-text-primary mb-6 leading-tight max-w-3xl">
              Reclaim your privacy in 30 seconds
            </h1>
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl leading-relaxed">
              Scan your inbox, see which services have your data, and switch to European alternatives you can trust.
            </p>
          </div>

          {/* Two-column: Auto-scan + Newsletter */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* LEFT COLUMN: Auto-scan pathway */}
            <div className="md:col-span-2">
              {/* Auto-scan card */}
              <div className="mb-8 border border-border dark:border-dark-border rounded-sm p-8 bg-white dark:bg-dark-canvas relative overflow-hidden">
                {/* Accent border on left */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent"></div>
                
                <div className="mb-6">
                  <h2 className="text-h2 font-mono text-text-primary dark:text-dark-text-primary mb-3">
                    Auto-scan your inbox
                  </h2>
                  <p className="text-base text-text-secondary dark:text-dark-text-secondary">
                    Connect Gmail or Outlook. We scan your email headers only — no account passwords, no storage of data.
                  </p>
                </div>

                {/* Trust statement with emerald accent */}
                <div className="mb-6 border-t border-border dark:border-dark-border pt-4">
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                    <span className="text-accent text-lg font-bold">✓</span>
                    <strong className="text-accent">Zero-knowledge.</strong> <span>Results stay on your device. No login required.</span>
                  </p>
                </div>

                {/* CTA Button - Emerald */}
                <Button
                  onClick={handleAutoScan}
                  className="w-full bg-accent text-white font-mono font-semibold py-3 rounded-sm hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md"
                  size="lg"
                >
                  Start Auto-Scan →
                </Button>
              </div>

              {/* Or divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border dark:border-dark-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-canvas dark:bg-dark-canvas px-3 text-sm text-text-secondary dark:text-dark-text-secondary font-medium">
                    Or choose manually below
                  </span>
                </div>
              </div>

              {/* Manual selection section */}
              <div>
                <h2 className="text-h2 font-mono text-text-primary dark:text-dark-text-primary mb-6">
                  Choose your services
                </h2>

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
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
              </div>
            </div>

            {/* RIGHT COLUMN: Newsletter signup */}
            <div className="md:col-span-1">
              <div className="sticky top-24 border border-secondary-accent dark:border-secondary-accent rounded-sm p-6 bg-secondary-accent/5 dark:bg-secondary-accent/10">
                <div className="mb-2 inline-block px-2 py-1 bg-secondary-accent/20 text-secondary-accent rounded-sm text-xs font-semibold uppercase tracking-wide">
                  New this week
                </div>
                <h2 className="text-h2 font-mono text-text-primary dark:text-dark-text-primary mb-4">
                  EU tech digest
                </h2>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
                  Weekly news about privacy, compliance, and European alternatives.
                </p>
                <EarlyAccessSignup />
              </div>
            </div>
          </div>
        </div>

        {/* ====== SECONDARY SECTIONS ====== */}
        <div className="mt-20 border-t border-border dark:border-dark-border pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* EU News */}
            <div className="group">
              <h3 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary mb-4">
                🗞️ EU News
              </h3>
              <p className="text-base text-text-secondary dark:text-dark-text-secondary mb-6">
                Latest on digital rights, GDPR enforcement, and tech sovereignty.
              </p>
              <Button
                onClick={() => navigate("/news")}
                className="border-2 border-warm-accent bg-transparent text-warm-accent hover:bg-warm-accent hover:text-white rounded-sm px-4 py-2 text-sm font-semibold transition-all"
              >
                Read news →
              </Button>
            </div>

            {/* EU Alternatives Directory */}
            <div className="group">
              <h3 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary mb-4">
                📚 EU Alternatives
              </h3>
              <p className="text-base text-text-secondary dark:text-dark-text-secondary mb-6">
                Curated catalog of privacy-first, European services across all categories.
              </p>
              <Button
                onClick={() => navigate("/directory")}
                className="border-2 border-secondary-accent bg-transparent text-secondary-accent hover:bg-secondary-accent hover:text-white rounded-sm px-4 py-2 text-sm font-semibold transition-all"
              >
                Browse catalog →
              </Button>
            </div>

            {/* For Business */}
            <div className="group">
              <h3 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary mb-4">
                🏢 For Business
              </h3>
              <p className="text-base text-text-secondary dark:text-dark-text-secondary mb-6">
                Help your organization migrate to European tech. Compliance and sovereignty.
              </p>
              <Button
                onClick={() => navigate("/b2b")}
                className="border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-white rounded-sm px-4 py-2 text-sm font-semibold transition-all"
              >
                Learn more →
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky bottom bar */}
        {selected.size > 0 && (
          <div className="sticky bottom-0 mt-10 -mx-4 border-t border-border dark:border-dark-border bg-canvas/95 dark:bg-dark-canvas/95 backdrop-blur px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                <span className="font-semibold text-text-primary dark:text-dark-text-primary">{selected.size}</span> service
                {selected.size !== 1 ? "s" : ""} selected
              </p>
              <Button
                onClick={handleSubmit}
                className="bg-accent font-mono font-semibold text-white hover:bg-accent-hover rounded-sm"
                size="lg"
              >
                Get My Privacy Report →
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
