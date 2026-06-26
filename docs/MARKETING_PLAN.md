# MARKETING_PLAN.md — digitaleu.me

> **Living document — owned by CMO.** This is the authoritative marketing context,
> loaded alongside `CLAUDE.md`. It preserves direction across sessions and machines.
> **Keep it current.** Every change to strategy, cadence, or channel mix goes in the
> changelog (§12). Copy and long-form briefs link out to the Editor/Writer.
>
> Status: **v0.1 — DRAFT, iterating** · Last updated: 2026-06-23

---

## 0. The situation right now (read first)

| Signal | Reality | Implication |
| --- | --- | --- |
| **Launch window** | < 1 month | Stramt. Prioritize waitlist capture over everything else. |
| **Capacity** | 4–7 h/week, solo | Batch-produce; automate scheduling; protect time for real conversation. |
| **Budget** | Organic now, small ad tests *after* launch | Earn trust first, pay for reach later only where it converts. |
| **Automation stance** | Automate *planning*, never *conversations* | Schedulers for broadcast; humans for forums/replies. Correct for this audience. |
| **🚨 Blocker** | Waitlist signup form not live yet | Nothing on Reddit/Privacy Guides posts until this ships. See §7. |

**Primary objective (this sprint):** Get people into the **live beta of the scanner now**,
and capture a **waitlist** for the open launch (~4 weeks out) from those not ready to test.
**Primary KPI:** Confirmed (double-opt-in) signups — beta testers + waitlist — attributed by source.

**🔑 The beta changes the game:** We have a *working product* people can try today. Privacy
audiences respond far better to "try this tool and find the flaws" than to "join a waitlist."
The forum feedback angle (§3) is now 100% genuine.

**📧 Gmail is the early-access on-ramp — and the beta is GATED:** the scanner supports **Gmail
first**, and (Google "Testing" mode) it only works for testers the founder has **manually
approved by email**. So the flow is: *request access with your Gmail → founder approves → scanner
works.* **Framing judo:** being on Gmail isn't a contradiction with our message — it's *exactly
who we're for*. "Still on Gmail? Good. That's the point."

**🧮 Capacity constraint (drives the whole campaign):** Google Testing mode caps test users
(~100). **We cannot mass-acquire into the beta.** Therefore:
- Forum posts are an *honest, limited "help me test"* ask — real scarcity, never fake FOMO.
- The **waitlist is the overflow capture** and becomes the larger list.
- This de-risks traffic: we're inviting ~100 testers + building a waitlist, not converting thousands.
*(⚠️ Engineering/Legal: confirm the test-user cap and whether/when we move to Google
restricted-scope/CASA verification to lift it before open launch.)*

**💶 Pricing — do NOT mention price publicly yet** (founder decision, 2026-06-23). Beta is free;
the pricing model will be communicated openly once locked. (Internal note: €9.99 vs documented
€5 is unresolved — parked, CLAUDE.md unchanged until decided. Not a marketing input right now.)

**🏢 B2B seed:** The scanner doubles as a sales entry point toward businesses wanting to move
from a US to an EU tech stack (Phase 3). We add one soft "for business" capture now — low effort,
free Phase-3 lead capture while we have attention.

---

## 1. Who we're talking to

**Core audience:** Privacy-conscious Europeans who already feel the unease about Big Tech
and are *one nudge away* from acting — but find migration overwhelming. They are technically
literate enough to care, not technical enough to self-host. They congregate on Reddit,
Mastodon/Lemmy, Privacy Guides, and follow EU-sovereignty news.

**Secondary (warming up for Phase 2/3):** EU-tech enthusiasts, "Buy European" movement,
and eventually B2B/sovereignty buyers (not targeted yet — but don't say anything now that
contradicts that future).

**What moves them:** sovereignty, control, "own your data," distrust of surveillance
capitalism, EU pride. **What repels them:** marketing speak, dark patterns, unverifiable
privacy claims, hidden affiliate motives.

---

## 2. Positioning & message (the spine)

**Narrative spine (founder, 2026-06-23):** The times are changing. We haven't fully grasped how
important our data is — or that Europe needs to take back its own data. **But we are not
fanatics.** We're not the angry, ideological privacy camp. We're pragmatic enablers: we simply
build the tools that make taking control *easier*. This "calm, not crusading" tone is what makes
us approachable to ordinary people, not just activists. Every piece of copy keeps this register.


**One-liner (working):** *"Move your digital life to Europe — privately, and without the headache."*

