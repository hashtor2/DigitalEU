# Scanner Evaluation — comparing candidate inbox scanners

> We are building several inbox-scanner implementations to decide which is best.
> This doc defines the evaluation rubric and records each candidate's score.
> Owner: Head of Design (trust/UX lens) + Lead Engineer (feasibility/security).
> First candidate under test: the **Lovable-built scanner** (`apps/scanner`).

---

## Why this matters

We ask users for access to their inbox — the most private data there is. The
scanner is the single highest-stakes trust moment in the product. The "best"
scanner is **not** simply the one that detects the most services; it is the one
that detects well *while keeping our privacy promises literally true*.

Cardinal rule (from the design mandate): **reassure with facts, never with
theatre.** A scanner whose UI claims more privacy than its implementation
delivers is disqualifying, regardless of detection quality.

---

## Evaluation rubric

Score each candidate 1–5 per axis. Trust axes are gating: a hard fail on a
gating axis cannot be outweighed by UX or accuracy.

| # | Axis | Gating? | What "5" looks like |
|---|------|---------|---------------------|
| 1 | **Claim integrity** | ✅ gating | Every privacy claim in the UI is literally true of the implementation |
| 2 | **Architecture vs ADR #4** | ✅ gating | Scanning is 100% client-side; email/token never hits our servers (ADR #4) |
| 3 | **Token handling** | ✅ gating | Tokens never stored, or stored only with real zero-knowledge encryption |
| 4 | **Friction to first value** | | Guest mode default; user sees results without forced account/login (Principle #5) |
| 5 | **Detection accuracy** | | High recall + precision on real inboxes; transparent confidence |
| 6 | **Results UX** | | Clear, grouped, actionable; EU alternative + next step per service |
| 7 | **Brand fit** | | Nordic Warmth, IBM Plex Mono, accessible (WCAG AA) |
| 8 | **Data lifecycle** | | Minimal retention, honest auto-delete, instant user-initiated wipe |

---

## Candidate A — Lovable scanner (`apps/scanner`, scanner.digitaleu.me)

**Stack:** TanStack Start (React 19) · Supabase (auth + Postgres RLS + Edge
Functions) · Tailwind v4 Nordic Warmth. Has email/password + Google OAuth,
closed-beta allowlist, a `gmail-scan` Edge Function, scans/results tables, and
SEO cancellation guides (`/cancel/:id`).

### Scores (Head of Design, initial code review — not yet run live)

| Axis | Score | Note |
|------|-------|------|
| 1 Claim integrity | **1 — hard fail** | Landing says *"Your email content never leaves your device"* + "zero-knowledge", but scanning is **server-side** (see axis 2). The claim is not true of the implementation. |
| 2 Architecture vs ADR #4 | **1 — hard fail** | `gmail-scan` Edge Function fetches the OAuth token from the DB and calls the Gmail API **server-side**. Email metadata is processed on our servers, contradicting ADR #4 ("100% klientside"). |
| 3 Token handling | **1 — hard fail** | Tokens stored in `mailbox_connections.oauth_token_encrypted`, but the Edge Function comment says encryption is a `// TODO` and uses the value directly — i.e. **tokens are effectively stored in plaintext**. |
| 4 Friction to first value | **2** | Forces sign-in + email confirmation + closed-beta allowlist **before any scan**. Violates Guest-mode-default (Principle #5) and our manual-primary, no-account landing decision. |
| 5 Detection accuracy | **? (untested)** | Samples last 500 senders, matches `domain_patterns` substring. Reasonable approach; needs live testing. Substring match (`includes` both ways) risks false positives. |
| 6 Results UX | **4** | Results grouped by category, EU alternative + "how to cancel" guide per service. Strong, actionable. |
| 7 Brand fit | **4** | On-brand: cream `#f9f7f2`, terracotta `#c17a5c`, IBM Plex Mono. Clear 3-step explainer. |
| 8 Data lifecycle | **3** | Claims 30-day pg_cron auto-delete + instant disconnect wipe. Good intent, but persists derived results server-side without visible zero-knowledge encryption. |

### Verdict
**Strong product surface, disqualifying trust architecture as-is.** The UX,
results flow, and cancellation guides are genuinely good and worth keeping. But
three gating axes hard-fail: it scans server-side, stores tokens unencrypted,
and makes a privacy claim its implementation does not honour. We **cannot ship
the privacy copy over this backend** — that is exactly the theatre we condemn.

Two honest paths (Lead Engineer call):
- **Re-architect to client-side** to satisfy ADR #4 (keep the great results UX +
  guides; move the scan into the browser like `apps/web/lib/gmailScanner.ts`).
- **Amend ADR #4** to permit server-side scanning IF we (a) implement real
  encryption, (b) rewrite all UI claims to be literally accurate, and (c) get
  Legal sign-off. Higher risk to the sovereignty brand.

---

### Live UX review (Head of Design, 2026-06-23 — dev server localhost:5182)

Stack note: despite the README ("TanStack Start, server functions"), the app is a
plain Vite + **react-router-dom** SPA (no SSR). Routes reviewed: `__root`, `index`,
`auth/signin`, `auth/signup`, `auth/callback`, `dashboard`, `results/$scanId`,
`cancel/$id`.

**🚧 Blocker — the scan cannot complete end-to-end.** `dashboard.handleConnectGmail`
requires a pre-existing `mailbox_connections` row, but nothing creates one with a
valid Gmail token. Google sign-in uses `supabase.auth.signInWithOAuth({provider:'google'})`
with **no Gmail scopes**, so the identity can't read Gmail. The "Connect Gmail via
OAuth" button just links back to `/auth/signin` (a loop). **Accuracy cannot be
tested until the OAuth→Gmail-token wiring is built (→ Lead Engineer).**

**Flow / UX**
- ❌ Forces account + email confirmation + closed beta **before any value** (vs Guest-default, Principle #5).
- ❌ `alert()` used for dashboard errors ("Please sign in with Gmail first", "Scan failed") — jarring, off-brand.
- ❌ "Export results" button on results page has no handler (dead).
- ❌ Root layout has no link back to digitaleu.me; wordmark is bare "Scanner" — disconnected from the main site/brand.
- ⚠️ Confidence badge defaults to 90% when value missing — risks implying false precision.

**Brand / design system**
- ⚠️ Hardcoded hex everywhere instead of the shared design tokens; introduces `#1a2332` (navy) as body text — not brand `#2c2520`, and `#2d3e2d` (forest) for secondary actions — not in BRAND palette.
- ❌ **No dark mode** (ADR #19 mandates light + dark; apps/web has it).
- ⚠️ `focus:ring-terracotta` (signup) vs `focus:ring-[#c17a5c]` (signin) — `terracotta` token likely undefined → inconsistent focus ring (a11y).
- ⚠️ Category taxonomy (music/ai/development/ecommerce/creative/design) diverges from `@digitaleu/shared` SERVICES — two sources of truth.

**Accessibility**
- ⚠️ `<label>` elements not associated via `htmlFor`/`id` — weaker SR association, label clicks don't focus.
- ⚠️ Spinners lack `role="status"`/`aria-live` — loading not announced.
- ⚠️ Muted text at `/60` opacity may fail AA on small text — needs contrast check.

**Genuinely good (keep)**
- ✅ Loading / error / empty states well-covered on results, dashboard, callback, signup, guide.
- ✅ Cancellation guide page is strong: JSON-LD (HowTo + BreadcrumbList), OG tags, canonical, responsive hero (srcset/sizes), clear steps, EU alternative, next-steps incl. extension. Real SEO asset.
- ✅ IBM Plex Mono + terracotta give an on-brand-ish feel.

**Live-review verdict:** good bones (states, guides, typography), but **not testable
for accuracy yet** (broken scan wiring), and carries the gating trust failures above
plus brand-token drift and no dark mode.

---

## Candidate B — in-app web scanner (`apps/web` `/emailscanner`)

**Stack:** Vite + React in the main web app; `lib/gmailScanner.ts` (client-side
OAuth token via `extractAccessTokenFromUrl`), `InboxScannerOnboarding`,
`EmailScannerGate`. Appears client-side (matches ADR #4). **Not yet scored —
pending review.**

---

## Open handoffs

- **→ Lead Engineer:** Confirm the `gmail-scan` token-encryption status and the
  server-side architecture. Is server-side required (e.g. Google deprecating the
  OAuth implicit flow), or can Candidate A be made client-side?
- **→ Legal & Privacy Counsel:** The live/staged scanner copy claims "content
  never leaves your device" and "zero-knowledge" while scanning server-side with
  unencrypted tokens. This is a GDPR + advertising-accuracy risk — needs review
  before any public/beta exposure.
