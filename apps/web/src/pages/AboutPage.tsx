import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

          <div className="text-slate-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-white/5">
            <p className="text-base text-white font-medium leading-relaxed">
              Every day, millions of Europeans wake up inside walled gardens. Our photos, bank logins, documents, and private emails reside on foreign advertising servers, subjected to algorithmic profiling and extraterritorial search laws. We are digitally occupied.
            </p>

            <h2 className="text-lg font-bold text-white pt-4">Our Core Philosophy</h2>
            <p>
              DigitalEU.me was founded to solve a singular, administrative bottleneck: <strong className="text-white">The friction of leaving.</strong>
            </p>
            <p>
              Most consumers <em>want</em> privacy. They understand that their data is a sovereign asset. But migrating years of accumulated digital history feels impossible. How do you find the 50 different websites registered with your old <code className="text-sky-400 text-xs bg-white/5 px-1 rounded">@gmail.com</code>? How do you map them, change them, and safely delete your Big Tech footprint?
            </p>
            <p>
              We build the bridges. We write the software that scans your mail headers safely in your own browser, directs you straight to settings pages, and autofills your details — all while remaining 100% zero-knowledge.
            </p>

            <h2 className="text-lg font-bold text-white pt-4">Our Ethical Pillars</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-white">100% Client-Side Privacy:</strong> We never log or upload your emails. The inbox scanner uses safe, read-only metadata and computes all service matches locally inside your browser sandbox.
              </li>
              <li>
                <strong className="text-white">Zero-Knowledge Cryptography:</strong> When you register for an account to sync your progress, your data is encrypted with a private passphrase <em>before</em> it leaves your machine. Your keys never touch our servers.
              </li>
              <li>
                <strong className="text-white">Switzerland Hosting:</strong> We physically host our secure cloud endpoints in Zürich, Switzerland, protected by the strictest personal privacy laws in the world.
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
              You can support us by signing up to our premium partners (like Proton and Tuta) using the affiliate buttons inside the dashboard, or by purchasing a secure one-time lifetime license. Either way, you fund open-source development for digital liberty.
            </p>

            {/* Contact section */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Contact & Support</h2>
              <p className="text-slate-400">
                Questions, partnership enquiries, or press requests — we read every email.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="mailto:info@digitaleu.me"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/20 px-4 py-2.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                >
                  ✉️ info@digitaleu.me
                </a>
                <span className="text-xs text-slate-500">We typically reply within 24 hours.</span>
              </div>
              <p className="text-xs text-slate-600">
                For vulnerability disclosures or security issues, please use the same address and mark the subject line <strong className="text-slate-500">SECURITY</strong>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
