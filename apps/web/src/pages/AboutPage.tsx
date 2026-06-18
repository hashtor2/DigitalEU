import { Header } from "@/components/Header";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12 md:py-16">
        <article className="space-y-6">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-0.5 text-xs font-semibold text-sky-400">
              🇪🇺 The Sovereignty Manifesto
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Who owns your data, and who sees them?
            </h1>
            <p className="text-xs text-slate-500 font-mono">Published June 18, 2026</p>
          </div>

          <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-white/5">
            <p className="text-base text-white font-medium leading-relaxed">
              Every day, millions of Europeans wake up inside walled gardens. Our photos, bank logins, documents, and private emails reside on foreign advertising servers, subjected to algorithmic profiling and extraterritorial search laws. We are digitally occupied.
            </p>

            <h2 className="text-lg font-bold text-white pt-4">Our Core Philosophy</h2>
            <p>
              DigitalEU.me was founded to solve a singular, administrative bottleneck: **The friction of leaving.**
            </p>
            <p>
              Most consumers *want* privacy. They understand that their data is a sovereign asset. But migrating years of accumulated digital history feels impossible. How do you find the 50 different websites registered with your old `@gmail.com`? How do you map them, change them, and safely delete your Big Tech footprint?
            </p>
            <p>
              We build the bridges. We write the software that scans your mail headers safely in your own browser, direct you straight to settings pages, and autofill your details—all while remaining 100% zero-knowledge.
            </p>

            <h2 className="text-lg font-bold text-white pt-4">Our Ethical Pillars</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-white">100% Client-Side Privacy:</strong> We never log or upload your emails. The "Inbox Scanner" uses safe, read-only metadata and computes all service matches locally inside your browser sandbox.
              </li>
              <li>
                <strong className="text-white">Zero-Knowledge Cryptography:</strong> When you register for an account to sync your progress, your data is encrypted with a private passphrase *before* it leaves your machine. Your keys never touch our servers.
              </li>
              <li>
                <strong className="text-white">Switzerland Hostings:</strong> We physically host our secure cloud endpoints in Zürich, Switzerland, protected by the strictest personal privacy laws in the world.
              </li>
              <li>
                <strong className="text-white">European Dogfooding:</strong> We walk the talk. We host on compliant platforms, analyze with Estonian cookieless analytics, and partner only with European tech champions.
              </li>
            </ul>

            <h2 className="text-lg font-bold text-white pt-4">Support Digital Sovereignty</h2>
            <p>
              DigitalEU is entirely independent. We do not sell ads, harvest tracking cookies, or sell customer databases.
            </p>
            <p>
              You can support us either by signing up to our premium partners (like Proton and Tuta) using our integrated affiliate buttons inside the dashboard, or by purchasing a secure, one-time lifetime license key. Either way, you fund open-source development for digital liberty.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
