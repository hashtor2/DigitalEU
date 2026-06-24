# Affiliate Program — Management Hub

> **Single source of truth** for every affiliate/partner relationship at digitaleu.me:
> where to sign up, account status, the real links, commission, and where each link
> is wired into the code. Owned by the **Head of Partnerships** agent
> (`docs/agents/07-partnerships.md`); code changes go to the **Lead Engineer**
> (`docs/agents/05-engineer.md`).
>
> **Rule:** links live in code in exactly ONE place — `packages/shared/src/affiliateLinks.ts`.
> This doc is the human-readable register that mirrors it. When they disagree, fix the code
> to match this doc, then check the box.

Last reviewed: 2026-06-25

---

## 1. How this system works

1. **Find a partner** → add a row to §4 Pipeline with status `prospect`.
2. **Sign up** → use the program URL in §5. Record login location (password manager,
   never here), affiliate ID, commission, and dashboard URL in §3.
3. **Get the link** → paste the real tracking link into §3 *and* into
   `packages/shared/src/affiliateLinks.ts` (the only code location). Set `verified: false`.
4. **Test it** → click it, confirm the partner dashboard registers the click, then set
   `verified: true` and check the box in §3.
5. **Review quarterly** → run the checklist in §6.

**Disclosure (non-negotiable, ADR principle #4):** every affiliate link must be openly
disclosed to users. Coordinate copy with Legal (`06-legal.md`) and Marketer (`02-marketer.md`).

---

## 2. Code architecture (target state)

```
packages/shared/src/affiliateLinks.ts   ← THE source of truth in code (AFFILIATE_LINKS map)
        │
        ├── apps/web      → import { getAffiliateUrl, hasVerifiedAffiliate } from "@digitaleu/shared"
        └── apps/scanner  → same import
```

**Current reality (to be cleaned up — see §7):**
- `apps/web/src/lib/affiliateLinks.ts` is a **stale duplicate** with placeholder Proton
  data and must be removed; `ScannerOnboarding.tsx` should import from `@digitaleu/shared`.
- The `AFFILIATE_LINKS` map currently points all four Proton products at the Mail link
  `SH1mR` — wrong (see §3 for correct links).

---

## 3. Active partners (signed up)

Legend: **CPS** = revenue share on purchase. Link column = exact string that must appear
in `packages/shared/src/affiliateLinks.ts`.

### Proton (RevShare / CPS) — account: ✅ live
Dashboard: Proton Partners portal · all links are `go.getproton.me` short-links.

| Product | id (code) | Commission | Correct link | In code? |
|---|---|---|---|---|
| Proton Mail | `proton-mail` | 30% | `https://go.getproton.me/SH1mR` | ✅ |
| Proton VPN | `proton-vpn` | 40% | `https://go.getproton.me/SH2jp` *(World Cup 70% off, active Jun–Jul 2026)* | ✅ (fixed 2026-06-25) |
| Proton Pass | `proton-pass` | 30% | `https://go.getproton.me/SH1mP` | ✅ (fixed 2026-06-25) |
| Proton Drive | `proton-drive` | 30% | `https://go.getproton.me/SH1mO` | ✅ (fixed 2026-06-25) |

> **Campaign note:** after the World Cup tournament (ends July 2026), switch `proton-vpn`
> back to the default `https://go.getproton.me/SH1mQ`. Alternate promo links are catalogued
> in `docs/affiliate-links.md`.

### pCloud (CPS) — account: ✅ live
| Product | id (code) | Correct link | In code? |
|---|---|---|---|
| pCloud | `pcloud` | `https://partner.pcloud.com/r/82103` | ✅ (fixed 2026-06-25) |

### RepoCloud (CPS) — account: ✅ live
| Product | id (code) | Correct link | In code? |
|---|---|---|---|
| RepoCloud | `repocloud` | `https://repocloud.io/?ref=mde79e5` | ❌ not yet mapped (uses official URL) |

---

## 4. Partner pipeline

Status: `prospect` → `contacted` → `negotiating` → `signed-up` → `live`

| Partner | Category | Country | Status | Commission | Owner action |
|---|---|---|---|---|---|
| Proton | email/vpn/pass/drive | 🇨🇭 | live | 30–40% CPS | fix links in code (§7) |
| pCloud | storage | 🇨🇭 | live | CPS | fix ref id in code (§7) |
| RepoCloud | hosting | 🇪🇺 | live | CPS | map into code (§7) |
| StartMail | email | 🇳🇱 | contacted | — | chase missing link |
| Tuta | email | 🇩🇪 | prospect | — | check program exists / apply |
| Mullvad | vpn/browser | 🇸🇪 | prospect | (Mullvad has no affiliate program — verify) | confirm, else mark `official` |
| Brevo | email mktg | 🇫🇷 | prospect | yes (has program) | apply §5 |
| GetResponse | email mktg | 🇵🇱 | prospect | yes | apply §5 |
| MailerLite | email mktg | 🇱🇹 | prospect | yes | apply §5 |
| Hetzner | hosting | 🇩🇪 | prospect | yes | apply §5 |
| OVHcloud | hosting | 🇫🇷 | prospect | yes | apply §5 |
| Scaleway | hosting | 🇫🇷 | prospect | ? | research |
| Vivaldi | browser | 🇳🇴 | prospect | ? | research |
| Bitpanda | finance | 🇦🇹 | prospect | yes | apply §5 |
| Holidu | travel | 🇩🇪 | prospect | yes | apply §5 |

> The 30 catalog entries flagged `monetization: "affiliate"` in
> `packages/shared/src/alternatives.ts` are **aspirational** until they appear in §3 with a
> real link. Until then their `affiliateUrl` correctly falls back to the official site.

---

## 5. Where to sign up (program application URLs)

Fill the link as you confirm each program. Prefer EU-origin vendors (principle #3).

| Partner | Apply at | Notes |
|---|---|---|
| Proton | (already in — Proton Partners) | ✅ |
| pCloud | https://partner.pcloud.com | ✅ (ref 82103) |
| RepoCloud | https://repocloud.io (affiliate in account settings) | ✅ (ref mde79e5) |
| StartMail | partnerships@startmail.com / their affiliate page | link still missing |
| Brevo | https://www.brevo.com/partners/affiliate/ | EU 🇫🇷 |
| GetResponse | https://www.getresponse.com/affiliate-programs | EU 🇵🇱 |
| MailerLite | https://www.mailerlite.com/affiliate-program | EU 🇱🇹 |
| Hetzner | https://www.hetzner.com (check for referral) | EU 🇩🇪 |
| OVHcloud | https://www.ovhcloud.com/en/partners/ | EU 🇫🇷 |
| Bitpanda | https://www.bitpanda.com/en/affiliate | EU 🇦🇹 |
| Holidu | https://www.holidu.com (partner/affiliate) | EU 🇩🇪 |
| Tuta | (verify program exists) | EU 🇩🇪 |

---

## 6. Quarterly review checklist

- [ ] Every `verified: true` link in code clicks through and registers in the partner dashboard.
- [ ] Expired campaign links rotated (e.g. Proton VPN World Cup → default after July 2026).
- [ ] New `signed-up` partners moved to §3 and mapped in code.
- [ ] No commission has silently changed; update §3 if it has.
- [ ] Disclosure copy still present and accurate (with Legal).
- [ ] Catalog `affiliate`-flagged entries without a real link still fall back to official URL.
- [ ] This doc's "Last reviewed" date bumped.

---

## 7. Cleanup backlog (hand to Lead Engineer)

1. ~~**Fix Proton links** in `packages/shared/src/affiliateLinks.ts`: VPN→`SH2jp`, Pass→`SH1mP`,
   Drive→`SH1mO`.~~ ✅ done 2026-06-25.
2. ~~**Fix pCloud ref**: `r/digitaleu` → `r/82103`.~~ ✅ done 2026-06-25.
3. **Add RepoCloud**: map `repocloud` → `https://repocloud.io/?ref=mde79e5`.
4. **Delete** `apps/web/src/lib/affiliateLinks.ts` (stale duplicate). Repoint
   `apps/web/src/components/ScannerOnboarding.tsx` to `getAffiliateUrl(...)` from `@digitaleu/shared`.
   Preserve the Plausible `trackAffiliateClick`/`trackAffiliateConversion` helpers (move them to
   shared or a `lib/analytics.ts`).
5. **Update agent BLOCK A** in all 8 `docs/agents/*.md`: "Supabase data in Switzerland 🇨🇭"
   → "Sweden (Stockholm, eu-north-1) 🇸🇪" (ADR #26).

---

## 8. Pointers
- `docs/affiliate-links.md` — raw link archive (all Proton promo variants). Keep as backup;
  this hub is the operational view.
- `docs/agents/07-partnerships.md` — the agent persona that owns this program.
- `packages/shared/src/affiliateLinks.ts` — the only code location for links.
- `packages/shared/src/alternatives.ts` — catalog; `monetization`/`affiliateUrl` fields.