**The promise:** We make leaving Big Tech *easy* (inbox scanner → see what to switch →
autofill your new address everywhere) while being radically honest about how we make money
and how we protect your data.

**Three proof pillars** (every channel reinforces these):
1. **Privacy is the product.** The inbox scan runs **100% in your browser.** Your private access token for your inbox **never leaves your device** and is never stored on our servers. You connect directly to your email provider, and the analysis happens locally. We see none of it. All other data lives, encrypted, in Switzerland 🇨🇭.
2. **European-first, and we mean it.** We use EU providers ourselves (dogfooding), not just
   recommend them.
3. **Radically honest business model.** Free if you sign up with a partner via our affiliate
   link, or €5 one-time. We tell you exactly which links pay us. We sell trust, not the
   highest commission.

> ⚠️ **Legal gate:** Every concrete privacy claim above ("never leaves your device",
> "zero-knowledge", "data in Switzerland") must be verified by Legal & Privacy Counsel before
> it appears in public copy. On privacy forums, every claim gets fact-checked. One overstatement
> we can't back = permanent credibility loss.

---

## 3. The two objections we lead with (not hide)

Privacy audiences will surface these in seconds. We get there first — that's the whole strategy.

**Objection A — "You're just a Proton affiliate cashing in."**
→ *Response:* Yes, affiliate links fund this. We disclose every one. The catalog is broad and
editorially honest, and there's always a €5 no-affiliate path. (Reinforces pillar 3.)

**Objection B — "Why would I give YOU OAuth access to my inbox?"**
→ *Response:* You're right to ask. The answer is simple: **we never get your inbox access token.** The entire scan runs locally in *your browser*. Your private token is sent directly from your device to Google/Microsoft and is never seen by or stored on our servers. We've engineered it so we are technically unable to see your data. This is our core security promise.
(Reinforces pillar 1. This is our single hardest objection — answer it proactively, every time.)

---

## 4. Channel playbook

Accounts (from `research/Social media accounts.txt`):
X `@digitaleume` · Substack `@digitaleurope` · Bluesky `digitaleu.me` ·
Reddit `u/DigitalEUme` · Email `info@digitaleu.me` · Site `digitaleu.me`

| Channel | Role | Cadence | Automate? | Owner |
| --- | --- | --- | --- | --- |
| **Reddit** (r/BuyFromEU, r/degoogle, r/privacy, r/europrivacy) | Launch leads + credibility | Campaign posts (manual, timed) + ongoing real participation | ❌ Never | CMO + you |
| **Privacy Guides forum** | High-intent credibility | 1 launch thread + replies | ❌ Never | CMO + you |
| **Bluesky** `digitaleu.me` | Primary "always-on" home — friendliest to new privacy projects | 4–5×/week | ✅ Schedule broadcast, manual replies | CMO |
| **X** `@digitaleume` | Mirror + reach | 3–5×/week | ✅ Schedule (note: X API is paid) | CMO |
| **Mastodon/Lemmy** (fediverse) | Ideological home base (EU/anti-BigTech) | 3–4×/week + participate | ✅ Schedule broadcast, manual replies | CMO |
| **Substack** `@digitaleurope` | Long-form authority (public blog) | 1 post / 2 weeks to start | Partial | **Editor/Writer** (hand off) |
| **Owned waitlist** (Supabase, Zürich) | The critical asset we control | Launch + milestone emails | ✅ | CMO |

> **List home (✅ decided):** Waitlist is captured & owned in **Supabase (Zürich)** — EU,
> full UTM attribution, on-brand. **Substack** hosts public long-form only (US, low-risk use).
> Sending the launch email = import to Substack or a small EU ESP (open sub-item, §11).

**Per-channel notes**

- **Reddit & Privacy Guides — the rules:** No automation, ever. Account must be warmed up
  (real comments, karma) before any link — 0-karma + link = instant ban/shadowban. Lead with a
  *feedback ask*, not "join my waitlist"; the waitlist is the soft CTA inside the post. Full
  affiliate disclosure at the top. Start soft (**r/BuyFromEU** 🔥 — on-brand, exploding right
  now; **r/degoogle**), save **r/privacy for last** (strictest on self-promo).
- **Bluesky = our anchor.** Most forgiving of new projects, growing privacy/tech crowd, free API.
  Make this the channel we post natively and engage on most.
- **Fediverse (Mastodon/Lemmy):** Perfect ideological match, smaller scale. Using an
  open-source EU scheduler to post here is itself on-message.
- **X:** Lower trust with our core audience, but reach + discoverability. Mirror Bluesky;
  don't over-invest. (API access is paid — may schedule manually if cost isn't justified yet.)
