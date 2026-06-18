import { Link } from "react-router-dom";
import { ALTERNATIVES, type Alternative } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";

const COUNTRY_FLAGS: Record<string, string> = {
  CH: "🇨🇭",
  SE: "🇸🇪",
  DE: "🇩🇪",
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
        <span className="font-semibold text-white">{alt.name}</span>
        <span className="text-lg" aria-hidden>
          {COUNTRY_FLAGS[alt.country] ?? "🇪🇺"}
        </span>
      </div>
      <p className="text-sm text-slate-400">{alt.description}</p>
      <p className="mt-auto text-xs text-slate-500">
        Erstatter {alt.replaces.join(", ")}
      </p>
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      {/* Bakgrunnsglød */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          🇪🇺 Digital suverenitet for alle
        </span>

        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          Ta tilbake det{" "}
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            digitale livet
          </span>{" "}
          ditt
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-slate-400">
          digitaleu.me hjelper deg å flytte fra Big Tech til personvernvennlige,
          europeiske alternativer — steg for steg, helt uten teknisk kunnskap.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-sky-500 text-white hover:bg-sky-400"
          >
            <Link to="/dashboard">Skann innboksen min</Link>
          </Button>
          <Button size="lg" variant="outline">
            Se hvordan det funker
          </Button>
        </div>

        <section className="mt-24 w-full">
          <h2 className="mb-8 text-left text-sm font-medium uppercase tracking-widest text-slate-500">
            Europeiske alternativer
          </h2>
          <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {ALTERNATIVES.map((alt) => (
              <AlternativeCard key={alt.id} alt={alt} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-600">
        digitaleu.me · Gratis med partner, eller €29 engangskjøp
      </footer>
    </div>
  );
}
