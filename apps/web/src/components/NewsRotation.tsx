import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  link: string;
}

interface NewsRotationProps {
  articles: NewsArticle[];
}

export function NewsRotation({ articles }: NewsRotationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (articles.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  if (articles.length === 0) {
    return null;
  }

  const current = articles[currentIndex];

  return (
    <div className="mb-6 p-4 bg-secondary-accent/10 dark:bg-secondary-accent/15 border border-secondary-accent/30 dark:border-secondary-accent/40 rounded-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-secondary-accent mb-1 font-semibold tracking-wide">
            {new Date(current.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:text-secondary-accent dark:hover:text-secondary-accent transition-colors line-clamp-2"
          >
            {current.title}
          </a>
        </div>
        <div className="flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-secondary-accent" />
        </div>
      </div>

      {/* Progress indicator dots */}
      <div className="flex gap-1.5 mt-3">
        {articles.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-secondary-accent w-4'
                : 'bg-secondary-accent/40 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