- **Substack:** Long-form is the Editor/Writer's lane. CMO provides briefs; Editor writes.

---

## 5. Content pillars (the always-on engine)

Rotate these across Bluesky/X/Fediverse so we're never "selling," always useful:

1. **EU Tech Spotlight** — one European alternative per week (Proton, Tuta, Mullvad, …):
   what it does, who's behind it, why it beats the US default. *(Doubles as Phase 2 catalog seed.)*
2. **Big Tech Reality Check** — react to privacy news, breaches, EU regulation (DMA/GDPR),
   sovereignty stories. Timely, shareable.
3. **Build in Public** — the honest product journey, design decisions, even our own
   "dogfooding" struggles. Privacy folks reward transparency and root for indie builders.
4. **Practical Migration Tips** — bite-size "how to switch X" guides. SEO + utility.
   *(Feeds the browser-security guide and Phase 2 comparison content.)*

**Ratio of thumb:** ~70% value (pillars 1/2/4), ~20% build-in-public, ~10% direct product/CTA.
Privacy audiences tune out anything that smells like >10% selling.

---

## 6. Cadence & weekly rhythm (for 4–7 h/week)

A repeatable weekly block so it survives busy weeks:

- **Mon (1–2h) — Batch & schedule:** write the week's Bluesky/X/Fediverse posts, queue them
  in the scheduler. One pillar-1 + one pillar-2/4 + one build-in-public.
- **Wed (30–60min) — Engage:** real replies on Bluesky/Fediverse, comment in target subreddits
  (no links — building standing).
- **Fri (30–60min) — Engage + monitor:** more participation; check Plausible/waitlist numbers;
  note what landed.
- **Campaign posts (Reddit/PG):** scheduled into the launch sprint (§7), done manually at
  optimal times, then actively replied to for 24–48h (the comments are where trust is won).
- **Substack:** every 2 weeks, briefed to Editor.

> Rule: scheduling is automated; **every reply and comment is written by a human, in real time.**

---

## 7. The < 1 month launch sprint

Dates are relative to "now" (2026-06-23). Fill in real dates once launch date is fixed.

### Week 1 — Foundation (no public posting yet)
- [ ] 🚨 **Waitlist form LIVE** (brief already handed to Lead Engineer): 1 email field,
      double-opt-in via `info@digitaleu.me`, Supabase (Zürich) storage, honeypot (no reCAPTCHA),
      cookieless, **UTM `source` capture + Plausible goal event**. *This gates the whole sprint.*
- [ ] **Legal sign-off** on consent text + the three privacy claims (§2).
- [ ] **Warm up `u/DigitalEUme`** — 5–7 days of genuine comments in target subs; build karma.
- [ ] Pick a **scheduler** (§8) and connect Bluesky + Mastodon (+ X if justified).
- [ ] CMO drafts all launch copy: waitlist landing copy, r/BuyFromEU post (2–3 title variants),
      Privacy Guides thread, first 2 weeks of social posts.

### Week 2 — Soft launch (warm channels)
- [ ] Turn on **always-on social** (pillars start flowing on Bluesky/X/Fediverse).
- [ ] **r/BuyFromEU** + **r/degoogle** posts (feedback angle, full disclosure, UTM links).
      Reply actively for 48h.
- [ ] **Privacy Guides forum** thread with affiliate disclosure up top.
- [ ] Substack: kickoff post (briefed to Editor) — establishes the "why."

### Week 3 — Scale what worked
- [ ] Read attribution (which source converts) → double down.
- [ ] **r/privacy** post — now with karma + a message proven in softer rooms.
- [ ] Mirror best-performing threads to Bluesky/X as standalone posts.
- [ ] First waitlist email to confirmed signups (value, not just "we launched").

### Week 4 — Launch + convert
- [ ] **Launch announcement** across all channels (coordinated, scheduled).
- [ ] Activate waitlist: launch email with the clear FREE-via-partner vs €5 choice.
- [ ] Begin small **paid test budgets** (Reddit/Mastodon promo) only on the angle that already
      converted organically.
- [ ] Retro: what to keep, kill, scale → update this doc (§12).

---

## 8. Automation & tooling (EU-first)

**Principle:** automate *broadcast scheduling* only. All replies, comments, and forum
participation are manual and human. Tools should be EU/open-source where possible — it's
on-brand and a story we can tell.

