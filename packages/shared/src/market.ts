import type { Alternative, MarketSegment, ServiceCategory } from "./types";

const CATEGORY_MARKET: Record<ServiceCategory, MarketSegment[]> = {
  email:              ['b2b', 'b2c'],
  "cloud-storage":    ['b2b', 'b2c'],
  messaging:          ['b2b', 'b2c'],
  office:             ['b2b', 'b2c'],
  "password-manager": ['b2b', 'b2c'],
  ai:                 ['b2b', 'b2c'],
  vpn:                ['b2c'],
  browser:            ['b2c'],
  search:             ['b2c'],
  hardware:           ['b2c'],
  social:             ['b2c'],
  transport:          ['b2c'],
  security:           ['b2c'],
  "cloud-infra":      ['b2b'],
  "code-hosting":     ['b2b'],
  analytics:          ['b2b'],
  "project-management": ['b2b'],
  fintech:            ['b2b'],
};

export function getMarket(alt: Alternative): MarketSegment[] {
  return alt.market ?? CATEGORY_MARKET[alt.category] ?? ['b2b', 'b2c'];
}

export function isB2B(alt: Alternative): boolean {
  return getMarket(alt).includes('b2b');
}

export function isB2C(alt: Alternative): boolean {
  return getMarket(alt).includes('b2c');
}
