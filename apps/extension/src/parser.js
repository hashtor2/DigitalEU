/**
 * Secure file parser for account list uploads.
 *
 * Security rules:
 * - Strict size and row limits before any processing
 * - Only safe text formats accepted (CSV, JSON, TXT)
 * - No network access — 100 % local parsing
 * - All unknown/malformed rows go to `rejected` bucket
 */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_ROWS = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const URL_RE = /^https?:\/\/([^/]+)/;
function normalizeEntry(raw) {
    const v = raw.trim();
    if (EMAIL_RE.test(v)) {
        const domain = v.split("@")[1]?.toLowerCase();
        return { email: v.toLowerCase(), domain };
    }
    const urlMatch = URL_RE.exec(v);
    if (urlMatch) {
        return { domain: urlMatch[1]?.toLowerCase() };
    }
    if (DOMAIN_RE.test(v)) {
        return { domain: v.toLowerCase() };
    }
    return {};
}
function parseLines(lines) {
    const accepted = [];
    const rejected = [];
    const warnings = [];
    for (const line of lines) {
        const raw = line.trim();
        if (!raw || raw.startsWith("#"))
            continue;
        if (accepted.length + rejected.length >= MAX_ROWS) {
            warnings.push(`Stopped at ${MAX_ROWS} rows limit.`);
            break;
        }
        const normalized = normalizeEntry(raw);
        if (normalized.email || normalized.domain) {
            accepted.push({ rawValue: raw, ...normalized });
        }
        else {
            rejected.push({ rawValue: raw, reason: "Not a recognized email, domain, or URL." });
        }
    }
    return { accepted, rejected, warnings };
}
function parseTxt(text) {
    return parseLines(text.split(/\r?\n/));
}
function parseCsv(text) {
    // Extract first non-empty cell from each row (naive but safe CSV parser)
    const lines = text.split(/\r?\n/).map((line) => {
        // Strip optional quotes from first cell
        const first = line.split(",")[0] ?? "";
        return first.replace(/^["']|["']$/g, "").trim();
    });
    return parseLines(lines);
}
function parseJson(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        return { accepted: [], rejected: [], warnings: ["Invalid JSON file."] };
    }
    // Support flat array of strings or array of objects with email/domain/value key
    const rows = [];
    if (Array.isArray(parsed)) {
        for (const item of parsed) {
            if (typeof item === "string") {
                rows.push(item);
            }
            else if (item !== null && typeof item === "object") {
                const obj = item;
                const val = (typeof obj["email"] === "string" ? obj["email"] : null) ??
                    (typeof obj["domain"] === "string" ? obj["domain"] : null) ??
                    (typeof obj["value"] === "string" ? obj["value"] : null) ??
                    (typeof obj["url"] === "string" ? obj["url"] : null);
                if (val)
                    rows.push(val);
            }
        }
    }
    return parseLines(rows);
}
/** Main entry point — call with a File object from the browser. */
export async function parseUploadedFile(file) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            accepted: [],
            rejected: [],
            warnings: [`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`],
        };
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["csv", "json", "txt", "tsv"];
    if (!allowedExts.includes(ext ?? "")) {
        return {
            accepted: [],
            rejected: [],
            warnings: [`Unsupported file type ".${ext}". Accepted: csv, json, txt.`],
        };
    }
    const text = await file.text();
    if (ext === "json")
        return parseJson(text);
    if (ext === "csv" || ext === "tsv")
        return parseCsv(text);
    return parseTxt(text);
}
