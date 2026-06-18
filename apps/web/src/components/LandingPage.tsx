import { Link } from "react-router-dom";
import { ALTERNATIVES, type Alternative } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
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

function AlternativeCard({ alt }: { alt: Alternative }) {
  return (
    <a
      href={alt.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-400/40 hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white group-hover:text-sky-300 transition">{alt.name}</span>
        <span className="text-lg" aria-hidden>
          {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
        </span>
      </div>
      <p className="text-xs text-slate-400">{alt.description}</p>
      <p className="mt-auto text-[10px] text-slate-500 font-semibold">
        Replaces {alt.replaces.join(", ")}
      </p>
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <Header />

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 md:py-24 text-center">
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1 text-xs font-semibold text-sky-400">
          🇪🇺 Reclaim Your Digital Sovereignty
        </span>

        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-[1.1]">
          The easiest way to{" "}
          <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
            dump Gmail
          </span>{" "}
          & move to privacy
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg text-slate-400 leading-relaxed">
          Converting from Gmail to secure alternatives like Proton is a nightmare of "invisible" accounts.
          We securely scan your inbox, map your registered services, and help you migrate them in minutes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-sky-500 text-white hover:bg-sky-400 font-bold px-6 py-3 rounded-xl shadow-lg shadow-sky-500/10"
          >
            <Link to="/dashboard">Scan my inbox</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">See how it works</a>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400 border-t border-b border-white/5 py-4 w-full">
          <span className="inline-flex items-center gap-1.5">
            🇨🇭 Data region: {SITE.dataRegionLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            🔒 Client-side encrypted (Zero-Knowledge)
          </span>
          <span className="inline-flex items-center gap-1.5">
            👁️ 100% Client-side — we can't read your data
          </span>
        </div>

        {/* Core Features Grid */}
        <section id="features" className="mt-24 w-full text-left scroll-mt-6">
          <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-sky-400">
            How DigitalEU Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <span className="text-xl">🔍</span>
              <h3 className="text-base font-bold text-white">1. Local Inbox Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Gmail or Outlook (read-only metadata scope). Our scanner operates 100% inside your browser — we never see or store your passwords or emails.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <span className="text-xl">🔗</span>
              <h3 className="text-base font-bold text-white">2. Direct-Link Guides</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We find every subscription and account linked to your old address, then give you direct deep links to each site's specific "Change Email" settings page.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <span className="text-xl">🧩</span>
              <h3 className="text-base font-bold text-white">3. Autofill Extension</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our Chrome/Firefox extension automatically triggers on the settings page, generates an alias or fills your new Proton/Tuta mail, and updates the account in one click.
              </p>
            </div>
          </div>
        </section>

        {/* Alternatives Catalogue Grid */}
        <section className="mt-24 w-full text-left">
          <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-sky-400">
            Featured European Alternatives
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALTERNATIVES.map((alt) => (
              <AlternativeCard key={alt.id} alt={alt} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-xs text-slate-600 bg-slate-950/40">
        <p className="font-bold text-slate-400">{SITE.brand}</p>
        <p className="mt-1 italic text-slate-500">«{SITE.slogan}»</p>

        {/* Social Navigation */}
        <nav
          aria-label="Social channels"
          className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition hover:text-sky-400"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <p className="mt-6 text-slate-600 leading-relaxed px-4">
          {SITE.domain} · Data region: {SITE.dataRegionLabel} 🇨🇭 · Free with partner sign-up, or €29 one-time buy
        </p>
      </footer>
    </div>
  );
}
