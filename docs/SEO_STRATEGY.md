# SEO_STRATEGY.md — digitaleu.me

> **Living document — owned by CMO.** Companion to `docs/MARKETING_PLAN.md`.
> Marketing plan = launch + social + waitlist (short term). This doc = the
> **durable organic-search engine** (Phase 2 catalog + guides). Long-form briefs
> here are handed to the **Editor/Writer**; technical asks go to **Lead Engineer**;
> every privacy claim is gated by **Legal & Privacy Counsel**.
>
> Status: **v0.1 — DRAFT** · Last updated: 2026-06-25

---

## 0. The thesis (read first)

We already own the single most valuable SEO asset in this space and we're not
using it: **190 curated European alternatives across 18 categories**, each tagged
with the Big Tech product it `replaces` (`packages/shared/src/alternatives.ts`).

That `replaces` field maps 1:1 onto the **highest commercial-intent queries that
exist** in our market — "Gmail alternatives", "Google Analytics alternative",
"Dropbox alternative Europe". Someone typing those is *already trying to switch*.
That is the exact moment our affiliate funnel monetizes.

**SEO is our lowest-CAC channel and it compounds.** Social (the marketing plan)
is a launch spike; the catalog is an annuity. A ranked "Gmail alternatives" page
earns qualified, switch-intent traffic every month for years at ~zero marginal cost.

**The strategy in one line:** turn the catalog into three programmatic page types
(switch-intent · category hub · service profile), anchor them with a small set of
flagship editorial guides, and make all of it crawlable.

> ⚠️ **#1 blocker before any of this ranks → §6.** We are a client-rendered Vite
> SPA. Google can render JS but does it slowly, partially, and unreliably for
> 200+ thin-on-load pages. **No prerendering/SSR = no rankings.** This is a Lead
> Engineer dependency that gates the entire channel. Settle it first.

---

## 1. Keyword architecture (intent-first)

We organise around **search intent**, not topic. Three intent tiers, mapped to
page types and to where the user is in the funnel.

| Tier | Intent | Example queries | Page type | Funnel role |
| --- | --- | --- | --- | --- |
| **1. Switch-intent** 🔥 | "I want to replace X" | `gmail alternatives`, `google analytics alternative`, `dropbox alternative europe`, `nordvpn alternative` | **Switch page** (`/switch/:product`) | **Money page** — direct affiliate intent |
| **2. Category / discovery** | "best European X" | `best european email provider`, `private vpn europe`, `gdpr compliant analytics`, `most secure browser 2026` | **Category hub** (`/directory/:category`) | Mid-funnel, captures the comparison shopper |
| **3. Brand / evaluation** | "is X any good / safe" | `proton mail review`, `tuta vs proton`, `is mullvad safe`, `pirsch analytics review` | **Service profile** (`/directory/:id`) + **head-to-head guides** | Bottom-funnel, last click before signup |

**Plus the editorial layer** (informational / top-of-funnel, links down into all
three tiers): the **browser-security guide**, "how to de-Google your life",
"why move your data to Europe", news commentary.

### The keyword goldmine, ranked by our catalog depth × intent

Pulled from the actual `replaces` targets in the catalog (count = # of EU options
we can already list, which is also our content moat — thin SERPs we can beat):

| Switch-page target | Our options | Why prioritise | Affiliate? |
| --- | --- | --- | --- |
| **Gmail** | 8 | Core funnel + scanner ties directly to email | ✅ Proton, Tuta |
| **Google Analytics** | 6 | Huge volume, weak EU SERPs, B2B (Phase 3) seed | ✅ Plausible, Pirsch |
| **Dropbox** | 7 | High intent, clear EU winners | ✅ Proton Drive, others |
| **Google Drive** | 5 | Same cluster as Dropbox | ✅ |
| **WhatsApp** | 5 | Massive volume, Signal/EU messengers | partial |
| **NordVPN / VPN** | 2+ | Strong commercial intent, high commissions | ✅ Mullvad, Proton VPN |
| **Google Chrome** | 6 | Feeds the flagship browser guide | mixed |
| **Google Search** | 5 | "private search engine" — high volume | ✅ |
| **Slack / Teams / Zoom** | 5–6 each | B2B-leaning (Phase 3 seed), good volume | partial |
| **GitHub** | 5 | Developer audience, Codeberg dogfooding story | ✅/editorial |
| **Mailchimp** | 4 | B2B/marketer intent, affiliate-rich (Brevo etc.) | ✅ |

> **Read:** rows that are both ✅-affiliate **and** B2C are the launch wave
> (email, VPN, cloud storage, search, browser). Analytics/Slack/Teams/GitHub are
> **Phase-3 B2B seeds** — publish them, but they're not the consumer launch.

