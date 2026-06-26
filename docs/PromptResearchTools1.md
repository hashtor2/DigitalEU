Right — the file is in my working clone (and on the feat/browser-extension branch), neither of which is on your machine yet since nothing's been pushed. Here's the full spec inline.

---

DigitalEU — Product Spec: Email Scanner & Browser Extension

Status: Draft for review · Date: 2026-06-25
Legend: ✅ Built & verified · 🟡 Built but unwired/untested · ⏳ Planned · 🔴 Known bug

0. How the two products fit together

Core promise: find every Big Tech account in your life, then actually move them to European alternatives. Two jobs, one per product:

- Email Scanner → "What am I signed up for?" (DISCOVERY) — web app at /scanner, OAuth + server scan
- Browser Extension → "Help me change/leave each one." (EXECUTION) — Chrome/Firefox MV3, autofill + guided playbooks

The handoff is the magic moment: the scanner already knows your accounts, so the extension never asks you to type them in again. That bridge is built (✅).

---

PART A — THE EMAIL SCANNER

A1. Purpose
Discover, in ~2 minutes, every consumer service tied to your inbox — reading only sender metadata — and map each to a European alternative.

A2. User journey (as built)
1. Land → /emailscanner shows the unlock gate
2. Unlock (free via Proton affiliate, or €5 Stripe)
3. Connect inbox → OAuth Gmail/Outlook (PKCE)
4. Scan → server-side Edge Function reads sender domains (metadata only)
5. Results → /scanner/results/:scanId, grouped by category, confidence %, cancellation guides
6. Act → "How to cancel" per service, or Send to browser extension

A3. Architecture (as built)