**Scheduler — ✅ DECIDED: Postiz** (open-source, self-hostable). Supports Bluesky/Mastodon/X.
Most on-brand — we dogfood open-source, EU-friendly tooling, and it's a story we can tell.
Setup task lands in Week 1. *(Rejected: Buffer/Hootsuite/Later — all US, off-brand.)*

**Notes / caveats:**
- **X API is paid** (~$100/mo basic tier) for scheduling/posting via tools — may not be worth it
  pre-launch; consider posting X manually until reach justifies the cost.
- **Bluesky + Mastodon APIs are free** — automate these freely.
- **Reddit & Privacy Guides: never via API/scheduler.** Manual only.
- **Email (waitlist):** needs an EU-friendly ESP for double-opt-in + broadcasts. Candidates to
  evaluate (Legal + Engineering): self-host vs EU providers. *(Open item — see §11.)*
- **Analytics:** Plausible (already chosen — EU, cookieless). Track waitlist goal + UTM sources.

---

## 9. Metrics & KPIs

**North star (this sprint):** confirmed waitlist signups.

| Metric | Why | Where |
| --- | --- | --- |
| Confirmed signups (by `source`/UTM) | The asset + tells us which channel works | Supabase + Plausible |
| Signup conversion rate per source | Where to double down / pour ad budget later | Plausible goals |
| Forum post reception (upvotes, sentiment, saves) | Credibility signal, not vanity | Manual |
| Bluesky/Fediverse follower growth + engagement rate | Always-on channel health | Native + scheduler |
| Substack subscribers | Owned long-form audience | Substack |

Vanity metrics (raw impressions, follower counts in isolation) are deprioritized. We optimize
for *qualified, opted-in* humans.

---

## 10. Brand & compliance guardrails (non-negotiable)

- **No dark patterns.** No fake scarcity, no pre-ticked consent, no guilt-trip unsubscribes.
- **GDPR-clean by default.** Cookieless analytics, double-opt-in, data minimization, clear
  privacy notice at every collection point.
- **Affiliate honesty.** Disclose every affiliate link, every time. Always show the €5
  non-affiliate path.
- **Never overpromise on privacy.** If Legal hasn't cleared a claim, it doesn't go public.
- **Respond in the user's language.** English default; expand per i18n roadmap after MVP.

---

## 11. Open items / to decide

- [ ] **Launch date** — fix it; convert §7's relative weeks to real dates.
- [ ] **Sending waitlist email at launch** — we *capture* in Supabase (EU, full attribution);
      to *send* the launch email we import to Substack or use a simple EU ESP. Decide before
      Week 3 (Engineering + Legal). Not a blocker for capture.
- [ ] **X investment** — pay for API/scheduling, or post manually until reach justifies it?
- [ ] **One-liner / tagline** — lock the final positioning line (§2 is a working draft).

---

## 12. Changelog & decisions

| Date | Change | By |
| --- | --- | --- |
| 2026-06-23 | v0.1 drafted. Objective = waitlist. Channels, pillars, <1mo sprint, EU-first automation stance set. Waitlist brief handed to Lead Engineer. | CMO |
| 2026-06-23 | v0.2. Decided: **Postiz** as scheduler; **Substack = public long-form**, waitlist owned in **Supabase (Zürich)**. Open item narrowed to "how to send launch email." | CMO |
| 2026-06-23 | v0.3. **Beta scanner is live now** → primary CTA = "try the beta," waitlist secondary. **No price mentioned publicly yet** (€5/€5 parked). Added **narrative spine** (Europe takes back its data, not fanatical) and **soft B2B capture**. | CMO |
| 2026-06-23 | v0.4. **Gmail = early-access on-ramp** (scanner supports Gmail first). "Still on Gmail? Good — that's the point" framing. Outlook/others → waitlist. | CMO |
| 2026-06-23 | v0.5. **Beta is GATED + capped** (Google Testing mode, ~100 manually-approved testers). Flow = request access → founder approves → scanner works. Forum = honest "limited beta, help me test"; **waitlist = overflow + the larger list.** De-risks traffic. | CMO |

---

## 13. Pointers

- `CLAUDE.md` — master project context (strategy, stack, decision log).
- `docs/SEO_STRATEGY.md` — organic-search engine: catalog keyword architecture, page model, content briefs, technical-SEO gate (CMO-owned companion to this plan).
- `docs/BRAND.md` — voice, tone, colors, typography (align all copy here).
- `docs/DEVELOPMENT_PLAN.md` — product roadmap / phases.
- `docs/SECURITY.md` — privacy/security doctrine (source of truth for privacy claims).
- `research/Social media accounts.txt` — account credentials/handles (local, gitignored).
