import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface DigestStory {
  title: string;
  link: string;
  source: string;
  summary: string;
}

interface NewsDigest {
  digest_date: string;
  digest_text: string;
  stories: DigestStory[];
  created_at: string;
}

interface Journalist {
  name: string;
  role: string;
  location: string;
  avatar: string;
  bio: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "interview" | "innovation" | "regulation" | "investigation";
  author: string;
  date: string;
  readTime: string;
}

const JOURNALISTS: Journalist[] = [
  { name: "Helena Vance", role: "EU Regulatory Analyst", location: "Brussels, Belgium 🇧🇪", avatar: "👩‍⚖️", bio: "Ex-legal counsel for European digital rights. Helena monitors Brussels policy shifts, GDPR compliance audits, and the impact of the Digital Markets Act (DMA) on consumer choice." },
  { name: "Marc Dubois", role: "Sovereign Cloud Architect", location: "Paris, France 🇫🇷", avatar: "👨‍💻", bio: "Systems architect specializing in decentralized networks. Marc reviews EU-hosted data centers, server encryption, open-source hosting stacks, and sovereign infrastructure." },
  { name: "Astrid Lindqvist", role: "Privacy Investigator", location: "Stockholm, Sweden 🇸🇪", avatar: "🕵️‍♀️", bio: "Investigative journalist uncovering corporate tracking matrices. Astrid audits third-party data-brokers, consumer data leaks, and mobile app surveillance behaviors." },
  { name: "Lukas Weber", role: "Startup Spotlight & Reviews", location: "Berlin, Germany 🇩🇪", avatar: "🎙️", bio: "Tech journalist and startup advocate. Lukas focuses on interviewing European privacy founders and writing unbiased, exhaustive comparative reviews of sovereign consumer tools." },
  { name: "Johan Nordström", role: "Senior Technology Correspondent", location: "Helsinki, Finland 🇫🇮", avatar: "🏆", bio: "Award-winning technology journalist with 30 years of experience covering European innovation. Johan specializes in analyzing the intersection of technology, privacy, and sovereignty, bringing deep historical context to contemporary developments in the European tech landscape." },
];

const NEWS_ARTICLES: Article[] = [
  { id: "data-industrial-complex", title: "The Data Industrial Complex: How America's Tech Giants Built Surveillance Empires at Europe's Expense", excerpt: "A 15-month investigation reveals how Facebook, Google, Microsoft and their peers systematically harvest, inadequately protect, and monetize European user data—while promoting privacy-hostile alternatives that deepen dependency on US surveillance capitalism.", category: "investigation", author: "Johan Nordström", date: "June 19, 2026", readTime: "14 min read" },
  { id: "eu-ai-act-impact", title: "How the EU AI Act is Shaping a New Era of Ethical Artificial Intelligence", excerpt: "As the world's first comprehensive AI regulation takes effect, European startups are pioneering privacy-preserving, transparent AI systems that could become the global benchmark for ethical technology development.", category: "regulation", author: "Johan Nordström", date: "June 18, 2026", readTime: "7 min read" },
  { id: "andy-yen-interview", title: "Sovereignty at Scale: An Interview with Andy Yen, CEO of Proton", excerpt: "Lukas Weber sits down with the founder of Proton Mail in Geneva to discuss Swiss privacy laws, competing with Google's search and advertising monopoly, and why client-side encryption is a human right.", category: "interview", author: "Lukas Weber", date: "June 15, 2026", readTime: "8 min read" },
  { id: "dma-opening-big-tech", title: "How the Digital Markets Act (DMA) is Breaking Big Tech's Stranglehold", excerpt: "The European Union's sweeping anti-monopoly regulations are forcing Apple and Google to allow alternative app stores and browser engines. We outline what this means for European tech startups.", category: "regulation", author: "Helena Vance", date: "May 28, 2026", readTime: "5 min read" },
  { id: "sovereign-cloud-scaling", title: "Sovereign Cloud Hosting: The German and French Infrastructure Shield", excerpt: "Why companies like Scaleway, Hetzner, and Scaleway are growing exponentially. We evaluate the true risk of the US CLOUD Act on European business intelligence and corporate data security.", category: "innovation", author: "Marc Dubois", date: "May 10, 2026", readTime: "6 min read" },
  { id: "data-leak-surveillance", title: "The Silent Auction: Inside the Consumer Data-Brokering Matrix", excerpt: "An investigative audit of how secondary mobile apps silently bundle location trackers and telemetry tools, selling your physical movements to advertising networks without explicit GDPR consent.", category: "investigation", author: "Astrid Lindqvist", date: "April 29, 2026", readTime: "7 min read" },
  { id: "tuta-cryptographic-email", title: "German-Engineered Privacy: Tuta Mail's Journey to Post-Quantum Encryption", excerpt: "Tuta is deploying quantum-resistant end-to-end encryption across all contacts and calendars. A deep-dive review of Hannover's premier green-energy mail provider.", category: "innovation", author: "Lukas Weber", date: "April 22, 2026", readTime: "4 min read" },
];

const CATEGORY_STYLES: Record<string, string> = {
  interview: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  innovation: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  regulation: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  investigation: "bg-red-500/10 text-red-300 border-red-500/20",
};

