# Final claim wording + scope record — inbox scan

**Date:** 2026-06-25
**Author:** Legal & Privacy Counsel (agent)
**Closes:** Finding 2 of `docs/legal/CLAIMS_AUDIT_2026-06-25.md`
**Trigger:** Lead Engineer verified the live scanner path against the code and
reported back (2026-06-25). This doc records that verification, documents the
OAuth scopes as least-privilege, and gives **ready-to-paste** consent + Privacy
Policy wording.

> ⚠️ Informational guidance, not formal legal advice. Public factual claims about
> data handling carry **GDPR Art. 5(1)(a)** (transparency/fairness) and **UCPD**
> (misleading-omission) exposure. The wording below is cleared by Legal as
> accurate to the verified implementation; have **QA/Security Auditor** confirm
> each string post-implementation, and get a **licensed lawyer** to sign off
> before launch if any aggressive "never touches our servers" language survives.

---

## 1. Engineer verification — logged

Lead Engineer verified the claims against `exchange-email-code` and `scan-email`
and returned the following. **Accepted.**

| Claim | Verdict (engineer) | Legal status |
|---|---|---|
| Tokens never persisted server-side | ✅ TRUE — no storage/logging in either function | **Defensible** |
| Email content never read — Gmail | ✅ TRUE — `gmail.metadata` cannot reach bodies | **Defensible, with Subject caveat (§3)** |
| Email content never read — Outlook | ✅ TRUE after this PR — was unverifiable under `.default` | **Defensible, with Subject caveat (§3)** |
| "Scanning 100% client-side" | ❌ FALSE — server-side; From-headers transit our EU Edge Function in memory, never stored | **Must not be used** |

**Decision:** Finding 2 of the audit is now **VERIFIED**, not merely flagged. The
"100% client-side" family of claims is confirmed false for the live product and is
prohibited in any user-facing copy.

### Two fixes the engineer made that strengthen the legal position
- **P0 (fixed):** `exchange-email-code` was returning the first 30 chars of both the
  Google and Microsoft client secrets in its HTTP 500 body (CORS `*`) and logging
  them. Removed. **Owner must still rotate** `GOOGLE_OAUTH_CLIENT_SECRET` and
  `MICROSOFT_OAUTH_CLIENT_SECRET` — the code fix stops new exposure but cannot
  un-leak what already went out. Logged to memory (`rotate-oauth-secrets`).
  *(Legal note: if any real user secrets/tokens were exposed this could be a
  personal-data breach under GDPR Art. 33; client secrets alone are app
  credentials, not personal data, so Art. 33 notification is **not** triggered by
  the secret leak itself. Confirm with the owner that no user tokens were in the
  leaked payload — if they were, the 72-hour clock may apply.)*
- **P1 (fixed):** Outlook scope tightened from `.default` (grants *all* Azure-app
  permissions — potentially full `Mail.Read`) to **`Mail.ReadBasic`**. This is what
  makes the Outlook "never read contents" claim defensible at all — see §2.

---

## 2. OAuth scopes — least-privilege record (GDPR Art. 5(1)(c) data minimisation)

| Provider | Scope now in use | What it grants | What it excludes | Verdict |
|---|---|---|---|---|
| Gmail | `gmail.metadata` | Message **headers** (From, To, Cc, Subject, Date) + labels | Message **bodies**, attachments | ✅ Least-privilege for sender-domain detection |
| Outlook | `Mail.ReadBasic` | Message metadata incl. From/Subject | `body`, `bodyPreview`, `uniqueBody`, **attachments** | ✅ Least-privilege after P1 fix |

Both scopes are **read-only** and the **narrowest** that still expose the From
field we need. This satisfies data minimisation and Google/Microsoft restricted-
scope expectations. **Do not** widen to `gmail.readonly` / `Mail.Read` /
`.default` — that would break the minimisation justification and the privacy claim.

---

## 3. Pressure-test: the "Subject line" caveat (MEDIUM)

Both scopes return **all headers, including the Subject line** — not just From.
Our code only parses the **sender domain**, but the *scope we hold* technically
permits reading Subject lines (which many users consider content).

Consequence for wording:
- ✅ Literally true & safe: *"We read only your email's **sender** information — never
  the body or attachments."*
- ⚠️ Risky / overclaim: *"We never read **anything but** the sender"* or *"we can't
  see your subjects"* — **false at the scope level.** Don't write these.
