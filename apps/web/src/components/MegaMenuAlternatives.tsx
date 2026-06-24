import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { ServiceCategory } from "@digitaleu/shared";

/**
 * MegaMenuAlternatives
 *
 * Desktop: Dropdown on hover over "Alternatives"
 * Mobile: Disclosure triangle with expand/collapse
 *
 * Shows all major EU alternative categories and popular services in each category.
 */

const MEGA_MENU_CATEGORIES: { id: string; label: string; category?: ServiceCategory }[] = [
  { id: "email", label: "Email", category: "email" },
  { id: "cloud", label: "Cloud Storage", category: "cloud-storage" },
  { id: "vpn", label: "VPN & Security", category: "vpn" },
  { id: "browser", label: "Web Browser", category: "browser" },
  { id: "search", label: "Search Engine", category: "search" },
  { id: "password", label: "Password Manager", category: "password-manager" },
  { id: "office", label: "Office & Docs", category: "office" },
  { id: "messaging", label: "Messaging", category: "messaging" },
  { id: "code", label: "Code Hosting", category: "code-hosting" },
  { id: "project", label: "Project Management", category: "project-management" },
  { id: "analytics", label: "Analytics", category: "analytics" },
  { id: "all", label: "All Alternatives" }, // This will link to /directory
];

interface MegaMenuAlternativesProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function MegaMenuAlternatives({
  isMobile = false,
  onLinkClick,
}: MegaMenuAlternativesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="md:hidden border-t border-border/30 dark:border-dark-border/30 py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-border/20 dark:hover:bg-dark-border/20 transition-colors"
        >
          <span className="font-semibold text-text-primary dark:text-dark-text-primary">
            Browse Categories
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="bg-canvas dark:bg-dark-canvas/50 px-6 py-3 space-y-2">
            {MEGA_MENU_CATEGORIES.map((item) => (
              <Link
                key={item.id}
                to={
                  item.label === "All Alternatives"
                    ? "/directory"
                    : `/directory?category=${item.category}`
                }
                onClick={() => {
                  setIsOpen(false);
                  onLinkClick?.();
                }}
                className="block py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop: Grid dropdown on hover
  return (
    <div className="hidden md:block absolute left-0 top-full pt-0 group">
      {/* Invisible bridge to keep dropdown open on hover */}
      <div className="absolute inset-x-0 -top-1 h-1" />

      {/* Dropdown panel - appears on parent hover */}
      <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-border/40 dark:bg-dark-border/40 border border-secondary-accent/40 dark:border-secondary-accent/40 rounded-sm shadow-lg backdrop-blur-sm">
        <div className="max-w-4xl grid grid-cols-3 gap-4 p-6">
          {MEGA_MENU_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              to={
                item.label === "All Alternatives"
                  ? "/directory"
                  : `/directory?category=${item.category}`
              }
              className="py-2 px-3 rounded-sm text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-accent hover:text-white dark:hover:bg-accent transition-all duration-150"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
