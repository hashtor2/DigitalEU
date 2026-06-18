import { describe, it, expect } from "vitest";
import { encryptJSON, decryptJSON, DecryptionError } from "./crypto";

describe("zero-knowledge crypto", () => {
  const passphrase = "korrekt-hest-batteri-stift";
  const data = { accounts: ["netflix.com", "spotify.com"], step: 3 };

  it("krypterer og dekrypterer tilbake til samme data (round-trip)", async () => {
    const envelope = await encryptJSON(data, passphrase);
    const out = await decryptJSON<typeof data>(envelope, passphrase);
    expect(out).toEqual(data);
  });

  it("produserer ikke klartekst i envelopen", async () => {
    const envelope = await encryptJSON(data, passphrase);
    expect(envelope).not.toContain("netflix");
  });

  it("gir ulik chiffertekst hver gang (tilfeldig salt/iv)", async () => {
    const a = await encryptJSON(data, passphrase);
    const b = await encryptJSON(data, passphrase);
    expect(a).not.toBe(b);
  });

  it("feiler med DecryptionError ved feil passphrase", async () => {
    const envelope = await encryptJSON(data, passphrase);
    await expect(decryptJSON(envelope, "feil-passphrase")).rejects.toBeInstanceOf(
      DecryptionError,
    );
  });

  it("feiler ved tuklet chiffertekst", async () => {
    const envelope = await encryptJSON(data, passphrase);
    const tampered = envelope.slice(0, -4) + "AAAA";
    await expect(decryptJSON(tampered, passphrase)).rejects.toBeInstanceOf(
      DecryptionError,
    );
  });
});