Frontend
• Implementation: React 19 + Vite + Tailwind v4, at /scanner/* in apps/web
• Status: ✅

OAuth init
• Implementation: lib/oauth-utils.ts — PKCE (S256) + CSRF state
• Status: ✅

Token exchange
• Implementation: Edge Fn exchange-email-code — server-side, holds secret
• Status: ✅ 🔴

Inbox scan
• Implementation: Edge Fn scan-email — From headers only
• Status: ✅

Matching
• Implementation: DOMAIN_MAPPINGS in @digitaleu/shared
• Status: ✅

Payments
• Implementation: Edge Fn create-checkout + stripe-webhook
• Status: ✅

Storage
• Implementation: Supabase (Stockholm, eu-north-1)
• Status: ✅

Privacy-critical data flow:
Browser ──OAuth code──▶ exchange-email-code (server) ──▶ Google/MS token endpoint
   │   ◀──ephemeral token──┘   (token in sessionStorage only)
   └──token──▶ scan-email (server) ──▶ Gmail/Graph API (From headers only)
                    └──▶ returns sender DOMAINS only (never bodies/subjects)


A4. Monetization & access gate (EmailScannerGate.tsx)

**Free**
• Mechanism: Proton affiliate → localStorage flag → unlock
• Status: 🟡
• Note: P1: unlocks on click without verifying signup (honor-system)

**€5 one-time**
• Mechanism: Stripe Checkout via Edge Fn
• Status: ✅
• Note: Was 🔴 (dead Netlify endpoint) — fixed

Price is €5 one-time, lifetime — consistent everywhere (no stale €29).

A5. Security & privacy posture (as built)
- Metadata only — Gmail format=metadata + From, or Graph $select=from. Never bodies/subjects/attachments
- Minimal Gmail scope: gmail.metadata ✅
- Server-side token exchange — client secret never reaches browser ✅
- Ephemeral tokens — sessionStorage, cleared on tab close
- PKCE + state — RFC 7636 S256 + CSRF validation ✅
- Data residency — Sweden (eu-north-1) ✅

A6. What it detects
Sender-domain → service via DOMAIN_MAPPINGS, grouped: email, streaming, music, storage, AI, productivity, communication, development, e-commerce, creative, design, other. Each with confidence + suggested EU alternative.

A7. Known issues / open decisions (Scanner)
- 🔴 S1 — secret-leak in exchange-email-code (fixed on branch fix/tests-and-oauth-debug, not merged): DEBUG logs + 500 error body exposed client-secret prefixes. Must land before prod OAuth.
- 🟡 P1 — Proton free-path doesn't verify signup
- 🟡 P2 — Outlook scope is .default (broad) → narrow to Mail.ReadBasic

- ⏳ Scan depth — capped ~100 messages; you found 400+, needs pagination
- ⏳ OAuth redirect URIs must be registered in Google Cloud + Azure for /scanner/auth/email-callback (only you can)

---

PART B — THE BROWSER EXTENSION

B1. Purpose
The execution layer. Once you know which accounts to move, it:
1. Autofills your new European email on any site's settings, and
2. Guides you through changing email or deleting the account per service, with a safety gate before destructive actions.

Local-first — all data in chrome.storage.local, nothing sent to any server, no passwords stored.

B2. Platforms & manifest
- Manifest V3. "Digital Europe Companion", v1.0.0
- Permissions: storage, tabs. Host: <all_urls>
- externally_connectable: digitaleu.me, www, localhost:5173 ✅ (was missing — fixed)
- Targets: Chrome ✅ built · Firefox ⏳

B3. The four popup tabs (all built ✅)

**Upload**
• What it does: Drag/drop .csv/.json/.txt (≤5MB, ≤10k rows). Parse → match → preview → import

**Queue**
• What it does: Imported accounts: "Matched services" + "Needs review". Click to start a guide

**Guide**
• What it does: Playbook runner — step-by-step per service, with deletion safety gate

**Settings**
• What it does: Target email; "Clear all local data"; privacy statement; links

B4. Core capabilities (as built)

B4.1 Autofill (content.ts) ✅ — finds email fields, injects "🇪🇺 Autofill" button, fills + fires input/change events (React/Vue-safe), reports success, re-runs on DOM changes (SPA-safe).

B4.2 Import & matching (parser.ts, matcher.ts) ✅ — parses CSV/JSON/TXT; matches domains against DOMAIN_MAPPINGS (shared with scanner) with confidence levels + www/root-domain fallback.

B4.3 Guided playbooks (playbooks.ts) ✅
- 11 services: Netflix, Spotify, Facebook, Instagram, LinkedIn, X, Dropbox, LastPass, Reddit, Discord
- Each has change-email AND delete-account flows
- Steps have actionType (navigate/click/fill/instruction/confirm), CSS selector, and fallbackInstruction (graceful degradation)
- Safety: never auto-submits destructive steps. Delete requires a 4-checkbox gate (data downloaded · permanence understood · retention noted · no longer needed for login)

B4.4 Web ↔ extension bridge ✅ — pushes target email (legacy) AND scanner-detected accounts (new); install detection via presence-announce + PING.

B5. The scanner → extension handoff (flagship integration) ✅
Built this sprint — the differentiator.
Scanner results page                Extension
  detects via PING  ◀──────  content script announces presence
  shows "Send to extension"
        │ postMessage(IMPORT_ACCOUNTS, entries)
        ▼
  content ──▶ background ──▶ storage.uploadedEntries (merged, de-duped)
                                   └─▶ Queue pre-populated, playbooks ready

- Converter detectedToUploadedEntries() maps DetectedAccount → UploadedAccountEntry (5 unit tests ✅)
- Rollout: button now (only when extension detected); auto-push later (handshake is the enabler)

B6. Privacy posture (Extension)
- Local-first — all state in chrome.storage.local, zero backend calls
- No passwords read/stored; autofill writes email field only
- Origin allow-list — only accepts messages from digitaleu.me/localhost
- Destructive guardrail — deletion gated, never auto-submits

B7. Data model (@digitaleu/shared)
DetectedAccount (scanner hit) · UploadedAccountEntry (queue item) · SitePlaybook/PlaybookStep · GuideRunState (progress) · ExtensionLocalState

B8. Known gaps / TODO (Extension)
- ⏳ No tests in extension itself (shared bridge has 5)
- ⏳ Firefox build · ⏳ No manifest icons · ⏳ Not in CI
- ⏳ Playbook coverage = 11 services
- ⏳ Store listing prep
- 🟡 Compiled .js committed beside .ts (current convention — keep in sync)

---

PART C — ROADMAP TO "100% SHIPPABLE"

| # | Item | Product | Type | Blocks prod? |

|---|---|---|---|---|
| 1 | Merge S1 secret-leak fix | Scanner | 🔴 security | Yes |
| 2 | Register OAuth redirect URIs | Scanner | config (you) | Yes |
| 3 | Decide Proton verification (P1) | Scanner | product | No |
| 4 | Narrow Outlook scope (P2) | Scanner | security | No |
| 5 | Deeper scan (400+ accounts) | Scanner | feature | No |
| 6 | Extension icons + manifest | Extension | asset | Store |
| 7 | Extension tests | Extension | quality | No |
| 8 | Firefox build | Extension | feature | Store |
| 9 | CI for extension | Extension | infra | No |
| 10 | Auto-push handoff | Both | feature | No |
| 11 | Store listings (Chrome, AMO) | Extension | launch | Ship |
| 12 | Expand playbooks | Extension | content | No |

---

PART D — OPEN QUESTIONS FOR REVIEW

1. Proton free-path (P1): honor-system, or real affiliate verification?
2. Scan depth: target? 100 (fast) vs 400+ (marketing promise). Quick-vs-deep toggle?
3. Distribution: Chrome + Firefox at launch, or Chrome first?
4. Autofill scope: keep broad <all_urls> (harder review) or limit to supported services?
5. Playbook trust: remote-updatable source, or bundled + update via releases?
6. Auto-push UX: silent when installed, or always require the button?
7. Naming: "Digital Europe Companion" vs "DigitalEU" — align before store submission?

---

That's the complete spec. Note: it lives in my clone on branch feat/browser-extension —

PART D — OPEN QUESTIONS FOR REVIEW


4. Autofill scope: keep broad <all_urls> (harder review) or limit to supported services?
5. Playbook trust: remote-updatable source, or bundled + update via releases?
6. Auto-push UX: silent when installed, or always require the button?
7. Naming: "Digital Europe Companion" vs "DigitalEU" — or anything else? Look at digitaleu.me to see our concept







