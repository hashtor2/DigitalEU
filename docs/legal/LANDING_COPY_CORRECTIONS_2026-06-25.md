# Landing-page copy corrections — draft for implementation

**Date:** 2026-06-25
**Author:** Legal & Privacy Counsel (agent)
**Follow-up to:** `docs/legal/CLAIMS_AUDIT_2026-06-25.md`
**For:** Lead Engineer (apply to `index.html`) — wording cleared by Legal; please
loop **CMO/Editor** if you want to polish tone, and **QA** to verify post-change.

## Canonical facts the copy must reflect
- **Built/developed in Norway 🇳🇴.**
- **Our servers & data: Sweden (Stockholm, eu-north-1) 🇸🇪** — GDPR-adequate EU.
- **Inbox scan path (live, ADR #22):** OAuth token → our `scan-email` Edge Function
  (EU/Sweden) reads **sender headers only, never bodies**, extracts service domains,
  returns them to the browser, **stores nothing**, token is **ephemeral**.
- **Matching** of detected services against alternatives happens **client-side**.
- **Switzerland** is correct **only** for the *recommended alternatives* (Proton et
  al. are Swiss-hosted) — never for our own data.
- **Zero-knowledge** applies **only** to Profile-mode stored data — not to the scan.
  (And see Finding 3: keep it future-tense until profile ZK actually ships.)

## Exact before → after (line numbers from current `index.html`)

**Line 71 — hero subtitle**
- ❌ `…Reclaim your privacy from Big Tech, 100% client-side.`
- ✅ `…Reclaim your privacy from Big Tech. We read only your email's sender metadata — never the contents — and store nothing.`

**Line 104 — badge heading**
- ❌ `🔒 Zero-Knowledge & 100% Client-Side`
- ✅ `🔒 Metadata Only · We Store Nothing`

**Line 136 — feature bullet**
- ❌ `<b>100% Client-Side</b> — No Server Logs`
- ✅ `<b>Metadata Only</b> — Nothing Stored`
  *(Dropped "No Server Logs": the scan runs on our Edge Function. Re-add only if
  Lead Engineer confirms the function writes no request logs.)*

**Line 212 — step 1 explainer**
- ❌ `Connect your Gmail/Outlook via secure OAuth. Our system pulls <b>headers only</b> and scans them <b>100% locally inside your browser</b>. Your email content never leaves your computer, and we never store your passwords.`
- ✅ `Connect your Gmail/Outlook via secure, read-only OAuth. We read <b>sender headers only — never your email contents</b> — on our EU server in Sweden 🇸🇪, return the list of services to your browser, and discard everything immediately. We never see your password, and we store nothing.`

**Line 282 — progress caption**
- ❌ `🔐 100% Client-side. Header scanning done locally. No data leaves your machine.`
- ✅ `🔐 Sender headers only — read once on our EU server, matched in your browser, nothing stored.`

**Line 430 — alternatives-grid header** *(about the recommended products, not us)*
- ❌ `🛡️ Protected by Switzerland & GDPR laws`
- ✅ `🛡️ Covered by EU GDPR & Swiss privacy law`
  *(Accurate: the grid mixes EU 🇩🇪/🇪🇪 and Swiss 🇨🇭 providers.)*

**Line 530 — our own pricing/feature bullet**
- ❌ `✓ Switzerland cloud-sync profile`
- ✅ `✓ Sweden 🇸🇪 cloud-sync profile`

**Line 582 — footer** *(already mostly accurate; add provenance)*
- ◑ `digitaleu.me · Data is client-side encrypted and hosted in the EU (Sweden, Stockholm) 🇸🇪.`
- ✅ `digitaleu.me · Built in Norway 🇳🇴 · Profile data is client-side encrypted and hosted in the EU (Sweden, Stockholm) 🇸🇪.`
  *("Profile data" — only Profile-mode storage is encrypted client-side, not the scan.)*

## After implementation
1. **QA/Security Auditor:** confirm each new string is literally true against the
   live scanner path (esp. "stores nothing", "never reads contents", logging).
2. Mirror the same language anywhere else it appears: `PROJECT_REPORT.md:223`,
   `MARKETING_PLAN.md:87/112`, `manifesto-letter-01.md:29`, and the code comments
   in `scanGmail.ts` / `outlookScanner.ts` (see audit doc Finding 2).
3. Keep this draft and the audit doc as the record that the claim was reviewed.
