import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-12 md:py-16">
        <article className="space-y-6">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
              🇪🇺 The Sovereignty Manifesto
            </span>
            <h1 className="text-h1 font-mono tracking-tight text-text-primary dark:text-dark-text-primary leading-tight">
              Who owns your data, and who sees them?
            </h1>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-mono">Published June 18, 2026</p>
          </div>

          <div className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed space-y-4 pt-4 border-t border-border dark:border-dark-border">
            <p className="text-base text-text-primary dark:text-dark-text-primary font-medium leading-relaxed">
              Every day, millions of Europeans wake up inside walled gardens. Our photos, bank logins, documents, and private emails reside on foreign advertising servers, subjected to algorithmic profiling and extraterritorial search laws. We are digitally occupied.
            </p>

            <h2 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary pt-4">Our Core Philosophy</h2>
            <p>
              DigitalEU.me was founded to solve a singular, administrative bottleneck: <strong className="text-text-primary dark:text-dark-text-primary">The friction of leaving.</strong>
            </p>
            <p>
              Most consumers <em>want</em> privacy. They understand that their data is a sovereign asset. But migrating years of accumulated digital history feels impossible. How do you find the 50 different websites registered with your old <code className="text-accent text-xs bg-accent/10 px-1 rounded-sm">@gmail.com</code>? How do you map them, change them, and safely delete your Big Tech footprint?
            </p>
            <p>
              We build the bridges. We write the software that scans your mail headers safely in your own browser, directs you straight to settings pages, and autofills your details — all while remaining 100% zero-knowledge.
            </p>

            <h2 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary pt-4">Our Ethical Pillars</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-text-primary dark:text-dark-text-primary">100% Client-Side Privacy:</strong> We never log or upload your emails. The inbox scanner uses safe, read-only metadata and computes all service matches locally inside your browser sandbox.
              </li>
              <li>
                <strong className="text-text-primary dark:text-dark-text-primary">Zero-Knowledge Cryptography:</strong> When you register for an account to sync your progress, your data is encrypted with a private passphrase <em>before</em> it leaves your machine. Your keys never touch our servers.
              </li>
              <li>
                <strong className="text-text-primary dark:text-dark-text-primary">Sweden Hosting:</strong> We physically host our secure cloud endpoints in Stockholm, Sweden, protected by some of the strictest personal privacy laws in Europe.
              </li>
              <li>
                <strong className="text-text-primary dark:text-dark-text-primary">European Dogfooding:</strong> We walk the talk. We host on compliant platforms, analyze with Estonian cookieless analytics, and partner only with European tech champions.
              </li>
            </ul>

            <h2 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary pt-4">Support Digital Sovereignty</h2>
            <p>
              DigitalEU is entirely independent. We do not sell ads, harvest tracking cookies, or sell customer databases.
            </p>
            <p>
              You can support us by signing up to our premium partners (like Proton and Tuta) using the affiliate buttons inside the dashboard, or by purchasing a secure one-time lifetime license. Either way, you fund open-source development for digital liberty.
            </p>

            {/* Contact section */}
            <div className="mt-8 rounded-sm border border-border dark:border-dark-border bg-accent/5 p-6 space-y-4">
              <h2 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary">Contact &amp; Support</h2>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Questions, partnership enquiries, or press requests — we read every email.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="mailto:info@digitaleu.me"
                  className="inline-flex items-center gap-2 rounded-sm bg-accent/10 border border-accent/20 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
                >
                  ✉️ info@digitaleu.me
                </a>
                <span className="text-xs text-text-secondary dark:text-dark-text-secondary">We typically reply within 24 hours.</span>
              </div>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                For vulnerability disclosures or security issues, please use the same address and mark the subject line <strong className="text-text-primary dark:text-dark-text-primary">SECURITY</strong>.
              </p>
            </div>

            {/* For business section */}
            <div className="mt-6 rounded-sm border border-accent/30 bg-accent/5 p-6 space-y-4">
              <h2 className="text-h3 font-mono text-text-primary dark:text-dark-text-primary">For business</h2>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Helping your organisation reduce US cloud dependency, meet GDPR obligations, and build on sovereign European infrastructure.
              </p>
              <Link
                to="/b2b"
                className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                See our business offering →
              </Link>
            </div>
          </div>
        </article>

        {/* Newsletter CTA */}
        <section className="mt-16 border-t border-border dark:border-dark-border pt-12 space-y-6 text-center">
          <div>
            <h2 className="text-h2 font-mono text-text-primary dark:text-dark-text-primary mb-2">Join the sovereign digital movement</h2>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm max-w-2xl mx-auto">Get our latest investigations, interviews with European tech founders, and updates on digital sovereignty regulations.</p>
          </div>
          <NewsletterSignup compact={true} showName={false} />
        </section>
    </div>
  );
}
