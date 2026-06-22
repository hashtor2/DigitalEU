import React from "react";
import { type Alternative } from "@digitaleu/shared";
import { ServiceCard } from "./ServiceCard";

interface ServiceGridProps {
  services: Alternative[];
  onServiceClick?: (service: Alternative) => void;
  logoMap?: Record<string, string>; // id -> logoUrl
  columns?: number;
}

export function ServiceGrid({
  services,
  onServiceClick,
  logoMap = {},
  columns = 3,
}: ServiceGridProps) {
  if (!services.length) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary dark:text-dark-text-secondary">
          No services found.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          logoUrl={logoMap[service.id]}
          onClick={() => onServiceClick?.(service)}
        />
      ))}
    </div>
  );
}
