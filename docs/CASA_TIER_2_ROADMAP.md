# CASA_TIER_2_ROADMAP.md

## Google CASA Tier 2 Security Assessment

**Status:** TODO — Must start before scaling to production.  
**Priority:** CRITICAL  
**Owner:** Lead Engineer + Legal/Compliance  
**Budget:** $540–$1,200  
**Timeline:** 4–8 weeks (6 weeks average)

---

## 1. What is CASA Tier 2?

**CASA** = Cloud App Security Assessment  
**Tier 2** = Enhanced assessment for apps using restricted scopes (Gmail metadata, Drive, Admin, etc.)

**Why it matters:**
- ✅ Apps with CASA Tier 2 show "Verified" badge (not "Unverified App" warning).
- ✅ No user cap (without it: capped at 100 test users).
- ✅ Required for HIPAA, FedRAMP, or enterprise deployments.
- ❌ Without it: users see scary warning, abandonment rates spike.

---

## 2. Our Scope Analysis

### What We Use:
- **Gmail API:** `gmail.metadata` scope (RESTRICTED ✅)
- **Outlook/Microsoft Graph:** `Mail.ReadBasic` scope (standard, not restricted)

### Why Gmail is Restricted:
- Can access sender metadata, subject lines, message IDs (but NOT content).
- Even "metadata-only" access requires audit.

### Tier Level:
- **Standard:** OAuth scopes for basic profile/calendar access (no CASA needed).
- **Tier 1:** Drive, Gmail basic (has a self-serve option from Google).
- **Tier 2:** Gmail metadata + advanced scopes (requires third-party lab assessment).
  - **Status for us:** TIER 2 REQUIRED ✅

---

## 3. CASA Tier 2 Assessment Scope

### Areas Google Will Evaluate:

| Area | Focus | Our Status |
| --- | --- | --- |
| **OAuth Security** | PKCE, token handling, scope minimization | ✅ In progress (see OAUTH_FLOW_MIGRATION.md) |
| **Data Security** | Encryption, access controls, RLS | ✅ Zero-knowledge AES-256-GCM |
| **Infrastructure** | Supabase, Edge Functions, Vercel security | ✅ Using Supabase Switzerland |
| **Incident Response** | Data breach protocols, user notification | ⏳ Need formal policy |
| **Logging & Auditing** | No PII in logs, secure access trails | ⏳ Need to remove console.* statements |
| **Dependency Scanning** | npm audit, known vulnerabilities | ⏳ Need CI checks |
| **Third-party Services** | Stripe, Plausible, HIBP, Have I Been Pwned | ✅ Documented in SECURITY.md |

---

## 4. Step-by-Step Execution Plan

### Phase 1: Pre-Assessment (Week 1–2)

**Goal:** Get codebase CASA-ready.

- [ ] **Code audit:** Remove all console.log statements from Edge Functions.
- [ ] **OAuth migration:** Deploy Authorization Code + PKCE (OAUTH_FLOW_MIGRATION.md).
- [ ] **Logging policy:** Document what's logged, where, and for how long.
  - Create `LOGGING_POLICY.md`:
    - No tokens, no PII in Edge Function logs.
    - Logs deleted after 7 days (Supabase default).
    - Errors logged to external service (e.g., Sentry) if critical.
- [ ] **Incident response:** Draft `INCIDENT_RESPONSE_PLAN.md`:
  - Data breach notification (within 72 hours, GDPR requirement).
  - User communication template.
  - Containment steps.
- [ ] **Dependency scan:** Run `npm audit` and document remediation.
  - Add GitHub Actions CI to block merges on audit failures.
- [ ] **Documentation:** Create `CASA_ASSESSMENT_DOCUMENTATION.md`:
  - Architecture diagram (OAuth, Edge Functions, data flow).
  - RLS policies (proof that users can't access each other's data).
  - Encryption practices (AES-256-GCM key derivation).

**Deliverable:** A clean, audit-ready codebase.

### Phase 2: Lab Selection (Week 2–3)

**Goal:** Choose and engage an authorized CASA assessment lab.

**Authorized labs:**
- **Coalfire** — https://www.coalfire.com/  
  - Specializes in cloud security assessments.
  - ~$800–$1,200, 6–8 weeks.
- **Corsec** — https://www.corsec.com/  
  - Cloud and app security focus.
  - ~$600–$1,000, 4–6 weeks.
- **Optiv** — https://www.optiv.com/  
  - Enterprise-grade assessments.
  - ~$1,000–$1,500 (premium tier).

