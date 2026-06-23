# IA & Navigation Restructure — Design Record

> Authored by Head of Design, 2026-06-23. Records the information-architecture
> decision behind the main navigation and the work executed to ship it.
> See also `docs/BRAND.md` (Nordic Warmth) and `docs/DESIGN_CHECKLIST.md`.

---

## Problem

The old menu mixed three different axes on one level:
`For You · For Business · Dashboard · Scanner · Alternatives · Guides`

- **Actions/tools:** Dashboard, Scanner
- **Content:** Alternatives, Guides
- **Audience toggle:** For You / For Business

"For You/For Business" is a *who-are-you* axis, while "Dashboard" is a *result*
you reach after an action — they don't belong on the same level. Result: clutter.

Two additional issues surfaced:
1. **Two scanners ran in parallel** — a manual "tick your services" page and an
   OAuth inbox scanner that existed both in-app (`/emailscanner`) and as an
   external subdomain (`scanner.digitaleu.me`).
2. **Brand drift** — `SelectorPage` and `AboutPage` were still dark-blue, not the
   Nordic Warmth brand.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Main nav (6 items) | Logo→**Landing** + **How it works · Alternatives · News · Guides · About** | One flat, content-focused consumer nav |
| B2B placement | Under **About** (section → `/b2b`) | Keep consumer nav clean; B2B (Phase 3) still reachable |
| Landing primary action | **Manual check-off** primary, "Scan inbox" secondary | Privacy-by-default; lowest first-touch anxiety |
| Page #2 name | **"How it works"** | Covers what/how/security; conversion + trust |
| Removed from nav | Dashboard, Scanner, For You/For Business toggle, `/start` | Dashboard = post-scan destination; Scanner = landing entry |

### Final information architecture

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | Landing | `/` | Scan *or* tick services (manual primary) |
| 2 | How it works | `/how` | What we do / how / security |
| 3 | Alternatives | `/directory` | EU tech catalog |
| 4 | News | `/news` | EU tech news |
| 5 | Guides | `/guides` | Guides, tests |
| 6 | About | `/about` | Who we are + contact + For business |

---

## Executed

| Area | Change | Files |
|------|--------|-------|
| Nav | New 6-item nav; removed old items | `components/Header.tsx` |
| Nav | Mobile hamburger menu + dropdown panel | `components/Header.tsx` |
| Footer | Aligned to new IA (added How it works, News, For business; "Manifesto"→"About") | `components/Footer.tsx` |
| About | "For business" section → `/b2b` | `pages/AboutPage.tsx` |
| Landing | Fixed dead `/scanner` link → `/emailscanner` | `components/LandingPage.tsx` |
| Scanner | Internal `/emailscanner` confirmed canonical; no external refs left | (verified) |
| Brand | Re-skinned `SelectorPage` → Nordic Warmth | `pages/SelectorPage.tsx` |
| Brand | Re-skinned `AboutPage` → Nordic Warmth | `pages/AboutPage.tsx` |
| Cleanup | Removed orphaned `/start` route + deleted file | `App.tsx`, `pages/AudienceSelectorPage.tsx` (deleted) |

Note: `LandingPage`, `HowItWorksPage`, and `ReportPage` were built in parallel
(already on-brand) — this work reconciled the nav/routes around them.

Verification: `tsc --noEmit` passes (exit 0).

---

## Open items / handoffs

- **→ Lead Engineer:** Should "Scan Inbox" hit the `EmailScannerGate` paywall, or
  should the scan itself be free? (Gate currently requires unlock.)
- **Scanner comparison (in progress):** Several scanner implementations are being
  developed to evaluate which is best; the first to test is the Lovable-built one.
  The landing "Scan Inbox" entry must point at whichever scanner is under test.
- **Pre-launch:** Add trust microcopy next to "Scan Inbox" (read-only / nothing
  leaves your device).
