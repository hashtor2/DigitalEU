import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { ALTERNATIVES, isB2B } from "@digitaleu/shared";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-64 w-96 rounded-full bg-sky-500/5 blur-3xl" />
      </div>

      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
          🇪🇺 For European Businesses
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
          Your company still runs<br />on US tech.{" "}
          <span className="text-emerald-400">That's a liability.</span>
        </h1>
        <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We help European businesses migrate away from Big Tech — mapping your stack,
          building a migration plan, and executing it with you. Sovereign, compliant, and
          built to last.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#contact">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 text-base shadow-lg shadow-emerald-500/20">
              Book a Free Consultation
            </Button>
          </a>
          <a href="#how">
            <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:border-white/30 px-6 py-3 text-base">
              How it works
            </Button>
          </a>
        </div>
      </section>

      {/* Pain points */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: "⚖️",
              title: "GDPR Exposure",
              body: "US cloud providers transfer data to US jurisdiction by default. That's a compliance risk under Schrems II that courts are actively enforcing.",
            },
            {
              icon: "🔒",
              title: "Vendor Lock-in",
              body: "Microsoft, Google, and AWS can change pricing, terms, or access at any time. European alternatives give you predictability and independence.",
            },
            {
              icon: "🌍",
              title: "Sovereignty Gap",
              body: "Your customers' data flows through US datacenters. Moving to European infrastructure closes that gap and strengthens customer trust.",
            },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-3 font-bold text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold text-white mb-8 text-center">
          How we work
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Tech Stack Audit",
              body: "We map every US-owned tool your company uses — cloud, email, collaboration, DevOps — and score each one for GDPR risk, vendor dependency, and replaceability.",
              color: "text-sky-400 border-sky-400/20 bg-sky-500/5",
            },
            {
              step: "02",
              title: "Migration Roadmap",
              body: "We deliver a prioritized, phased migration plan: which tools to replace first, which European alternatives fit your stack, and a realistic timeline with cost estimates.",
              color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
            },
            {
              step: "03",
              title: "Execution Support",
              body: "We don't just hand you a document. We guide or directly execute the migration — configuration, data transfer, staff onboarding, and post-migration monitoring.",
              color: "text-violet-400 border-violet-400/20 bg-violet-500/5",
            },
          ].map((s) => (
            <div key={s.step} className={`rounded-2xl border p-6 ${s.color}`}>
              <span className="text-xs font-mono font-bold opacity-60">{s.step}</span>
              <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-8">
          <h2 className="text-xl font-extrabold text-white mb-6">
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
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-0.5 text-emerald-400 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Alternatives catalogue */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-extrabold text-white mb-2 text-center">
          European alternatives for businesses
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          {B2B_ALTERNATIVES.length} vetted alternatives across {categories.length} categories
        </p>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
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
                  ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
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
              className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/40 hover:bg-emerald-500/5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {alt.name}
                </span>
                <span className="shrink-0 rounded-full border border-white/10 px-1.5 py-0.5 text-xs text-slate-500 font-mono">
                  {alt.country}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {alt.description}
              </p>
              <p className="text-xs text-slate-600 mt-auto">
                Replaces: {alt.replaces.join(", ")}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="mx-auto max-w-2xl w-full px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-extrabold text-white mb-1">
            Let's talk
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Tell us about your company and what you want to move away from. We'll get back to you within one business day.
          </p>

          {formState === "success" ? (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-bold text-white">Message received!</p>
              <p className="text-sm text-slate-400 mt-1">
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-slate-300 text-sm">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Anna Eriksson"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-slate-300 text-sm">Company</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Acme AB"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-300 text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="anna@acme.se"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-slate-300 text-sm">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+46 70 000 00 00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-slate-300 text-sm">What do you need help with?</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us which tools you currently use (e.g. Google Workspace, AWS, Slack) and what you're looking to achieve…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-400 resize-none"
                />
              </div>

              {formState === "error" && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <Button
                type="submit"
                disabled={formState === "submitting" || !form.name || !form.email}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 text-base shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {formState === "submitting" ? "Sending…" : "Send message →"}
              </Button>

              <p className="text-xs text-slate-600 text-center">
                No spam. We'll only use your details to follow up on this inquiry.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
