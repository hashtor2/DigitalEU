interface NewsArticleProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: "TechCrunch" | "Euractiv" | "Politico";
  publishedAt: string;
}

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  TechCrunch: { bg: "bg-blue-500/20", text: "text-blue-300" },
  Euractiv: { bg: "bg-amber-500/20", text: "text-amber-300" },
  Politico: { bg: "bg-purple-500/20", text: "text-purple-300" },
};

export function NewsArticleCard({
  title,
  description,
  url,
  imageUrl,
  source,
  publishedAt,
}: NewsArticleProps) {
  const colors = SOURCE_COLORS[source] || SOURCE_COLORS.TechCrunch;
  const publishDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-[#2d4a6e] bg-[#1e293b] overflow-hidden hover:border-[#3d5a7e] transition"
    >
      {/* Image */}
      {imageUrl && (
        <div className="aspect-video overflow-hidden bg-[#0f2040]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Source badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}
          >
            {source}
          </span>
          <span className="text-xs text-slate-500">{publishDate}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-slate-100 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Read more indicator */}
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition">
          Read article
          <svg
            className="w-3 h-3 group-hover:translate-x-1 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
