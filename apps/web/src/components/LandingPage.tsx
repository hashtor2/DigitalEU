import { Link } from "react-router-dom";
import { ALTERNATIVES, type Alternative } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { Header } from "@/components/Header";
import { COUNTRY_FLAGS } from "@/lib/flags";

function AlternativeCard({ alt }: { alt: Alternative }) {
  return (
    <a
      href={alt.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-4 transition hover:border-[#1a56db]/40 hover:bg-[#0f2040]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white group-hover:text-[#93c5fd] transition">
          {alt.name}
        </span>
        <span className="text-sm" aria-hidden>
          {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{alt.description}</p>
      <p className="mt-auto text-[10px] text-slate-500">Replaces {alt.replaces.join(", ")}</p>
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-full bg-[#0a1628] text-slate-100">
      <Header />

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 md:py-28 text-center">
        {/* Hero */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#f0c040]">
          Digital Sovereignty for Europeans
        </p>

        <h1 className="text-balance text-4xl font-bold text-white sm:text-5xl leading-[1.15]">
          How private are your online accounts?
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-slate-400 leading-relaxed">
          Select the services you use and get a personalized privacy score. We'll show you the
          risks and recommend secure, EU-based alternatives.
        </p>

        <div className="mt-10">
          <Button
            asChild
            className="bg-[#1a56db] text-white hover:bg-[#2563eb] font-semibold px-8 py-3 h-auto rounded-md text-base"
          >
            <Link to="/select">Check my privacy →</Link>
          </Button>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-500 border-t border-b border-[#1a2d4f] py-4 w-full">
          <span>🇨🇭 Data region: {SITE.dataRegionLabel}</span>
          <span>Zero-knowledge encrypted</span>
          <span>100% client-side — we can't read your data</span>
        </div>

        {/* Features */}
        <section id="features" className="mt-24 w-full text-left">
          <h2 className="mb-10 text-xs font-semibold uppercase tracking-widest text-slate-500">
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Local Inbox Scan",
                body: "Connect Gmail or Outlook (read-only metadata scope). Our scanner operates 100% inside your browser — we never see your passwords or emails.",
              },
              {
                n: "02",
                title: "Direct-Link Guides",
                body: "We find every subscription linked to your old address and give you direct links to each site's \"Change Email\" settings page.",
              },
              {
                n: "03",
                title: "Autofill Extension",
                body: "Our Chrome/Firefox extension automatically triggers on the settings page, fills your new Proton/Tuta address, and updates the account in one click.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-6">
                <p className="text-xs font-bold text-[#1a56db] mb-3">{n}</p>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        <section className="mt-24 w-full text-left">
          <h2 className="mb-10 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Featured European alternatives
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALTERNATIVES.map((alt) => (
              <AlternativeCard key={alt.id} alt={alt} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a2d4f] py-10 text-center text-xs text-slate-600 bg-[#080e1c]">
        <p className="font-semibold text-slate-400">{SITE.brand}</p>
        <p className="mt-1 italic text-slate-500">«{SITE.slogan}»</p>
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
              className="text-slate-500 transition hover:text-slate-300"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <p className="mt-6 text-slate-600 px-4">
          {SITE.domain} · Data region: {SITE.dataRegionLabel} 🇨🇭 · Free with partner sign-up, or
          €29 one-time buy
        </p>
      </footer>
    </div>
  );
}
