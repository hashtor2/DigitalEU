# Privacy-Claims Audit — literal-truth review

**Date:** 2026-06-25
**Author:** Legal & Privacy Counsel (agent)
**Scope:** Every public/user-facing place we claim (a) where our own data lives
and (b) that inbox scanning is "100% client-side" / "email never reaches our
servers". Flag anything no longer literally true after **ADR #22** (scanning moved
server-side, 2026-06-24), **ADR #24** (scanner is the live standalone app) and the
**Switzerland → Sweden** data-residency correction.

> ⚠️ Informational guidance, not formal legal advice. Public-facing factual claims
> about data handling carry **GDPR Art. 5(1)(a) transparency / fairness** and EU
> consumer-law (UCPD — misleading-omission) exposure. Before we *fix* the marketing
> copy, the technical facts below should be confirmed by **Lead Engineer** and the
> rewrites cleared by **CMO/Editor**. This document only *flags*.

---

## TL;DR — two claims are now false in places

1. **"Switzerland" as *our* data location.** Our data is in **Sweden** (Supabase,
   Stockholm, eu-north-1). Most "Swiss" strings in the repo correctly describe the
   *alternatives we recommend* (Proton, Threema, Tuta…) and are **true** — leave
   them. Only the ones describing **our own** storage/profile are wrong.
2. **"100% client-side" inbox scanning.** The **live** scanner (`scanner.digitaleu.me`)
   exchanges the OAuth code and fetches Gmail/Outlook **From-headers server-side**
   in the `scan-email` / `exchange-email-code` Edge Functions (ADR #22). Sender
   metadata and the ephemeral OAuth token **do transit our server**. So "100%
   client-side", "email never leaves your device", "no data leaves your machine",
   "never reaches any server including ours" are **no longer literally true** for
   the live product.

---

## Finding 1 — "Switzerland" wrongly claimed as OUR data location

**Risk: HIGH where it describes our own service** (false statement of where user
data is stored). Low elsewhere.

| File:line | Text | Verdict | Action |
|---|---|---|---|
| `index.html:530` | "✓ **Switzerland** cloud-sync profile" (inside *our* pricing/feature list) | ❌ **FALSE** — our profile sync is Supabase / **Sweden** | Change to "Sweden 🇸🇪 cloud-sync profile" (or "EU cloud-sync") |
| `index.html:430` | "🛡️ Protected by **Switzerland** & GDPR laws" (header over the alternatives grid) | ⚠️ **Misleading** — reads as *our* protection; also not all listed alts are Swiss (Tuta = 🇩🇪) | Reword to "Protected by EU/Swiss privacy law & GDPR" or drop the country |
| `docs/AFFILIATE_PROGRAM.md:152` | Instruction: 'Update agent BLOCK A … "Supabase data in **Switzerland** 🇨🇭"' | ❌ **Stale** — instruction now propagates a false fact | Update to "Supabase data in **Sweden** 🇸🇪 (Stockholm, eu-north-1)" |

**Leave unchanged (literally true — these describe recommended alternatives, not us):**
`packages/shared/src/alternatives.ts`, `packages/shared/src/services.ts`,
`apps/web/src/data/guide-content.tsx`, `apps/web/src/pages/*` (Proton/Threema/Wire/
Tresorit Swiss jurisdiction), `index.html:441` (Proton Mail "Swiss-based"),
`docs/agents/GeminiResearchOnEUTechAlternatives.md`. Swisscows, "Swiss nFADP"
explainer in `ServicePage.tsx:53`, etc. — all correct.

> Note: my own agent persona (BLOCK A) and several `docs/agents/*.md` still say
> "data in Switzerland 🇨🇭, Zürich". These are internal context files, not
> user-facing, but they should be corrected too so we stop re-introducing the
> error (see `docs/AFFILIATE_PROGRAM.md:152` which actively instructs the wrong
> value). Owner action: update agent BLOCKs to Sweden.

---

## Finding 2 — "100% client-side" / "email never reaches our servers"

> ✅ **VERIFIED & CLOSED 2026-06-25** by Lead Engineer against the live code.
> Final wording, OAuth-scope record, and the Subject-line caveat are in
> `docs/legal/CLAIM_WORDING_FINAL_2026-06-25.md`. The "100% client-side" family of
> claims is **confirmed false** and prohibited in user-facing copy. (Engineer also
> fixed a P0 client-secret leak and tightened the Outlook scope to `Mail.ReadBasic`.)

**Risk: HIGH.** This is our headline trust claim and it is contradicted by our own
ADR #22. What actually happens on the **live** path (`apps/scanner` →
`supabase/functions/scan-email/index.ts`):

- Browser sends the **OAuth access token** to our `scan-email` Edge Function.
- The Edge Function calls the Gmail/Graph API **server-side**, pulls **From headers**
  (sender metadata), extracts domains **on our server**, returns domains to the browser.
