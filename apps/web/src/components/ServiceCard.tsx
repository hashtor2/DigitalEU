import { type Alternative } from "@digitaleu/shared";

interface ServiceCardProps {
  service: Alternative;
  logoUrl?: string;
  onClick?: () => void;
}

export function ServiceCard({ service, logoUrl, onClick }: ServiceCardProps) {
  const countryCode = service.country.toLowerCase();

  return (
    <div
      onClick={onClick}
      className="rounded-sm border border-border dark:border-dark-border bg-background dark:bg-dark-canvas p-4 hover:border-accent dark:hover:border-accent hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* Logo + Flag */}
      <div className="flex items-start justify-between mb-3">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${service.name} logo`}
            className="h-8 w-8 object-contain"
          />
        )}
        {!logoUrl && (
          <div className="h-8 w-8 rounded-sm bg-border dark:bg-dark-border" />
        )}

        {/* Country flag */}
        <span
          className={`fi fi-${countryCode} h-6 w-6 rounded-sm inline-block`}
          title={service.country}
          aria-label={`Service from ${service.country}`}
        />
      </div>

      {/* Content */}
      <h3 className="font-mono font-semibold text-text-primary dark:text-dark-text-primary mb-2 group-hover:text-accent transition-colors">
        {service.name}
      </h3>

      <p className="text-small text-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-2">
        {service.description}
      </p>

      {/* Replaces */}
      {service.replaces && service.replaces.length > 0 && (
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
          <span className="font-medium">Replaces:</span> {service.replaces.join(", ")}
        </p>
      )}
    </div>
  );
}
