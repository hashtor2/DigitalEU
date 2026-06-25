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
| Mullvad | vpn/browser | 🇸🇪 | dropped | NONE — bans affiliates/paid reviews (policy) | re-tag catalog → `other` |
| Brevo | email mktg | 🇫🇷 | prospect | €5/free + €100/paying (PartnerStack) | apply §5 |
| GetResponse | email mktg | 🇵🇱 | prospect | 40%+ recurring (PartnerStack/CJ) | apply §5 |
| MailerLite | email mktg | 🇱🇹 | prospect | 30% recurring (in-house) | apply §5 |
| Hetzner | hosting | 🇩🇪 | dropped | referral program being DISCONTINUED (links expire 15 Jun 2026) | don't pursue |
| OVHcloud | hosting | 🇫🇷 | prospect | ~$15/sale (CJ) | apply §5 |
| Scaleway | hosting | 🇫🇷 | dropped | NONE — B2B partner program only, no publisher affiliate | re-tag catalog → `other` |
| Vivaldi | browser | 🇳🇴 | dropped | NONE — no publisher program | re-tag catalog → `other` |
| Bitpanda | finance | 🇦🇹 | prospect | up to 20% rev-share (Impact) | apply §5 |
| Holidu | travel | 🇩🇪 | prospect | up to ~15% (Awin) | apply §5 |
| UpCloud | hosting | 🇫🇮 | prospect | up to ~$160/customer (in-house) | apply §5 |
| BunnyCDN | cloud-infra | 🇸🇮 | prospect | $20 or 20% lifetime (in-house) | apply §5 |
| ONLYOFFICE | office | 🇱🇻 | prospect | 18%+ (Rewardful) | apply §5 |
| ClickMeeting | office | 🇵🇱 | prospect | up to 33% (in-house) | apply §5 |
| Internxt | storage | 🇪🇸 | prospect | 30% annual / 15% lifetime (Impact) | apply §5 |
| Simple Analytics | analytics | 🇳🇱 | prospect | 50% first year (customers only) | apply §5 |

> The 30 catalog entries flagged `monetization: "affiliate"` in
> `packages/shared/src/alternatives.ts` are **aspirational** until they appear in §3 with a
> real link. Until then their `affiliateUrl` correctly falls back to the official site.

---

## 5. Where to sign up (verified, 2026-06-25)

