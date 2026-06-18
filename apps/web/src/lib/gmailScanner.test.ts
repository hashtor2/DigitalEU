import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractDomainFromFromHeader,
  getGoogleAuthUrl,
  extractAccessTokenFromUrl,
  scanGmailInbox,
  GOOGLE_CLIENT_ID,
} from "./gmailScanner";
import { DOMAIN_MAPPINGS } from "@digitaleu/shared";

describe("gmailScanner Utilities", () => {
  describe("extractDomainFromFromHeader", () => {
    it("ekstraherer domene fra standard From-header med visningsnavn", () => {
      const header = "Netflix <info@netflix.com>";
      const result = extractDomainFromFromHeader(header);
      expect(result).toBe("netflix.com");
    });

    it("ekstraherer domene fra From-header med vinkelparenteser", () => {
      const header = "<support@spotify.co.uk>";
      const result = extractDomainFromFromHeader(header);
      expect(result).toBe("spotify.co.uk");
    });

    it("ekstraherer domene fra ren e-postadresse", () => {
      const header = "hello@brevo.com";
      const result = extractDomainFromFromHeader(header);
      expect(result).toBe("brevo.com");
    });

    it("håndterer uleselige eller ugyldige headers ved å returnere null", () => {
      expect(extractDomainFromFromHeader("Ugyldig avsender")).toBeNull();
      expect(extractDomainFromFromHeader("")).toBeNull();
    });
  });

  describe("getGoogleAuthUrl", () => {
    it("genererer en gyldig Google OAuth URL med riktige parametre", () => {
      const urlString = getGoogleAuthUrl();
      const url = new URL(urlString);
      expect(url.origin).toBe("https://accounts.google.com");
      expect(url.pathname).toBe("/o/oauth2/v2/auth");
      expect(url.searchParams.get("response_type")).toBe("token");
      expect(url.searchParams.get("scope")).toContain("gmail.metadata");
      expect(url.searchParams.get("prompt")).toBe("consent");
    });
  });

  describe("extractAccessTokenFromUrl", () => {
    let originalHash: string;
    let replaceStateSpy: any;

    beforeEach(() => {
      originalHash = window.location.hash;
      replaceStateSpy = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    });

    afterEach(() => {
      window.location.hash = originalHash;
      vi.restoreAllMocks();
    });

    it("returnerer null hvis det ikke finnes hash", () => {
      window.location.hash = "";
      const token = extractAccessTokenFromUrl();
      expect(token).toBeNull();
    });

    it("ekstraherer access_token og fjerner hashen fra URL", () => {
      window.location.hash = "#access_token=ya29.testtoken&token_type=Bearer&expires_in=3600";
      const token = extractAccessTokenFromUrl();
      expect(token).toBe("ya29.testtoken");
      expect(replaceStateSpy).toHaveBeenCalled();
    });
  });

  describe("scanGmailInbox with Mock API", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("utfører full skanning, henter meldinger og matcher avsendere mot ordboken", async () => {
      const mockToken = "ya29.mock-token";

      // 1. Mock listerespons: Returner 2 meldinger
      const mockListResponse = {
        ok: true,
        json: async () => ({
          messages: [{ id: "msg1" }, { id: "msg2" }],
        }),
      };

      // 2. Mock detaljresponser for msg1 (Netflix) og msg2 (Dropbox)
      const mockDetail1Response = {
        ok: true,
        json: async () => ({
          payload: {
            headers: [{ name: "From", value: "Netflix <billing@netflix.com>" }],
          },
        }),
      };

      const mockDetail2Response = {
        ok: true,
        json: async () => ({
          payload: {
            headers: [{ name: "From", value: "Dropbox <no-reply@dropbox.com>" }],
          },
        }),
      };

      // Konfigurer fetch mock
      vi.mocked(fetch).mockImplementation((url: any) => {
        if (typeof url === "string") {
          if (url.includes("messages?maxResults")) {
            return Promise.resolve(mockListResponse as any);
          }
          if (url.includes("messages/msg1")) {
            return Promise.resolve(mockDetail1Response as any);
          }
          if (url.includes("messages/msg2")) {
            return Promise.resolve(mockDetail2Response as any);
          }
        }
        return Promise.reject(new Error("Unknown URL called in fetch mock"));
      });

      const onProgressSpy = vi.fn();
      const accounts = await scanGmailInbox(mockToken, onProgressSpy);

      // Sjekk at vi fikk riktig antall og innhold i detectedAccounts
      expect(accounts).toHaveLength(2);
      expect(accounts.map((a) => a.id)).toContain("netflix");
      expect(accounts.map((a) => a.id)).toContain("dropbox");

      // Verifiser progress callbacks
      expect(onProgressSpy).toHaveBeenCalledWith(10, expect.any(String));
      expect(onProgressSpy).toHaveBeenCalledWith(100, expect.any(String));
    });
  });
});
