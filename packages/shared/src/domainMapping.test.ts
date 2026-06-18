import { describe, it, expect } from "vitest";
import { DOMAIN_MAPPINGS, getMappingByDomain, getSettingsUrlForDomain } from "./domainMapping";

describe("domainMapping-database", () => {
  it("har populære tjenester definert", () => {
    expect(DOMAIN_MAPPINGS.length).toBeGreaterThan(10);
  });

  it("har unike id-er", () => {
    const ids = DOMAIN_MAPPINGS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("har unike primærdomener", () => {
    const domains = DOMAIN_MAPPINGS.map((m) => m.domain);
    expect(new Set(domains).size).toBe(domains.length);
  });

  it("getMappingByDomain finner tjenester basert på primærdomene", () => {
    const netflix = getMappingByDomain("netflix.com");
    expect(netflix).toBeDefined();
    expect(netflix?.serviceName).toBe("Netflix");
    expect(netflix?.category).toBe("entertainment");
  });

  it("getMappingByDomain finner tjenester uavhengig av store/små bokstaver", () => {
    const spotify = getMappingByDomain("Spotify.com");
    expect(spotify).toBeDefined();
    expect(spotify?.id).toBe("spotify");
  });

  it("getMappingByDomain finner tjenester basert på alternative avsenderdomener", () => {
    const gmailAlt = getMappingByDomain("accounts.google.com");
    expect(gmailAlt).toBeDefined();
    expect(gmailAlt?.id).toBe("gmail");

    const fbAlt = getMappingByDomain("facebookmail.com");
    expect(fbAlt).toBeDefined();
    expect(fbAlt?.id).toBe("facebook");
  });

  it("getSettingsUrlForDomain returnerer riktig url eller undefined", () => {
    const netflixUrl = getSettingsUrlForDomain("netflix.com");
    expect(netflixUrl).toBe("https://www.netflix.com/YourAccount");

    const unknownUrl = getSettingsUrlForDomain("nonexistentdomain.abc");
    expect(unknownUrl).toBeUndefined();
  });
});
