# Scanner Consolidation Plan — Option B (path: digitaleu.me/scanner)

> **Goal:** One scanner, one deployment, one domain. Make `apps/web/src/pages/scanner/`
> the single source of truth at `digitaleu.me/scanner/*`, sourced from the *current*
> standalone code, and retire `apps/scanner/` entirely.
>
> **Decision date:** 2026-06-25 · **Owner:** Tor + assistant

---

## Why this is needed (evidence)

| Fact | Source |
| --- | --- |
| `pages/scanner/` was created by the merge commit `94cdddf` (06-24 21:56) and **never touched since** | `git log -- apps/web/src/pages/scanner` |
| ALL recent design + OAuth work (European Digital system, auto-scan, 15+ commits) landed in `apps/scanner/` **after** the merge | `git log -- apps/scanner/src` |
| Result: `digitaleu.me/scanner` serves the **stale** copy; the good scanner only lives on `scanner.digitaleu.me` | `vercel.json` + route mounting |
| Route component diffs are large where design changed: `index.tsx` 304 lines, `dashboard.tsx` 142, `__root.tsx` 98 | `diff` standalone vs merged |
| Shared `lib/` already in sync (`scan.ts`, `db.ts`, `oauth-utils.ts`, `flags.ts` identical; `stripe.ts` ±2) | `diff` |
| Doc contradiction: ADR #24 says standalone subdomain; PROGRESS 06-24 says merged | CLAUDE.md vs PROGRESS.md |

**Net:** the "merge" was abandoned at birth. We must redo it from current code, then delete the standalone.

---

## Mounting reality (how /scanner works today)

```
App.tsx:  { path: "/scanner/*", Component: ScannerPage }
ScannerPage.tsx:  <Routes> mounting pages/scanner/{__root,index,scan,auth/*,dashboard,results,report,cancel}
```

`ScannerPage` uses **relative** child paths already (`scan`, `auth/signin`, …), so the React-Router wiring is correct. The only problems are (a) stale component bodies and (b) hardcoded absolute `scanner.digitaleu.me` URLs inside the route files.

---

## Execution steps

### Phase 0 — Safety
- [ ] Create branch `chore/scanner-consolidation`.
- [ ] Confirm current `npm run build` + `npm test` are green BEFORE changes (baseline).

### Phase 1 — Sync current scanner code into web
For each route file, copy the **standalone** version over the **merged** version, then fix paths:
- [ ] `__root.tsx` — Layout. Verify nav links are relative (`/scanner/...`) not `/...`.
- [ ] `index.tsx` (biggest diff — new design)
- [ ] `scan.tsx`
- [ ] `dashboard.tsx`
- [ ] `auth/signin.tsx`, `auth/callback.tsx`, `auth/email-callback.tsx` (signup + report already identical)
- [ ] `results/$scanId.tsx`, `cancel/index.tsx`, `cancel/$id.tsx`
- [ ] Sync `lib/stripe.ts` (±2 line diff) — confirm which env var name is correct (`VITE_STRIPE_PUBLIC_KEY` vs publishable).

### Phase 2 — Rewrite hardcoded URLs to path-based
- [ ] Replace `https://scanner.digitaleu.me` → `https://digitaleu.me/scanner` (and `/cancel` → `/scanner/cancel`) in:
  - `pages/scanner/cancel/$id.tsx` (JSON-LD breadcrumb items)
  - `pages/EmailScannerPage.tsx` (the `: "https://scanner.digitaleu.me"` fallback)
- [ ] Audit all `window.location.href = '/'` style redirects in `__root.tsx` / auth callbacks — they must return to `/scanner` context, not site root, where appropriate.

### Phase 3 — OAuth redirect URIs (CRITICAL — coordinate with provider consoles)
- [ ] Google Cloud Console: add/replace redirect URI → `https://digitaleu.me/scanner/auth/email-callback` (+ `localhost:5173/scanner/...` for dev).
- [ ] Microsoft Azure (Entra) app registration: same for Outlook callback.
- [ ] Update `.env.example` comments if URIs are referenced.
- [ ] Update `docs/OAUTH_SETUP_GUIDE.md` + `OAUTH_QUICK_REFERENCE.md` to the path-based URIs.

### Phase 4 — Retire the standalone app
- [ ] Delete `apps/scanner/` (entire workspace).
- [ ] Delete `apps/scanner/vercel.json` (gone with the dir) and remove the separate Vercel project for `scanner.digitaleu.me`.
- [ ] Remove duplicate Edge Function: `apps/scanner/supabase/functions/gmail-scan/` — confirm root `supabase/functions/scan-email/` is the canonical one first.
- [ ] Remove `dev:scanner`, `scanner`, `oauth:test` (or repoint) scripts in root `package.json` that target `@digitaleu/scanner`.
- [ ] Drop `apps/scanner` from `package-lock.json` (regenerate via `npm install`).
- [ ] DNS: decide whether `scanner.digitaleu.me` 301-redirects to `digitaleu.me/scanner` (recommended for any external links/SEO) or is removed.

### Phase 5 — Docs reconciliation
- [ ] CLAUDE.md ADR #24 → mark superseded; add ADR #27: "Scanner consolidated into web app at `/scanner` path; standalone retired."
- [ ] CLAUDE.md §1 + §4 tree: scanner is a route in `apps/web`, not a separate app.
- [ ] CLAUDE.md §10 stale Supabase ref `fuiebtpezpoxvkuuhaqy` → `mwsalzjsvuvlmshxzbxg` (per ADR #26).
- [ ] PROGRESS.md: log the consolidation; check off "Remove separate scanner app".
- [ ] DEPLOYMENT.md: remove `scanner.digitaleu.me` as a deploy target.

### Phase 6 — Verify (the deliverable)
- [ ] `npm install` clean, `npm run build` green, `npm test` green.
- [ ] Local: `digitaleu.me`-equivalent dev server → `/scanner`, `/scanner/scan`, `/scanner/auth/signin`, `/scanner/dashboard` all render with the **current** European Digital design.
- [ ] OAuth round-trip (Gmail + Outlook) against the new path callbacks.
- [ ] Deploy preview on Vercel; smoke test live `/scanner`.

---

## Risk register
- **OAuth breakage** is the #1 risk — redirect URIs must be updated in Google/Microsoft consoles *before* prod cutover, else sign-in dies. Keep old subdomain URIs registered during transition.
- **SEO/external links** to `scanner.digitaleu.me` — add a 301 redirect rather than hard-removing.
- **lib divergence** — re-verify `lib/*` parity after sync; the web app may have its own consumers of those libs (it does: `EmailScannerPage`, `InboxScanner`), so don't blindly overwrite shared libs without checking web-only callers.