**Selection criteria:**
- Must be listed on [Google's CASA lab list](https://support.google.com/cloud/answer/9863178).
- Must provide detailed report (not just "pass/fail").
- Must have experience with OAuth/SPA apps.

**Action:**
- [ ] Contact 2–3 labs for quote.
- [ ] Compare timeline vs. cost.
- [ ] Sign contract.

**Typical contract includes:**
- Kick-off call (understand your app).
- Code review + scanning.
- Vulnerability findings & remediation.
- Final report generation.
- Appeal/revision period.

### Phase 3: Assessment Execution (Week 3–7)

**Typical CASA Tier 2 timeline:**

| Week | Milestone |
| --- | --- |
| Week 1 | Kick-off; lab receives codebase + documentation. |
| Week 2–3 | Lab performs code review, security scanning, and testing. |
| Week 4 | Lab identifies vulnerabilities (if any). |
| Week 5 | We remediate findings. |
| Week 6 | Lab verifies fixes. |
| Week 7 | Lab delivers final assessment report. |

**What lab will test:**
- ✅ Code repository (GitHub/Codeberg access — read-only).
- ✅ OAuth flow (manual testing of our app).
- ✅ Data handling (tracing metadata through system).
- ✅ RLS policies (Supabase audit).
- ✅ Dependency vulnerabilities (scanning npm packages).
- ✅ Infrastructure (Vercel/Supabase security).
- ✅ Incident response (review of our policy).

### Phase 4: Remediation & Approval (Week 5–8)

**If findings are identified:**
- [ ] Assess severity (critical, high, medium, low).
- [ ] Create tickets for remediation.
- [ ] Fix code/infrastructure.
- [ ] Lab re-tests.
- [ ] Repeat until all findings resolved.

**Typical findings (examples):**
- ❌ "console.log statements expose user data." → Remove them.
- ❌ "RLS policies allow user A to read user B's data." → Strengthen RLS.
- ❌ "JWT expiry too long." → Shorten from 1 year to 24 hours.
- ❌ "npm package X has known CVE." → Update or replace.

**Most common outcome:** 2–5 low/medium findings, fixable in 1–2 weeks.

### Phase 5: Report Submission & Approval (Week 8+)

**Google's approval process:**
- [ ] Lab submits final report to Google.
- [ ] Google reviews & approves (usually 1–2 weeks).
- [ ] You receive CASA Tier 2 certificate (digital).
- [ ] Your OAuth consent screen updated to "Verified App" badge.

**Users now see:**
✅ "digitaleu.me is verified" (not "Unverified App" warning)  
✅ No 100-user limit.  
✅ Increased trust/adoption.

---

## 5. Cost Breakdown

| Item | Estimate | Justification |
| --- | --- | --- |
| **Lab assessment** | $600–$1,200 | Coalfire/Corsec mid-range |
| **Our internal effort** | ~40 hours ($2,000–$4,000) | Code audit, remediations, calls |
| **Tools/services** | $0–$200 | (already have: npm audit, GitHub Actions) |
| **Total** | **$2,600–$5,400** | ~1–2 months total effort |

---

## 6. Success Criteria

- [ ] Lab issues final CASA Tier 2 report ✅ approved by Google.
- [ ] Your OAuth consent screen shows "digitaleu.me is a verified app" badge.
- [ ] No 100-user limit; public release possible.
- [ ] Audit report stored in `research/CASA_TIER_2_REPORT_[DATE].pdf` (secure drive, not Git).
- [ ] CASA expiry date noted (annual renewal if needed).

---

## 7. Post-Assessment Maintenance

### Annual Renewal:
- CASA Tier 2 typically valid for 1 year.
- Plan to repeat assessment annually (or after major code changes).
- Set calendar reminder 3 months before expiry to begin next cycle.

### Ongoing Compliance:
- [ ] Continue running `npm audit` in CI/CD.
- [ ] Keep RLS policies documented.
- [ ] Maintain incident response procedures.
- [ ] Update SECURITY.md if OAuth flow changes.

---

## 8. Timeline & Milestones (Gantt Overview)

```
Week 1–2:   Code audit & docs           ████
Week 2–3:   Lab selection & contract    ████
Week 3–7:   Assessment & remediation    ██████████
Week 8+:    Report approval & release   ████

Total: ~8 weeks from start to production-ready.
```

---

## 9. Blockers & Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Lab finds critical vulnerabilities | Medium | Start remediation immediately; some may delay approval. |
| Lab overbooked (long queue) | Low | Contact labs early; some may expedite for higher fee. |
| OAuth flow not PKCE-ready | HIGH → LOW | Deploy OAUTH_FLOW_MIGRATION.md first. |
| Supabase RLS misconfigured | Medium | Audit RLS policies before assessment. |

---

## 10. Resources

- **Google Cloud App Security Assessment:** https://support.google.com/cloud/answer/9863178
- **Lab Directory:** Search "CASA labs" on Google Cloud docs.
- **Reference:** Docs like AWS SOC 2, Azure security baselines (show auditors what good looks like).

---

## 11. Action Items (Immediate)

- [ ] **This week:** Remove console.log from Edge Functions (BLOCKING).
- [ ] **Next week:** Deploy OAUTH_FLOW_MIGRATION.md (BLOCKING).
- [ ] **Week 2:** Document RLS policies, incident response, logging.
- [ ] **Week 3:** Contact 2–3 labs, request quotes.
- [ ] **Week 3:** Sign contract with selected lab.
- [ ] **Weeks 4–8:** Execute assessment & remediation.

---

**Owner Sign-off Required Before Assessment Begins**

- [ ] Lead Engineer: Approves code readiness.
- [ ] Legal/Compliance: Approves incident response plan.
- [ ] Product: Confirms timeline acceptable for release.

---

**Next:** After CASA approval, proceed to [B2B_ADMIN_CONSENT_GUIDE.md](./B2B_ADMIN_CONSENT_GUIDE.md).
