import React from "react";
import { X } from "lucide-react";

interface ServiceBadgeProps {
  name: string;
  country: string;
  onRemove?: () => void;
  logoUrl?: string;
}

export function ServiceBadge({
  name,
  country,
  onRemove,
  logoUrl,
}: ServiceBadgeProps) {
  const countryCode = country.toLowerCase();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-sm border border-accent bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary">
      {/* Logo */}
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-4 w-4 object-contain"
        />
      )}

      {/* Name + Flag */}
      <span className="flex items-center gap-1.5">
        <span className="text-small font-medium">{name}</span>
        <span
          className={`fi fi-${countryCode} h-4 w-4 inline-block`}
          title={country}
        />
      </span>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded hover:bg-border dark:hover:bg-dark-border transition-colors"
          title={`Remove ${name}`}
          aria-label={`Remove ${name}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