Verified by web research 2026-06-25. Prefer EU-origin vendors (principle #3).
Bold = already live in §3.

### 5a. Confirmed programs — apply / live

| Partner | Country | Apply at | Network | Commission |
|---|---|---|---|---|
| **Proton** | 🇨🇭 | https://partners.proton.me/signup/ | in-house | 30–40% new, 30% recurring (100% nonprofits) |
| **pCloud** | 🇨🇭 | https://www.pcloud.com/affiliate.html | CJ + in-house | 20%, 90-day cookie |
| **RepoCloud** | 🇪🇺 | https://repocloud.io (affiliate in account) | in-house | 25% lifetime recurring |
| Tuta | 🇩🇪 | apply via https://tuta.com (no public page) | in-house | 25% recurring, 30-day |
| Brevo | 🇫🇷 | https://www.brevo.com/partners/affiliates/ | PartnerStack | €5/free signup + €100/paying, 90-day |
| GetResponse | 🇵🇱 | https://www.getresponse.com/affiliate-programs | PartnerStack / CJ | 40%+ recurring (up to 60%) |
| MailerLite | 🇱🇹 | https://partners.mailerlite.com/register | in-house | 30% recurring, 45-day |
| Simple Analytics | 🇳🇱 | https://docs.simpleanalytics.com/affiliate | in-house | 50% of first year (existing customers only) |
| OVHcloud | 🇫🇷 | https://us.ovhcloud.com/partner-program/ | CJ | ~$15/sale, 45-day |
| UpCloud | 🇫🇮 | https://upcloud.com/global/affiliate-program/ | in-house | up to ~$160/customer (tiered) |
| BunnyCDN | 🇸🇮 | https://bunny.net/affiliate/ (enable in dashboard) | in-house | $20/referral or 20% lifetime |
| ONLYOFFICE | 🇱🇻 | https://affiliates.onlyoffice.com/registration | Rewardful | 18%+ on sales & renewals |
| ClickMeeting | 🇵🇱 | https://clickmeeting.com/partners/ | in-house | up to 33%, 120-day |
| Internxt | 🇪🇸 | https://internxt.com/affiliates | Impact | 30% annual / 15% lifetime, up to $300 |
| Bitpanda | 🇦🇹 | https://www.bitpanda.com/en/affiliate-programme | Impact | up to 20% revenue-share, 30-day |
| Holidu | 🇩🇪 | https://www.holidu.com/affiliate | Awin (+ Skimlinks/admitad) | up to ~15% (min ~5k visits/mo) |
| StartMail | 🇳🇱 | partnerships@startmail.com | — | contacted; link still missing |

### 5b. Limited — credit-only or B2B reseller (not click-based publisher affiliate)

| Partner | Country | What it actually is |
|---|---|---|
| Pirsch Analytics | 🇩🇪 | referral **credit** only (docs.pirsch.io/affiliate); requires active subscription |
| Threema / Threema Work | 🇨🇭 | B2B **reseller** only (threema.com/en/work/partner-program) |
| Passbolt | 🇱🇺 | **reseller** margin tiers (passbolt.com/reseller) |

### 5c. Confirmed NO affiliate program — re-tag in catalog `monetization: "other"`

These are flagged `affiliate` in `alternatives.ts` but have no joinable program:

- **Plausible** 🇪🇪 — refuses any affiliate/referral on principle
- **Mullvad** (VPN/Browser) 🇸🇪 — explicitly bans affiliates/paid reviews
- **Vivaldi** 🇳🇴 — no publisher program
- **Codeberg** 🇩🇪 — non-profit, donation-based
- **Organic Maps** 🇪🇪 — donation-based
- **Scaleway** 🇫🇷 — B2B partner program only
- **Hetzner** 🇩🇪 — referral program being discontinued (links expire 15 Jun 2026)

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
- `packages/shared/src/alternatives.ts` — software catalog; `monetization`/`affiliateUrl` fields.
- `packages/shared/src/products.ts` — **physical-products catalog** (see §9).

---

## 9. Physical products (resell / dropship)

EU-made hardware we can sell via the **manual-order / dropship** model (customer orders
from us → we order from the maker → maker ships direct to customer). For that we need a
**reseller** program (buy at discount, sell at markup); **affiliate** is the refer-only
fallback. Data lives in code at `packages/shared/src/products.ts`.

> ⚠️ **Crypto wallets are tamper-sensitive.** Trezor/Ledger/BitBox warn buyers against
> unofficial channels. Dropship is only acceptable if the maker ships factory-sealed units
> direct to the customer and we're a listed authorized reseller. Never break a seal.
> Exclude non-EU: OnlyKey (US), Keepser (Andorra), Teracube (US).

### 9a. Best dropship candidates (low/no MOQ, stocked, reseller-ready)

| Product | Country | Reseller sign-up | Dropship? | Affiliate |
|---|---|---|---|---|
| **Tangem** (wallet) | 🇨🇭 | https://tangem.com/en/partnership/ | ✅ no MOQ + free ship | referral, 5 USDT/sale |
| **Cryptosteel** (seed backup) | 🇵🇱 | https://cryptosteel.com/become-a-reseller/ | ✅ drop-ship option | ✅ 10%, 30-day |
| **Token2** (security key) | 🇨🇭 | https://www.token2.com/site/page/resellers-and-distributors | ✅ likely | none |
| **Shelly** (smart-home) | 🇧🇬 | https://www.shelly.com/pages/resellers | ✅ stocked | ✅ ~7% (FlexOffers) |
| **Turris** (router) | 🇨🇿 | sales@turris.com | ✅ stocked SKU | unclear |
| **Olimex** (SBC/boards) | 🇧🇬 | https://www.olimex.com/Distributors/ | ✅ stocked | none |

### 9b. Reseller exists, dropship to confirm by email

| Product | Country | Reseller sign-up | Affiliate |
|---|---|---|---|
| Trezor (wallet) | 🇨🇿 | https://trezor.io/reseller-program | ✅ up to 15% (partners.trezor.io) |
| Ledger (wallet) | 🇫🇷 | https://www.ledger.com/become-a-ledger-reseller | ✅ 10% (affiliate.ledger.com) |
| Nitrokey (security key) | 🇩🇪 | sales@nitrokey.com | ✅ 10% (nitrokey.com/affiliate-program) |
| Nuki (smart lock) | 🇦🇹 | https://pro.nuki.io/en/member-register/ | unclear |
| Mudita (minimalist phone) | 🇵🇱 | https://mudita.com/for-retailers/ | 10% (Kickbooster, campaign-tied) |
| Fairphone (phone) | 🇳🇱 | https://www.fairphone.com/partner-program | refer-a-friend only |
| Cryptotag (seed backup) | 🇳🇱 | https://cryptotag.io/resellers/ | none |
| Spy-Fy (privacy gadgets) | 🇳🇱 | https://spy-fy.com/pages/for-business | none |

### 9c. Built-to-order — promote via affiliate, NOT dropship

| Product | Country | Affiliate / note |
|---|---|---|
| NovaCustom (privacy laptop) | 🇳🇱 | ✅ 5% — https://novacustom.com/clevo-reseller-europe/ |
| TUXEDO (Linux laptop) | 🇩🇪 | reseller B2B only; affiliate unclear |
| BitBox02 (wallet) | 🇨🇭 | ~10-unit MOQ kills dropship; affiliate at bitbox.swiss/affiliates/ |
| Yubico / YubiKey | 🇸🇪 | channel-gated; Amazon Associates only |

**Recommended launch set:** Tangem → Cryptosteel → Token2/Nitrokey → Shelly, then
Trezor/Ledger once verified as authorized reseller.