### Long-tail modifiers to template across pages
`... europe` · `... eu` · `... gdpr` · `... open source` · `... private` ·
`... free` · `... 2026` · `... no us cloud act` · `... self hosted`.
These are cheap wins — bake them into H2s/FAQ, don't build separate pages.

---

## 2. URL & page architecture

Aligns with the IA already shipped (`docs/IA_NAV_RESTRUCTURE.md`): catalog lives
under `/directory`, guides under `/guides`.

```
/switch/:product        → Switch-intent page   (NEW page type — the money pages)
                          e.g. /switch/gmail, /switch/google-analytics
/directory              → Catalog index (all 18 categories, filterable)
/directory/:category    → Category hub          e.g. /directory/email
/directory/:id          → Service profile       e.g. /directory/proton-mail
/guides                 → Guides index
/guides/:slug           → Editorial guide       e.g. /guides/secure-browser
```

**Internal linking model (this is where most of the ranking power comes from):**
- Every **service profile** links up to its **category hub** and to every
  **switch page** whose `replaces` it satisfies.
- Every **switch page** links down to the 3–8 profiles that replace that product,
  and across to the relevant **category hub** and **guide**.
- Every **guide** links to the switch pages + profiles it mentions.
- The scanner's results screen deep-links each detected service →
  `/switch/:product`. **This is the highest-converting internal link we have** —
  the user just *saw* they use Gmail; hand them the switch page.

---

## 3. Programmatic SEO — generate, don't hand-write 200 pages

We have structured data + the page-template fields already exist on the
`Alternative` type (`longDescription`, `features`, `pricing`, `dataLocation`,
`relatedGuides`). So:

- **Switch pages** and **category hubs** are **generated** from the catalog —
  one React route + template, data-driven. ~50 switch pages + 18 hubs from data
  we already have.
- **Service profiles** are generated too, but quality scales with how many have
  `longDescription`/`features`/`pricing` filled in. Today only a few do (e.g.
  Plausible). **Content gap = the real work** (→ Editor + Research).

> ⚠️ **Thin-content risk.** Google penalises mass auto-generated near-duplicate
> pages. Mitigation: ship switch pages + hubs first (genuinely useful, list-based,
> low duplication risk), and only publish a service profile once it has a real
> `longDescription` + ≥4 `features` + `pricing` + `dataLocation`. **No empty
> stubs indexed.** Use `noindex` until a profile meets the bar.

**Prioritisation for filling profile content (Research/Editor handoff):**
1. Affiliate partners first — Proton (Mail/VPN/Drive), Tuta, Mullvad. Revenue.
2. Then the EU winners in launch-wave categories (email, VPN, cloud, search, browser).
3. B2B-seed categories (analytics, project-mgmt, cloud-infra) as Phase-3 warms up.

---

## 4. Priority content roadmap (what ships, in order)

Sequenced by **intent × affiliate revenue × our content moat × effort**.

### Wave 1 — Flagship + money pages (launch alongside Phase 2)
1. **Browser-security guide** `/guides/secure-browser` — *flagship asset*
   (CLAUDE.md §7 mandates it). Pillar page; ranks for "most secure/private
   browser 2026", links to every browser profile + the VPN switch pages.
2. **`/switch/gmail`** — ties to the scanner; our strongest funnel story.
3. **`/switch/whatsapp`** — highest consumer volume; Signal/EU messengers.
4. **Email category hub** `/directory/email` — "best European email provider".
5. **Profiles for affiliate partners** — Proton Mail, Proton VPN, Tuta, Mullvad
   (full content, since these monetise).

### Wave 2 — Broaden the switch-intent net
6. `/switch/dropbox` + `/switch/google-drive` (cloud-storage hub).
7. `/switch/google-search` + private-search hub.
8. `/switch/nordvpn` + VPN hub ("European VPN").
9. Head-to-head guides: **Proton vs Tuta**, **Mullvad vs NordVPN**,
   **Signal vs WhatsApp** (bottom-funnel, very high convert).

### Wave 3 — B2B seeds (warming for Phase 3)
10. `/switch/google-analytics`, `/switch/slack`, `/switch/github` (24 analytics
    options is a moat almost nobody else has — own "GDPR-compliant analytics").

> Coordinate the long-form pieces (1, 9) with **Editor/Writer**. Switch pages and
> hubs are short, templated, CMO-owned copy.

---

## 5. On-page SEO spec (apply to every catalog page)

A checklist the Editor and Engineer build against:

- **Title tag:** `<Product> alternatives — European & private | digitaleu.me`
  (switch pages) / `<Service> review: European <category> | digitaleu.me`.
