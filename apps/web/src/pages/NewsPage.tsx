import { Header } from "@/components/Header";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "interview" | "innovation" | "regulation" | "guides";
  author: string;
  date: string;
  readTime: string;
}

const NEWS_ARTICLES: Article[] = [
  {
    id: "andy-yen-interview",
    title: "Sovereignty at Scale: An Interview with Andy Yen, CEO of Proton",
    excerpt: "We sit down with the founder of Proton Mail in Geneva to discuss Swiss privacy laws, competing with Google's search and advertising monopoly, and why client-side encryption is a human right.",
    category: "interview",
    author: "Digital Europe Editorial",
    date: "June 15, 2026",
    readTime: "8 min read",
  },
  {
    id: "dma-opening-big-tech",
    title: "How the Digital Markets Act (DMA) is Breaking Big Tech's Stranglehold",
    excerpt: "The European Union's sweeping anti-monopoly regulations are forcing Apple and Google to allow alternative app stores and browser engines. We outline what this means for European tech startups.",
    category: "regulation",
    author: "Helena Vance, EU Analyst",
    date: "May 28, 2026",
    readTime: "5 min read",
  },
  {
    id: "sovereign-cloud-scaling",
    title: "Sovereign Cloud Hosting: The German and French Infrastructure Shield",
    excerpt: "Why companies like Scaleway, Hetzner, and Scaleway are growing exponentially. We evaluate the true risk of the US CLOUD Act on European business intelligence and corporate data security.",
    category: "innovation",
    author: "Marc Dubois, Tech Architect",
    date: "May 10, 2026",
    readTime: "6 min read",
  },
  {
    id: "tuta-cryptographic-email",
    title: "German-Engineered Privacy: Tuta Mail's Journey to Post-Quantum Encryption",
    excerpt: "Tuta is deploying quantum-resistant end-to-end encryption across all contacts and calendars. A deep-dive review of Hannover's premier green-energy mail provider.",
    category: "innovation",
    author: "Digital Europe Editorial",
    date: "April 22, 2026",
    readTime: "4 min read",
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  interview: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  innovation: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  regulation: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  guides: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

export function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <div className="border-b border-white/5 pb-6 mb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-3.5 py-1 text-xs font-semibold text-sky-400 mb-3">
            📰 Media & Tech Journalism Portal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            EU Tech News & Innovation
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            The voice of European digital self-determination. We report on local technology developments, regulatory shifts, and host interviews with top founders, tech pioneers, and privacy politicians.
          </p>
        </div>

        {/* Featured Interview Jumbotron */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-sky-950/20 via-slate-900/50 to-transparent p-6 sm:p-8 mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Featured Interview 🎙️
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug sm:text-3xl">
              "We must own our digital borders." An Hour with Andy Yen of Proton Mail.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Geneva, Switzerland — Andy Yen outlines why relying on US ad-monopolies is a critical security vulnerability for European democracy, how Proton has grown to 100M+ users completely organically, and their roadmap for secure local files, identity vaults, and post-quantum encryptions.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 font-medium">
              <span>By Digital Europe Editorial</span>
              <span>•</span>
              <span>June 15, 2026</span>
              <span>•</span>
              <span className="text-sky-400">8 min read</span>
            </div>
            <button
              onClick={() => alert("This full premium interview is scheduled to deploy in Phase 2!")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
            >
              Read Full Interview
            </button>
          </div>
        </div>

        {/* Grid List of Other Articles */}
        <div className="grid gap-6 sm:grid-cols-2">
          {NEWS_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/30 p-5 hover:border-white/15 hover:bg-slate-900/50 transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                    CATEGORY_STYLES[article.category] || "text-slate-400 border-white/10"
                  }`}
                >
                  {article.category}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{article.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug tracking-tight">
                {article.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>By {article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
