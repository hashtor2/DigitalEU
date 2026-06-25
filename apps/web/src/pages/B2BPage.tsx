import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { ALTERNATIVES, isB2B } from "@digitaleu/shared";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CATEGORY_LABELS: Record<string, string> = {
  "cloud-infra":        "Cloud Infrastructure",
  "code-hosting":       "Code & Dev Tools",
  analytics:            "Analytics & CRM",
  email:                "Email & Comms",
  "cloud-storage":      "Storage & Files",
  messaging:            "Team Messaging",
  office:               "Office & Collaboration",
  "password-manager":   "Password Management",
  "project-management": "Project Management",
  ai:                   "AI & Translation",
  fintech:              "Payments & Finance",
};

const B2B_ALTERNATIVES = ALTERNATIVES.filter(isB2B);

type FormState = "idle" | "submitting" | "success" | "error";

export function B2BPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", message: "",
  });

  const categories = useMemo(() => {
    const seen = new Set<string>();
    B2B_ALTERNATIVES.forEach((a) => seen.add(a.category));
    return Array.from(seen).filter((c) => c in CATEGORY_LABELS);
  }, []);

  const filtered = useMemo(() =>
    activeCategory === "all"
      ? B2B_ALTERNATIVES
      : B2B_ALTERNATIVES.filter((a) => a.category === activeCategory),
    [activeCategory],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setFormState("submitting");

    if (!isSupabaseConfigured || !supabase) {
      setFormState("error");
      return;
    }

    const { error } = await supabase.from("contact_leads").insert({
      name: form.name,
      company: form.company || null,
      email: form.email,
      phone: form.phone || null,
      message: form.message || null,
      source: "b2b",
    });

    setFormState(error ? "error" : "success");
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-sm border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">
          🇪🇺 For European Businesses
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary dark:text-dark-text-primary sm:text-5xl leading-tight">
          Your company still runs<br />on US tech.{" "}
          <span className="text-accent">That's a liability.</span>
        </h1>
        <p className="mt-5 text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
          We help European businesses migrate away from Big Tech — mapping your stack,
          building a migration plan, and executing it with you. Sovereign, compliant, and
          built to last.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#contact">
            <Button className="bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 text-base">
              Book a Free Consultation
            </Button>
          </a>
          <a href="#how">
            <Button variant="outline" className="border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:border-accent/30 px-6 py-3 text-base">
              How it works
            </Button>
          </a>
        </div>
      </section>

      {/* Pain points */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "⚖️", title: "GDPR Exposure", body: "US cloud providers transfer data to US jurisdiction by default. That's a compliance risk under Schrems II that courts are actively enforcing." },
            { icon: "🔒", title: "Vendor Lock-in", body: "Microsoft, Google, and AWS can change pricing, terms, or access at any time. European alternatives give you predictability and independence." },
            { icon: "🌍", title: "Sovereignty Gap", body: "Your customers' data flows through US datacenters. Moving to European infrastructure closes that gap and strengthens customer trust." },
          ].map((p) => (
            <div key={p.title} className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-3 font-bold text-text-primary dark:text-dark-text-primary">{p.title}</h3>
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold text-text-primary dark:text-dark-text-primary mb-8 text-center">
          How we work
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { step: "01", title: "Tech Stack Audit", body: "We map every US-owned tool your company uses — cloud, email, collaboration, DevOps — and score each one for GDPR risk, vendor dependency, and replaceability.", color: "text-accent border-accent/20 bg-accent/5" },
            { step: "02", title: "Migration Roadmap", body: "We deliver a prioritized, phased migration plan: which tools to replace first, which European alternatives fit your stack, and a realistic timeline with cost estimates.", color: "text-accent border-accent/20 bg-accent/5" },
            { step: "03", title: "Execution Support", body: "We don't just hand you a document. We guide or directly execute the migration — configuration, data transfer, staff onboarding, and post-migration monitoring.", color: "text-accent border-accent/20 bg-accent/5" },
          ].map((s) => (
            <div key={s.step} className={`rounded-sm border p-6 ${s.color}`}>
              <span className="text-xs font-mono font-bold opacity-60">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold text-text-primary dark:text-dark-text-primary">{s.title}</h3>
              <p className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-sm border border-accent/15 bg-accent/5 p-8">
          <h2 className="text-xl font-extrabold text-text-primary dark:text-dark-text-primary mb-6">
            Why businesses choose us
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Curated catalogue of 149+ vetted European alternatives",
              "Impartial advice — we recommend what fits you, not what pays us most",
              "We ourselves run on European tech (practicing what we preach)",
              "Deep expertise across cloud, SaaS, DevOps, and compliance",
              "Fixed-price audit packages — no surprise invoices",
              "GDPR & NIS2 compliance focus built into every recommendation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <span className="mt-0.5 text-accent font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Alternatives catalogue */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2 text-center">
          European alternatives for businesses
        </h2>
        <p className="text-center text-text-secondary dark:text-dark-text-secondary text-sm mb-8">
          {B2B_ALTERNATIVES.length} vetted alternatives across {categories.length} categories
        </p>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-sm border px-3 py-1 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "border-accent bg-accent/15 text-accent"
                : "border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-accent/30 hover:text-text-primary dark:hover:text-dark-text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-sm border px-3 py-1 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:border-accent/30 hover:text-text-primary dark:hover:text-dark-text-primary"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((alt) => (
            <a
              key={alt.id}
              href={alt.affiliateUrl ?? alt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4 transition hover:border-accent/40 hover:bg-accent/5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-text-primary dark:text-dark-text-primary group-hover:text-accent transition-colors line-clamp-1">
                  {alt.name}
                </span>
                <span className="shrink-0 rounded-sm border border-border dark:border-dark-border px-1.5 py-0.5 text-xs text-text-secondary dark:text-dark-text-secondary font-mono">
                  {alt.country}
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed line-clamp-2">
                {alt.description}
              </p>
              <p className="text-xs text-text-secondary/70 dark:text-dark-text-secondary/70 mt-auto">
                Replaces: {alt.replaces.join(", ")}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="mx-auto max-w-2xl w-full px-4 pb-20 sm:px-6">
        <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-8">
          <h2 className="text-2xl font-extrabold text-text-primary dark:text-dark-text-primary mb-1">
            Let's talk
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-6">
            Tell us about your company and what you want to move away from. We'll get back to you within one business day.
          </p>

          {formState === "success" ? (
            <div className="rounded-sm border border-accent/30 bg-accent/10 p-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-bold text-text-primary dark:text-dark-text-primary">Message received!</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-text-primary dark:text-dark-text-primary text-sm">Name *</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Anna Eriksson" className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-text-primary dark:text-dark-text-primary text-sm">Company</Label>
                  <Input id="company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme AB" className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-text-primary dark:text-dark-text-primary text-sm">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="anna@acme.se" className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-text-primary dark:text-dark-text-primary text-sm">Phone (optional)</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+46 70 000 00 00" className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-text-primary dark:text-dark-text-primary text-sm">What do you need help with?</Label>
                <Textarea id="message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us which tools you currently use (e.g. Google Workspace, AWS, Slack) and what you're looking to achieve…" className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:border-accent resize-none" />
              </div>

              {formState === "error" && (
                <p className="text-sm text-error">Something went wrong. Please try again or email us directly.</p>
              )}

              <Button type="submit" disabled={formState === "submitting" || !form.name || !form.email} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 text-base disabled:opacity-50">
                {formState === "submitting" ? "Sending…" : "Send message →"}
              </Button>

              <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
                No spam. We'll only use your details to follow up on this inquiry.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-accent/10 bg-accent/5 py-12 mt-12">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Keep up with EU digital sovereignty</h2>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Subscribe to our newsletter for the latest updates on regulations, infrastructure news, and European tech innovation.</p>
          </div>
          <NewsletterSignup compact={true} showName={false} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