- Token is **ephemeral / not stored**; **email bodies are never fetched**.

So defensible claims remain: *"we never store your email"*, *"we don't read your
email content/bodies"*, *"metadata only"*, *"we only see which services you use"*.
**Not** defensible: *"100% client-side"*, *"never leaves your device"*, *"no server
logs"*, *"never reaches any server including ours"*.

| File:line | Text | Verdict |
|---|---|---|
| `index.html:71` | "…Reclaim your privacy…, **100% client-side**." | ❌ False for live scanner |
| `index.html:104` | "🔒 Zero-Knowledge & **100% Client-Side**" | ❌ False + conflates ZK with scanning |
| `index.html:136` | "**100% Client-Side** — No Server Logs" | ❌ False |
| `index.html:212` | "scans them **100% locally inside your browser**. Your email content **never leaves your computer**" | ❌ False (headers fetched server-side) |
| `index.html:282` | "🔐 **100% Client-side**. … **No data leaves your machine**." | ❌ False |
| `PROJECT_REPORT.md:223` | "No data sent to our servers (**100% client-side**)" | ❌ False |
| `docs/MARKETING_PLAN.md:87-88,112` | "Inbox scanning is **100% client-side** — your email never leaves your device"; "results never touch our servers" | ❌ False — *but* this file already carries a "Legal gate: must be verified by Legal" note (line 95). This audit is that verification: **claim fails.** |
| `docs/manifesto-letter-01.md:29` | "runs **entirely on your device**. Your email content **never reaches any server, including ours**." | ❌ False |
| `docs/agents/05-engineer.md:43-44,79` | "Inbox scanning: **100% client-side** … email content **NEVER leaves the client**" | ❌ Stale internal context (predates ADR #22) |
| `apps/web/src/lib/scanGmail.ts:1` | "// Gmail inbox scanner — **100% client-side** metadata extraction" | ⚠️ True *for this file* (legacy web-app path calls Google directly), but the **live** product is the scanner app's server-side path. Comment is misleading about the shipped behavior. |
| `apps/web/src/lib/outlookScanner.ts:8` | "…sendes **ALDRI** til våre servere" | ⚠️ Same as above |

**Good model already in place:** `README.md:22,43,93` was updated to the honest
framing — *"Backend scans emails server-side, frontend matches 100% client-side"*
and *"100% Client-Side **Matching**"*. The user-facing copy should adopt exactly
this distinction: **server-side scan (metadata only, nothing stored) + client-side
matching**. That is both accurate and still a strong privacy story.

---

## Finding 3 — "Zero-knowledge" scope hygiene

**Risk: MEDIUM.** Zero-knowledge (AES-GCM + PBKDF2, `apps/web/src/lib/crypto.ts`)
is **real and true for Profile-mode storage**. The risk is *placement*: when "Zero-
Knowledge" sits next to a scanning claim (e.g. `index.html:104` "Zero-Knowledge &
100% Client-Side"), a reader infers the *scan* is zero-knowledge, which it is not
(we process sender metadata server-side in cleartext, transiently). Keep "zero-
knowledge" attached to **Profile mode / stored profile data only**, never to the scan.

Also confirm before launch (Lead Engineer): Profile mode is flagged "ready/planned"
in `README.md:124` and `PROJECT_REPORT.md:911` ("not yet in MVP"). If zero-knowledge
profile sync is **not actually live**, then "zero-knowledge" in present tense on the
landing page is premature. Use future/"by design" framing until it ships.

---

## Recommended remediation (priority order)

1. **MUST (legal):** Fix `index.html:530` (Sweden, not Switzerland) and the five
   "100% client-side" landing-page claims (71, 104, 136, 212, 282) to the
   README framing: *server-side metadata scan, nothing stored, client-side matching*.
2. **MUST:** Fix the stale instruction `docs/AFFILIATE_PROGRAM.md:152` so it stops
   re-seeding "Switzerland" into agent context.
3. **SHOULD:** Reword `manifesto-letter-01.md:29` and `PROJECT_REPORT.md:223`; update
   internal agent context (`05-engineer.md`, BLOCK A across agents) to Sweden +
   server-side scan.
4. **SHOULD:** Correct/qualify the code comments in `scanGmail.ts` / `outlookScanner.ts`
   so they describe shipped behaviour.
5. **GOOD PRACTICE:** Once Privacy Policy is finalized, state the scan path plainly:
   "OAuth token sent to our EU server, used once to read sender headers, returns the
   list of services, then discarded; bodies never read; nothing stored."

**Hand-offs:** Lead Engineer (confirm token lifetime, logging, that bodies are never
fetched, and which scanner path is actually live) → CMO/Editor (rewrite the public
copy) → QA/Security Auditor (verify the rewritten claims are literally true).

This is high-stakes for public statements; if we keep aggressive "never touches our
servers" language anywhere, get a **licensed lawyer** to sign off on the wording.
