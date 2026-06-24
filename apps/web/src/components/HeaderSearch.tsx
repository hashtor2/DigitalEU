import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { SERVICES } from "@digitaleu/shared";

/**
 * HeaderSearch
 *
 * Search icon in header that opens a drawer with:
 * - Client-side search of services and alternatives
 * - Recent searches from localStorage
 * - Quick navigation links
 */

const RECENT_SEARCHES_KEY = "digitaleu_recent_searches";
const MAX_RECENT_SEARCHES = 5;

interface SearchResult {
  type: "service" | "link";
  id: string;
  name: string;
  url?: string;
  description?: string;
}

const QUICK_LINKS = [
  { name: "Directory", url: "/directory" },
  { name: "News", url: "/news" },
  { name: "Guides", url: "/guides" },
  { name: "About", url: "/about" },
];

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const serviceResults: SearchResult[] = SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.domain.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
    ).map((service) => ({
      type: "service" as const,
      id: service.id,
      name: service.name,
      description: service.breachSummary,
      url: `/directory?category=${service.category}`,
    }));

    const linkResults: SearchResult[] = QUICK_LINKS.filter(
      (link) => link.name.toLowerCase().includes(query)
    ).map((link) => ({
      type: "link" as const,
      id: link.url,
      name: link.name,
      url: link.url,
    }));

    setResults([...serviceResults, ...linkResults].slice(0, 8));
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "service") {
      addToRecentSearches(result.name);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const addToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      MAX_RECENT_SEARCHES
    );
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <>
      {/* Search button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-sm border border-border dark:border-dark-border hover:text-accent dark:hover:text-accent text-text-secondary dark:text-dark-text-secondary transition-colors duration-150"
        title="Search"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {/* Search drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed top-0 left-0 right-0 bottom-0 md:max-w-md md:right-auto z-50 flex flex-col bg-canvas dark:bg-dark-canvas border-b md:border-r border-border dark:border-dark-border animate-in fade-in slide-in-from-top md:slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 dark:border-dark-border/30 p-4">
              <h2 className="text-h4 font-semibold text-text-primary dark:text-dark-text-primary">
                Search
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-border/30 dark:hover:bg-dark-border/30 rounded-sm transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search input */}
            <div className="p-4 border-b border-border/30 dark:border-dark-border/30">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search services or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Results or recent searches */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery.length >= 2 && results.length > 0 ? (
                <div className="p-4 space-y-3">
                  <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                    Results ({results.length})
                  </p>
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.url || "/"}
                      onClick={() => handleResultClick(result)}
                      className="block p-3 rounded-sm hover:bg-border/30 dark:hover:bg-dark-border/30 transition-colors group"
                    >
                      <p className="font-medium text-text-primary dark:text-dark-text-primary group-hover:text-accent transition-colors">
                        {result.name}
                      </p>
                      {result.description && (
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center">
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    No results found
                  </p>
                </div>
              ) : (
                <>
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-4 border-b border-border/30 dark:border-dark-border/30">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                          Recent
                        </p>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-accent hover:text-accent-hover transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((query) => (
                          <button
                            key={query}
                            onClick={() => {
                              setSearchQuery(query);
                              addToRecentSearches(query);
                            }}
                            className="w-full text-left p-2 rounded-sm hover:bg-border/30 dark:hover:bg-dark-border/30 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick links */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-3">
                      Quick Links
                    </p>
                    <div className="space-y-2">
                      {QUICK_LINKS.map((link) => (
                        <Link
                          key={link.url}
                          to={link.url}
                          onClick={() => setIsOpen(false)}
                          className="block p-2 rounded-sm hover:bg-border/30 dark:hover:bg-dark-border/30 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