function DailyDigest() {
  const [digest, setDigest] = useState<NewsDigest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("news_digests")
      .select("digest_date, digest_text, stories, created_at")
      .order("digest_date", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        setDigest(data as NewsDigest | null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6 animate-pulse h-40" />;
  }

  if (!digest) return null;

  const dateLabel = new Date(digest.digest_date).toLocaleDateString("en-EU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const stories = (digest.stories ?? []) as DigestStory[];

  return (
    <section className="rounded-sm border border-accent/20 bg-accent/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          🤖 AI Daily Digest
        </span>
        <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{dateLabel}</span>
      </div>

      <div className="space-y-3">
        {stories.slice(0, 5).map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group hover:bg-accent/5 rounded-sm p-2 -mx-2 transition"
          >
            <span className="text-accent font-bold text-sm shrink-0 pt-0.5">📌</span>
            <div>
              <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary group-hover:text-accent transition leading-snug">
                {s.title}
              </p>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">{s.source}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary pt-2 border-t border-border dark:border-dark-border">
        🤖 Curated daily by Claude AI + digitaleu.me
      </p>
    </section>
  );
}

function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        setMessage({ type: "error", text: "Service unavailable. Please try again later." });
        setLoading(false);
        return;
      }
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, name: name || null, status: "active" }]);

      if (error) {
        if (error.message.includes("duplicate")) {
          setMessage({ type: "error", text: "This email is already subscribed" });
        } else {
          setMessage({ type: "error", text: "Failed to subscribe. Please try again." });
        }
      } else {
        setMessage({ type: "success", text: "✓ Subscribed! Check your email for confirmation." });
        setEmail("");
        setName("");
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">📬 Stay Updated</h2>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Get daily EU tech news delivered to your inbox or Telegram</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="https://t.me/eurotechnewsbot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-sm border border-accent/30 bg-accent/10 px-4 py-3 font-semibold text-accent hover:bg-accent/20 hover:border-accent/50 transition"
        >
          <span>💬 Subscribe to Telegram Bot</span>
        </a>

        <form onSubmit={handleEmailSignup} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas px-3 py-2 text-xs text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary focus:border-accent focus:outline-none transition disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm border border-accent/30 bg-accent/10 px-4 py-2 font-semibold text-accent hover:bg-accent/20 hover:border-accent/50 transition disabled:opacity-50"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas px-3 py-2 text-xs text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary focus:border-accent focus:outline-none transition disabled:opacity-50"
          />
          {message && (
            <p className={`text-xs font-semibold ${message.type === "success" ? "text-success" : "text-error"}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>

      <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary border-t border-border dark:border-dark-border pt-4">
        We respect your privacy. Unsubscribe anytime. Learn more in our <a href="#" className="text-accent hover:underline">privacy policy</a>.
      </p>
    </section>
  );
}

export function NewsPage() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-10 space-y-16">

        {/* News Jumbotron Hero */}
        <section className="border-b border-border dark:border-dark-border pb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-accent/20 bg-accent/5 px-3.5 py-1 text-xs font-semibold text-accent mb-3">
            📰 Media & Tech Journalism Portal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary dark:text-dark-text-primary leading-tight sm:text-5xl">
            EU Tech News & Insights
          </h1>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2 max-w-xl leading-relaxed">
            The voice of European digital self-determination. We report on local technology developments, regulatory shifts, and host interviews with top founders, tech pioneers, and privacy politicians.
          </p>
        </section>

        {/* Live AI-generated daily digest */}
        <DailyDigest />

        {/* Subscribe */}
        <Subscribe />

        {/* Featured Story */}
        <section className="relative overflow-hidden rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-red-500/15 text-red-300 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
              Investigative Report 🔍
            </span>
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight leading-snug sm:text-3xl">
              The Data Industrial Complex: How Tech Giants Built Surveillance Empires
            </h2>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              A 15-month investigation reveals how Facebook, Google, Microsoft and their peers systematically harvest, inadequately protect, and monetize European user data—while promoting privacy-hostile alternatives that deepen dependency on US surveillance capitalism.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-text-secondary dark:text-dark-text-secondary pt-2 font-medium">
              <span className="flex items-center gap-1">🏆 Johan Nordström</span>
              <span>•</span>
              <span>June 19, 2026</span>
              <span>•</span>
              <span className="text-accent">14 min read</span>
            </div>
            <button
              onClick={() => alert("Read the full investigation now!")}
              className="bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-bold text-xs px-4 py-2.5 rounded-sm transition"
            >
              Read Full Investigation
            </button>
          </div>
        </section>

        {/* Dynamic Article Feed Grid */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent">
            Latest Columns
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {NEWS_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-3 rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5 hover:border-accent/30 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${CATEGORY_STYLES[article.category] || "text-text-secondary border-border"}`}>
                    {article.category}
                  </span>
                  <span className="text-[10px] text-text-secondary dark:text-dark-text-secondary font-medium">{article.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary dark:text-dark-text-primary leading-snug tracking-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-3 border-t border-border dark:border-dark-border flex items-center justify-between text-[10px] text-text-secondary dark:text-dark-text-secondary font-semibold">
                  <span>Author: {article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the AI Journalists Section */}
        <section className="border-t border-border dark:border-dark-border pt-12 space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent">
              The Editorial Team
            </h2>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-lg">
              Meet our team of digital sovereignty writers. These individual profiles act as dedicated agents, auditing, investigating, and reporting on your digital rights.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {JOURNALISTS.map((j) => (
              <div
                key={j.name}
                className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-5 flex gap-4 items-start hover:border-accent/30 transition"
              >
                <div className="w-12 h-12 rounded-sm bg-surface dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center text-2xl shadow-sm shrink-0">
                  {j.avatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-text-primary dark:text-dark-text-primary">{j.name}</h3>
                    <span className="text-[10px] text-text-secondary dark:text-dark-text-secondary font-medium">{j.location}</span>
                  </div>
                  <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">{j.role}</p>
                  <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary leading-relaxed pt-1">{j.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
