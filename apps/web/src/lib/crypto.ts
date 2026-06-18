/**
 * Zero-knowledge klientside-kryptering for Profilmodus.
 *
 * All brukerdata krypteres HER, i nettleseren, før den sendes til Supabase.
 * Nøkkelen utledes fra en brukerhemmelighet (passphrase) og forlater aldri
 * klienten. Konsekvens: mister brukeren passphrasen, finnes ingen baksdør —
 * dette skal kommuniseres tydelig i UI-et (jf. docs/SECURITY.md §4).
 *
 * Designvalg:
 * - AES-GCM 256-bit (autentisert kryptering — oppdager tukling).
 * - PBKDF2-SHA256 nøkkelutledning. Iterasjonstall følger OWASP-anbefaling.
 *   (Argon2id er sterkere, men finnes ikke i Web Crypto; vurderes via WASM
 *   senere — se docs/SECURITY.md.)
 * - Hver kryptering bruker tilfeldig salt + IV. Alt pakkes i én base64-streng
 *   ("envelope") slik at vi trygt kan lagre én verdi.
 */

const KDF_ITERATIONS = 600_000; // OWASP-anbefaling for PBKDF2-HMAC-SHA256
const SALT_BYTES = 16;
const IV_BYTES = 12; // anbefalt lengde for AES-GCM
const ENVELOPE_VERSION = 1;

/** Kastes når dekryptering feiler (feil passphrase eller tuklet data). */
export class DecryptionError extends Error {
  constructor() {
    super("Dekryptering feilet: feil passphrase eller korrupte data.");
    this.name = "DecryptionError";
  }
}

function getSubtle(): SubtleCrypto {
  const c = globalThis.crypto;
  if (!c?.subtle) {
    throw new Error("Web Crypto API er ikke tilgjengelig i dette miljøet.");
  }
  return c.subtle;
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const subtle = getSubtle();
  const baseKey = await subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: KDF_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Krypterer et vilkårlig JSON-serialiserbart objekt og returnerer en
 * selvbeskrivende base64-"envelope": [versjon | salt | iv | chiffertekst].
 */
export async function encryptJSON(
  data: unknown,
  passphrase: string,
): Promise<string> {
  const subtle = getSubtle();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);

  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = new Uint8Array(
    await subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, plaintext),
  );

  const envelope = new Uint8Array(
    1 + SALT_BYTES + IV_BYTES + ciphertext.length,
  );
  envelope[0] = ENVELOPE_VERSION;
  envelope.set(salt, 1);
  envelope.set(iv, 1 + SALT_BYTES);
  envelope.set(ciphertext, 1 + SALT_BYTES + IV_BYTES);

  return toBase64(envelope);
}

/** Dekrypterer en envelope laget av {@link encryptJSON}. */
export async function decryptJSON<T = unknown>(
  envelopeB64: string,
  passphrase: string,
): Promise<T> {
  const subtle = getSubtle();
  const envelope = fromBase64(envelopeB64);

  if (envelope[0] !== ENVELOPE_VERSION) {
    throw new DecryptionError();
  }
  const salt = envelope.slice(1, 1 + SALT_BYTES);
  const iv = envelope.slice(1 + SALT_BYTES, 1 + SALT_BYTES + IV_BYTES);
  const ciphertext = envelope.slice(1 + SALT_BYTES + IV_BYTES);

  try {
    const key = await deriveKey(passphrase, salt);
    const plaintext = await subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      ciphertext as BufferSource,
    );
    return JSON.parse(new TextDecoder().decode(plaintext)) as T;
  } catch {
    throw new DecryptionError();
  }
}
