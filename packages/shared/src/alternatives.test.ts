import { describe, it, expect } from "vitest";
import { ALTERNATIVES } from "./alternatives";

describe("ALTERNATIVES-katalog", () => {
  it("har minst ett alternativ", () => {
    expect(ALTERNATIVES.length).toBeGreaterThan(0);
  });

  it("har unike id-er", () => {
    const ids = ALTERNATIVES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("har påkrevde felter for hvert alternativ", () => {
    for (const alt of ALTERNATIVES) {
      expect(alt.name).toBeTruthy();
      expect(alt.country).toMatch(/^[A-Z]{2}$/);
      expect(alt.url).toMatch(/^https:\/\//);
      expect(alt.replaces.length).toBeGreaterThan(0);
    }
  });

  it("har affiliateUrl når monetization er affiliate", () => {
    for (const alt of ALTERNATIVES.filter((a) => a.monetization === "affiliate")) {
      expect(alt.affiliateUrl, `${alt.id} mangler affiliateUrl`).toBeTruthy();
    }
  });
});