- **One H1**, keyword-matched, human (not stuffed).
- **Meta description** with the query + a benefit + soft CTA (~150 chars).
- **Structured data (JSON-LD):** `BreadcrumbList` everywhere; `FAQPage` on pages
  with an FAQ block; `ItemList` on switch/hub pages; `Review`/`Product` only when
  we genuinely have a verdict (don't fake `aggregateRating`).
- **FAQ block** on every switch page — captures long-tail + earns FAQ rich results.
  ("Is there a free European alternative to X?" "Is it GDPR-compliant?" "Where is
  the data stored?")
- **Country flags + `dataLocation`** surfaced on-page — unique, on-brand, and a
  ranking-relevant differentiator competitors don't show.
- **Affiliate disclosure** visible near every affiliate link (compliance **and**
  trust — see Marketing Plan §3, §10). Non-negotiable, on every monetised page.
- **Canonical tags** to avoid switch-page vs profile cannibalisation.
- **Image alt text**, lazy-loaded logos, fast LCP (we're already a light stack).
- **No price in copy** while pricing is parked (Marketing Plan §0). `pricing`
  field can show provider pricing; do **not** state our €5/€9.99 publicly yet.

> ⚠️ **Legal gate:** any sentence asserting a provider's privacy property
> ("zero-knowledge", "no logs", "data never leaves the EU") must be sourced and
> cleared. We sell trust — one unverifiable claim on a privacy forum's radar costs
> us the brand. Research sources it; Legal signs off.

---

## 6. Technical SEO — the gating dependency (→ Lead Engineer)

**This decides whether any of the above ranks. Resolve before content scales.**

1. **Rendering — THE blocker.** Vite + React 19 = client-side rendering. 200 pages
   that are empty until JS runs will index poorly or not at all. Options, in order
   of preference for our stack:
   - **Prerendering / SSG** at build time for catalog + guide routes (e.g.
     `vite-plugin-ssr`/`vike`, or a prerender step). Data is static → SSG fits
     perfectly. **Recommended.**
   - Full SSR only if we later need it (heavier).
   - *Question for Engineering:* can we statically pre-render the `/switch/*`,
     `/directory/*`, `/guides/*` routes at build, keeping the app SPA elsewhere?
2. **`sitemap.xml`** — auto-generated from the catalog + guide list, submitted to
   Google/Bing Search Console.
3. **`robots.txt`** — allow catalog/guides; `noindex` thin/stub profiles.
4. **Hosting note:** Vercel is under sovereignty review (CLAUDE.md §6). Prerender
   + edge caching is portable to Scaleway/Clever Cloud if we migrate — **build the
   SEO layer host-agnostic** so the hosting decision doesn't block it.
5. **Core Web Vitals:** already light; protect LCP as we add logos/images.
6. **i18n + hreflang:** English first (default). When we expand languages
   (CLAUDE.md §7), localized catalog pages with `hreflang` are a *massive* second
   SEO surface (one "Gmail alternatives" page per EU language). Build the URL
   structure i18n-ready now; don't translate yet.

---

## 7. Content brief template (hand to Editor/Research)

Reusable spec. Filled examples in §8.

```
PAGE: <route>
TARGET QUERY (primary): <keyword>  | SECONDARY: <2–4 keywords>
INTENT TIER: 1 switch / 2 category / 3 brand
TITLE TAG / META DESC: <drafts>
H1: <draft>
SECTIONS (H2s):
  - <outline>
WORD COUNT: <range>
INTERNAL LINKS OUT: <pages>
AFFILIATE LINKS: <which, + disclosure placement>
JSON-LD: <types>
FACT-CHECK / LEGAL GATE: <claims needing sign-off>
DATA SOURCE: <catalog ids / research doc>
```

---

## 8. Two worked briefs (ready to hand off)

### Brief A — Switch page: `/switch/gmail`

```
PAGE: /switch/gmail
PRIMARY: "gmail alternatives"  SECONDARY: "private email instead of gmail",
  "european email provider", "gmail alternative gdpr", "leave gmail 2026"
INTENT: Tier 1 (money page)
TITLE: Gmail alternatives — private, European email | digitaleu.me
META: Switching from Gmail? Compare private, GDPR-friendly European email
  providers — Proton, Tuta and more. See what fits and switch in minutes.
H1: The best European alternatives to Gmail
SECTIONS:
  - Why people leave Gmail (data mining, US CLOUD Act, no E2E by default) — calm,
    not crusading (Marketing Plan §2 narrative spine)
  - The European options at a glance (ItemList: the 8 catalog `replaces:Gmail`
    entries, with country flag + dataLocation + 1-line)
  - Proton Mail vs Tuta — quick comparison table (links to head-to-head guide)
  - How to actually switch (3 steps; soft link to the inbox scanner — "see which
    accounts use your Gmail")
  - FAQ: free option? GDPR? can I keep my address? is migration hard?
WORD COUNT: 900–1,300
INTERNAL LINKS: /directory/email, /directory/proton-mail, /directory/tuta,
  /guides/proton-vs-tuta, scanner CTA
AFFILIATE: Proton + Tuta links, disclosure banner above the options list
JSON-LD: BreadcrumbList, ItemList, FAQPage
LEGAL GATE: "no E2E by default" (Gmail claim), each provider's encryption claim
DATA SOURCE: alternatives.ts where replaces includes "Gmail"
```

### Brief B — Flagship guide: `/guides/secure-browser`

```
PAGE: /guides/secure-browser
PRIMARY: "most secure browser 2026"  SECONDARY: "most private browser",
  "secure browser europe", "chrome privacy alternative", "best browser privacy"
INTENT: Tier 2/editorial flagship (pillar page — CLAUDE.md §7)
TITLE: The most private & secure browser in 2026 — a European guide | digitaleu.me
META: An honest, tested comparison of browsers on privacy, security and origin —
  and which European-friendly browser we recommend.
H1: Which browser actually protects your privacy in 2026?
SECTIONS:
  - What "secure & private" really means (telemetry, fingerprinting, origin,
    update cadence, who profits from your data)
  - The contenders compared (table: privacy / security / origin / open-source /
    based-on-Chromium?)
  - Our recommendation + honest trade-offs (no overclaiming)
  - Harden whatever you use (settings checklist) — utility = links + shares
  - Pair it with a VPN (cross-link to /switch/nordvpn + Mullvad profile)
WORD COUNT: 2,000–3,000 (pillar)
INTERNAL LINKS: browser profiles in catalog, VPN switch pages + hubs
AFFILIATE: only where genuine (e.g. Mullvad); disclosure up top; editorial honesty
  explicitly stated ("we recommend on merit, not commission" — Marketing Plan §3)
JSON-LD: BreadcrumbList, FAQPage
LEGAL/FACT-CHECK: every per-browser security claim sourced (→ Research + Legal);
  this page WILL be scrutinised on privacy forums
DATA SOURCE: alternatives.ts category "browser", research doc, Research agent
HANDOFF: Editor/Writer writes long-form; CMO provides this brief + keyword map
```

---

## 9. Measurement

| Metric | Why | Where |
| --- | --- | --- |
| Organic impressions/clicks per query cluster | Is the catalog earning intent? | Google Search Console |
| Ranking position for the §1 priority queries | The leading indicator | Search Console |
| Indexed pages (vs published) | Catches the SPA/render blocker early | Search Console coverage |
| Organic → affiliate-click rate per switch page | Does ranked traffic monetise? | Plausible goals + UTM |
| Organic → scanner start / waitlist | SEO feeding the core funnel | Plausible |
| Pages with full profile content (vs stubs) | Content-debt burn-down | Repo / catalog audit |

> Plausible is cookieless and doesn't track keywords — pair it with **Google
> Search Console** (free, no cookies set on our site) for query data. GSC is a
> measurement tool, not a tracker on our users — clean under our principles.

---

## 10. Handoffs this strategy creates

| To | Ask |
| --- | --- |
| **Lead Engineer** | Prerender/SSG for `/switch`, `/directory`, `/guides` routes; sitemap.xml + robots.txt; i18n-ready URL structure; host-agnostic build (§6). **Gating dependency.** |
| **Editor/Writer** | Long-form: browser-security guide + head-to-head comparison guides (Brief B + §4 wave 2). |
| **Research/Analyst** | Fill `longDescription`/`features`/`pricing`/`dataLocation` for affiliate partners first, then launch-wave winners (§3); source every privacy claim. |
| **Legal & Privacy** | Sign off per-provider privacy claims before publish (§5, §8). |
| **Head of Partnerships** | Real affiliate URLs — many catalog entries still point to `url`/Google search, not tracked links (`affiliateLinks.ts`). Switch pages can't monetise without them. |
| **Head of Design/UX** | Switch-page + profile templates (flag, dataLocation, disclosure, comparison table) on the unified European Digital system (ADR #25). |

---

## 11. Changelog

| Date | Change | By |
| --- | --- | --- |
| 2026-06-25 | v0.1 drafted. Keyword architecture (3 intent tiers from catalog `replaces` data), URL/page model, programmatic-SEO plan, priority roadmap, on-page spec, technical-SEO gate (SPA rendering), 2 worked content briefs, measurement, handoffs. | CMO |
