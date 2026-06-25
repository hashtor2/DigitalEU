# Migration Tools — Build Spec (post-scanner)

> Owner: CEO / Chief Strategist. Audience: Lead Engineer (+ Legal for Tool 3).
> Status: proposed, ready to build. Date: 2026-06-25.
> Strategic rationale: the scanner *detects* accounts; these tools let users *act*
> on what's detected. This is the moat that turns digitaleu.me from a comparison
> site into a migration portal (CLAUDE.md §2). Build order is deliberate —
> ship the cheapest, most visible value first.

---

## Context — what already exists

The data model is already most of the way there (`packages/shared/src/types.ts`):

- `DetectedAccount { id, domain, serviceName, status, suggestedAlternativeId }`
- `MigrationStatus = "detected" | "in-progress" | "switched" | "skipped"`
- `DomainMapping { ..., settingsUrl, suggestedAlternativeId }`

So Tools 1 and 2 are **extensions of existing types**, not new subsystems. That's
why they go first.

---

## Tool 1 — Account Action Cards  ⭐ build first

**Purpose:** For each account the scanner detects, give the user direct actions:
change the email on it, delete it, or export their data. Removes the "okay, now
what do I actually do?" gap right after a scan.

**User flow:**
1. Scanner returns detected accounts → dashboard renders one card per account.
2. Each card shows: service name + logo + country flag, the detected domain, the
   suggested EU alternative, and an action row:
   **[ Change email ] [ Delete account ] [ Export data ]**
3. Each button deep-links to the real settings/deletion/export URL for that
   service (new tab). Buttons that have no known URL are hidden, not greyed.
4. Card reflects migration status (detected / in-progress / switched / skipped) —
   shared with Tool 2.

**Data model (extend, don't replace):**
```ts
// add to DomainMapping (packages/shared/src/types.ts)
interface ServiceActions {
  changeEmailUrl?: string;   // existing settingsUrl can seed this
  deleteAccountUrl?: string;
  dataExportUrl?: string;
  difficulty?: "easy" | "medium" | "hard"; // how hard the service makes it
  notes?: string;            // e.g. "deletion requires email confirmation"
}
// DomainMapping gains: actions?: ServiceActions
```

**Technical approach:**
- Pure client-side rendering off scanner output. No backend changes.
- Action URLs live **in the existing catalog/domain-mapping data** (single source
  of truth), not hardcoded in components.
- Reuse existing service-display components (logo + flag) from the design system.

**Effort:** Small. Mostly data entry (URLs) + one card component + the type field.

**Open questions for Lead Engineer:**
- Confirm action URLs belong on `DomainMapping` vs a separate `serviceActions.ts`.
- Link-rot is the real maintenance cost. Worth a CI job that pings these URLs
  and flags 404s? (Cheap insurance, can be a follow-up.)

---

## Tool 2 — Migration Progress Tracker  ⭐ build second

**Purpose:** Turn the list of detected accounts into a to-do list the user works
through. Makes the migration feel finite and achievable. This is the retention
hook — a reason to come back.

**User flow:**
1. Detected accounts shown as a checklist grouped by status.
2. User sets status per account: detected → in-progress → switched / skipped.
3. Progress bar: "7 of 12 services moved." Light gamification.
4. **Guest mode:** state lives in `sessionStorage` only (CLAUDE.md §3, privacy
   default). **Profile mode:** persists, zero-knowledge encrypted before storage.

**Data model:** `MigrationStatus` already exists. Tracker just needs a place to
persist the per-account status map.
- Guest: `sessionStorage`.
- Profile: encrypted client-side, then Supabase (reuse existing zero-knowledge
  path — no plaintext server-side).

**Technical approach:**
- Built directly on Tool 1's cards (status lives on the card, tracker is the
  aggregate view). Build them together; ship Tool 1 first if time forces a split.

**Effort:** Small–medium. Mostly state management + the profile-mode persistence
already exists for other data.

**Open question:** Confirm we can reuse the existing zero-knowledge encryption
helper for the status map, or whether it needs its own envelope.

---

## Tool 3 — GDPR Request Generator  (build third — needs Legal sign-off)

**Purpose:** Generate a ready-to-send **Article 17 (erasure)** or **Article 20
(data portability)** request for any detected service. This is the legal teeth
behind "you own your data" (CLAUDE.md §3) — strongly on-brand, hard for a pure
affiliate site to copy.

**User flow:**
1. From an account card → "Request my data" / "Request deletion."
2. We fill a vetted template with the user's email + the service's privacy/DPO
   contact, with the relevant GDPR article cited and the 1-month response window.
3. Output via `mailto:` (prefilled) and copy-to-clipboard. User sends it from
   their own client — **no PII ever touches our backend.**

**Technical approach:**
- 100% client-side template fill. No backend, no stored PII (on-brand by design).
- DPO/privacy contact per service: start manual for the top ~20 detected
  services, expand later. Store alongside `DomainMapping`.

**Effort:** Small *engineering*. The cost is **Legal**, not code.

**Blocking dependency — questions for Legal & Privacy Counsel:**
- Supply vetted Art. 17 + Art. 20 email templates that hold up across the EU.
- Minimum required content (identity verification, specificity, response-time
  citation)?
- Any liability in us providing legal-adjacent tooling / a disclaimer we must show?

---

## Build order (summary)

| # | Tool                     | Effort      | Blocker        | Ship |
|---|--------------------------|-------------|----------------|------|
| 1 | Account Action Cards     | Small       | none           | now  |
| 2 | Migration Progress Tracker | Small–med | none (reuses #1)| now  |
| 3 | GDPR Request Generator   | Small (eng) | Legal sign-off | after legal |

**Rule:** Tools 1 + 2 ship as a pair the moment the scanner is solid — zero
backend risk, immediate visible value. Tool 3 starts in parallel but waits on
Legal before it goes live.

### Explicitly deferred (not now)
Account-deletion walkthrough guides, email-forwarding/alias setup helper,
subscription-cost audit, breach monitoring on the new address. All good; none
gate on the scanner the way 1–3 do.
