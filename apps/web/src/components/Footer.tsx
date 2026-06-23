import { Link } from "react-router-dom";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  const euTechWebsites = [
    { name: "Proton", url: "https://proton.me", region: "🇨🇭 Switzerland" },
    { name: "Tuta", url: "https://tuta.com", region: "🇩🇪 Germany" },
    { name: "Mullvad", url: "https://mullvad.net", region: "🇸🇪 Sweden" },
    { name: "Jami (GNU Ring)", url: "https://jami.net", region: "🇨🇦 Open Source" },
    { name: "Briar", url: "https://briarproject.org", region: "🌍 Open Source" },
    { name: "Signal", url: "https://signal.org", region: "🌍 Open Source" },
  ];

  return (
    <footer className="mt-auto border-t border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas py-12 text-small text-text-secondary dark:text-dark-text-secondary">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main content */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand section */}
          <div className="space-y-4">
            <p className="font-mono text-h3 font-semibold text-text-primary dark:text-dark-text-primary">
              digitaleu.me
            </p>
            <p className="leading-relaxed text-text-secondary dark:text-dark-text-secondary">
              Helping Europeans reclaim their digital lives. Privacy-first, built in Norway, open by design.
            </p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
              🇪🇺 Data hosted in Switzerland (Zürich)
            </p>

            {/* Social Links */}
            <div className="space-y-2 pt-2">
              <a href="https://digitaleu.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>🌐</span>
                <span>Website</span>
              </a>
              <a href="mailto:info@digitaleu.me" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>✉️</span>
                <span>Email</span>
              </a>
              <a href="https://x.com/digitaleume" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>𝕏</span>
                <span>X</span>
              </a>
              <a href="https://www.reddit.com/user/DigitalEUme/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>🔴</span>
                <span>Reddit</span>
              </a>
              <a href="https://substack.com/@digitaleurope" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>📄</span>
                <span>Substack</span>
              </a>
              <a href="https://bsky.app/profile/digitaleu.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors text-sm">
                <span>🌌</span>
                <span>Bluesky</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-semibold text-text-primary dark:text-dark-text-primary text-xs uppercase tracking-wide">Product</p>
              <div className="space-y-2">
                <Link to="/" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Privacy Check</Link>
                <Link to="/emailscanner" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Email Scanner</Link>
                <Link to="/dashboard" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Dashboard</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-text-primary dark:text-dark-text-primary text-xs uppercase tracking-wide">Learn</p>
              <div className="space-y-2">
                <Link to="/directory" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Alternatives</Link>
                <Link to="/guides" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Guides</Link>
                <Link to="/about" className="block hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Manifesto</Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup showName={false} compact={true} />
          </div>
        </div>

        {/* EU Tech Resources */}
        <div className="mt-12 border-t border-border dark:border-dark-border pt-12">
          <p className="font-semibold text-text-primary dark:text-dark-text-primary text-sm mb-6">
            Recommended EU Tech
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {euTechWebsites.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-sm border border-border dark:border-dark-border hover:bg-border dark:hover:bg-dark-border hover:border-accent dark:hover:border-accent transition-colors"
              >
                <p className="font-medium text-text-primary dark:text-dark-text-primary group-hover:text-accent transition-colors">
                  {site.name}
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {site.region}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-2 border-t border-border dark:border-dark-border pt-6 sm:flex-row sm:items-center sm:justify-between text-xs">
          <p>© {new Date().getFullYear()} DigitalEU.me — All rights reserved.</p>
          <p>
            Some links are affiliate links that support our work.{" "}
            <Link to="/about" className="underline hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Learn more.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