- The honest framing is **what we use**, not what the token *could* reach: *"We use
  only the sender domain; we never read message bodies or attachments."*

**Hand-off (low priority):** if we want the stronger "we literally cannot see your
subjects" story later, Engineering would need a server-side filter that requests
`metadataHeaders=From` only (Gmail `format=metadata&metadataHeaders=From`) and an
equivalent `$select=from` on Graph. Worth a note for Phase 2; not a launch blocker.

---

## 4. FINAL — ConsentModal copy (ready to paste)

The engineer fixed two false strings in `ConsentModal` ("100% in your browser";
scope labelled "gmail.readonly") and asked Legal/Design for final wording. Here it
is. Design owns layout; this is the legally-cleared text.

**Heading**
> Connect your inbox — here's exactly what happens

**Body**
> To find which services you use, we ask for **read-only** access to your email's
> **sender information**.
>
> - 🇸🇪 We read your messages' **sender domains** on our EU server in Sweden — used
>   once, then discarded.
> - 📭 We **never read the body of your emails or your attachments**, and we never
>   see your password.
> - 🗄️ We **store nothing** from your inbox. The list of detected services is shown
>   in your browser and matched there.
> - 🔁 You can **revoke our access at any time** from your Google/Microsoft account.

**Scope line (the small print under the OAuth button)**
> Permission requested: Gmail `metadata` / Outlook `Mail.ReadBasic` — read-only,
> headers only. [Learn what this means →]

**What to remove (confirmed false):** "100% in your browser", "100% client-side",
"gmail.readonly", "your email never leaves your device".

---

## 5. FINAL — Privacy Policy "Inbox scan" section (draftable)

> **How the inbox scan works.** When you connect Gmail or Outlook, you grant us
> read-only access limited to email **metadata** (Gmail `gmail.metadata`, Outlook
> `Mail.ReadBasic`). We use this access to read the **sender domain** of your
> messages so we can detect which online services you have accounts with.
>
> The scan runs on our processing server in the **European Union (Sweden,
> Stockholm)**. Your messages' sender headers are read **transiently in memory**,
> the list of detected services is returned to your browser, and **nothing from
> your inbox is stored** on our servers. Your OAuth access token is **ephemeral**
> and is **never stored or logged**. We **never read the body of your emails or
> your attachments**, and we never receive your email password.
>
> **Lawful basis:** your explicit **consent** (GDPR Art. 6(1)(a)), given at the
> connect-inbox step and **withdrawable at any time** by revoking access in your
> Google or Microsoft account. **Matching** detected services against our catalogue
> of alternatives happens **in your browser** (client-side).

*Canonical one-liner (for marketing/landing, mirrors the engineer's wording):*
> *"We read only your email's sender domains — never content or attachments.
> Processing is transient on our EU servers in Sweden 🇸🇪; nothing is stored, and
> your access token is never persisted."*

---

## 6. Still open

1. **Owner — rotate secrets.** `GOOGLE_OAUTH_CLIENT_SECRET` +
   `MICROSOFT_OAUTH_CLIENT_SECRET` in Supabase. Tracked in memory. Confirm whether
   any **user** token was in the leaked payload (would change breach analysis, §1).
2. **Engineer — legacy client-side scanner libs.** `apps/web/src/lib/scanGmail.ts`
   / `outlookScanner.ts` still exist and still claim "100% client-side". Confirm
   **live vs dead code.** If dead → remove (kills a false claim at the source). If
   live on any path → that path needs the same scope + wording treatment, and we
   must say *which* path a given user actually hits.
3. **Engineer — Edge Function request logging.** Confirm `scan-email` writes **no**
   request/header logs, so "No Server Logs" could be truthfully re-added (it was
   dropped in the landing-copy draft pending this).
4. **Profile-mode "zero-knowledge" present tense** — still unresolved from audit
   Finding 3: confirm ZK profile sync is actually live before using present tense.
5. **CMO/Editor + Design** — adopt §4/§5 wording in `ConsentModal`, landing page
   (`index.html` lines in the landing-copy doc), and mirror to `MARKETING_PLAN.md`,
   `manifesto-letter-01.md`, `PROJECT_REPORT.md`.

This closes the legal review of the scan claims. The wording above is the
defensible baseline; deviations should come back to Legal.
