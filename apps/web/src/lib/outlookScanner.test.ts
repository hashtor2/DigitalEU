import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getMicrosoftAuthUrl,
  extractOutlookAccessTokenFromUrl,
  scanOutlookInbox,
} from "./outlookScanner";

describe("outlookScanner Utilities", () => {
  describe("getMicrosoftAuthUrl", () => {
    it("genererer en gyldig Microsoft OAuth URL med riktige parametre", () => {
      const urlString = getMicrosoftAuthUrl();
      const url = new URL(urlString);
      expect(url.origin).toBe("https://login.microsoftonline.com");
      expect(url.pathname).toBe("/common/oauth2/v2.0/authorize");
      expect(url.searchParams.get("response_type")).toBe("token");
      expect(url.searchParams.get("scope")).toContain("Mail.ReadBasic");
      expect(url.searchParams.get("prompt")).toBe("select_account");
    });
  });

  describe("extractOutlookAccessTokenFromUrl", () => {
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
      const token = extractOutlookAccessTokenFromUrl();
      expect(token).toBeNull();
    });

    it("ekstraherer access_token og fjerner hashen fra URL", () => {
      window.location.hash = "#access_token=ey.outlooktoken&token_type=Bearer&expires_in=3600";
      const token = extractOutlookAccessTokenFromUrl();
      expect(token).toBe("ey.outlooktoken");
      expect(replaceStateSpy).toHaveBeenCalled();
    });
  });

  describe("scanOutlookInbox with Mock MS Graph API", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("henter meldinger i ett enkelt API-kall og matcher dem mot ordboken", async () => {
      const mockToken = "ey.mock-token";

      // Mock MS Graph respons med Netflix og LastPass avsendere
      const mockGraphResponse = {
        ok: true,
        json: async () => ({
          value: [
            {
              from: {
                emailAddress: {
                  name: "Netflix",
                  address: "info@netflix.com",
                },
              },
            },
            {
              from: {
                emailAddress: {
                  name: "LastPass",
                  address: "no-reply@lastpass.com",
                },
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValue(mockGraphResponse as any);

      const onProgressSpy = vi.fn();
      const accounts = await scanOutlookInbox(mockToken, onProgressSpy);

      expect(accounts).toHaveLength(2);
      expect(accounts.map((a) => a.id)).toContain("netflix");
      expect(accounts.map((a) => a.id)).toContain("lastpass");

      expect(onProgressSpy).toHaveBeenCalledWith(15, expect.any(String));
      expect(onProgressSpy).toHaveBeenCalledWith(100, expect.any(String));
    });
  });
});
