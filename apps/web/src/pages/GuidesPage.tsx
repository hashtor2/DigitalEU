import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { NewsArticleCard } from "@/components/NewsArticleCard";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  hasContent: boolean;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  source: "TechCrunch" | "Euractiv" | "Politico";
  scraped_at: string;
}

const GUIDES: Guide[] = [
  {
    id: "best-european-email",
    title: "Best European Email Providers in 2026",
    description: "Compare Proton Mail, Tuta, Mailbox.org, and Posteo. End-to-end encrypted, GDPR-compliant alternatives to Gmail — with a free tier comparison.",
    category: "email",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "best-european-vpn",
    title: "Best European VPN Services in 2026",
    description: "Compare Proton VPN, Mullvad, IVPN, and AzireVPN. No-logs, independently audited VPNs based in Switzerland and Sweden.",
    category: "vpn",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "best-european-cloud-storage",
    title: "Best European Cloud Storage in 2026",
    description: "Compare Proton Drive, pCloud, Tresorit, and Nextcloud. Zero-knowledge encrypted alternatives to Google Drive and Dropbox.",
    category: "cloud",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "best-european-calendar",
    title: "Best European Calendar Apps in 2026",
    description: "Compare Proton Calendar, Tuta Calendar, and Mailbox.org. Encrypted, GDPR-compliant alternatives to Google Calendar that keep your schedule private.",
    category: "calendar",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "degoogle-checklist",
    title: "The Step-by-Step 'De-Googling' Master Checklist",
    description: "A methodical, stress-free sequence to migrate your calendar, photos, files, and email away from Google Workspace into fully private Swiss-hosted alternatives.",
    category: "privacy",
    difficulty: "Medium",
    hasContent: true,
  },
  {
    id: "browser-wars",
    title: "Uncensored Web: Browser Privacy and Security Compared",
    description: "We audit Google Chrome, Brave, Mullvad Browser, Safari, and LibreWolf. Which browsers prevent fingerprinting and represent safe European choices?",
    category: "browser",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "password-manager-migration",
    title: "Dump LastPass: How to Safely Migrate to Proton Pass",
    description: "Following LastPass's security breaches, learn how to export your encrypted vault and import it into a Swiss-hosted, zero-knowledge password manager.",
    category: "password",
    difficulty: "Easy",
    hasContent: true,
  },
];

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-300 border-red-500/20",
};

export function GuidesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<"all" | "TechCrunch" | "Euractiv" | "Politico">("all");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/daily_news_articles?order=scraped_at.desc&limit=12`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "" } }
        );
        if (response.ok) setArticles(await response.json());
      } catch (err) {
        console.error("Failed to fetch news articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = selectedSource === "all"
    ? articles
    : articles.filter((a) => a.source === selectedSource);

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <title>Privacy & Migration Guides — European Alternatives | digitaleu.me</title>
      <meta name="description" content="Step-by-step guides for switching from Big Tech to privacy-friendly European alternatives. Email, VPN, cloud storage, browsers, and more." />
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Privacy & Migration Guides</h1>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary max-w-xl">
            Objective comparisons and step-by-step guides for switching from Big Tech to European alternatives.
          </p>
        </div>

        <div className="grid gap-4">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-5 hover:border-accent/30 hover:bg-surface dark:hover:bg-dark-surface transition"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary border border-border dark:border-dark-border rounded-sm px-2 py-0.5">
                    {guide.category}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${DIFFICULTY_STYLE[guide.difficulty]}`}>
                    {guide.difficulty}
                  </span>
                  {!guide.hasContent && (
                    <span className="text-[9px] text-text-secondary/50 font-mono">coming soon</span>
                  )}
                </div>
                <h2 className="text-[14px] font-semibold text-text-primary dark:text-dark-text-primary leading-snug mb-1">
                  {guide.title}
                </h2>
                <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">{guide.description}</p>
              </div>
              {guide.hasContent ? (
                <Link
                  to={`/guides/${guide.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-sm border border-accent/20 bg-accent/5 px-4 py-2 text-[12px] font-semibold text-accent/80 hover:text-accent hover:border-accent/40 transition"
                >
                  Read guide →
                </Link>
              ) : (
                <span className="flex-shrink-0 inline-flex items-center rounded-sm border border-border dark:border-dark-border px-4 py-2 text-[12px] text-text-secondary/50">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Daily EU Tech News Section */}
      <div className="bg-surface dark:bg-dark-surface border-t border-accent/20">
        <div className="mx-auto max-w-4xl w-full px-6 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">📰 Daily EU Tech News</h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Latest articles from TechCrunch EU, Euractiv, and Politico</p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["all", "TechCrunch", "Euractiv", "Politico"] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`whitespace-nowrap px-4 py-2 rounded-sm font-medium text-sm transition ${
                  selectedSource === source
                    ? "bg-accent text-white font-bold"
                    : "bg-border dark:bg-dark-border text-text-primary dark:text-dark-text-primary hover:bg-accent/20"
                }`}
              >
                {source === "all" ? "All Sources" : source}
              </button>
            ))}
          </div>

          {/* News grid */}
          {loading ? (
            <div className="text-center py-12 text-text-secondary dark:text-dark-text-secondary">Loading news articles...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-dark-text-secondary">
              No articles found. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <NewsArticleCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  url={article.url}
                  imageUrl={article.image_url}
                  source={article.source}
                  publishedAt={article.scraped_at}
                />
              ))}
            </div>
          )}

          {/* Newsletter signup */}
          <div className="mt-12 pt-8 border-t border-accent/20">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">Get weekly updates on EU tech news and privacy guides</p>
              <NewsletterSignup showName={false} compact={false} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
