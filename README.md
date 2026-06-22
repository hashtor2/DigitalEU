# digitaleu.me

**Your digital life is running on American infrastructure. That's a problem.**

Every email you send through Gmail, every file in Dropbox, every message on Slack — it all flows through US corporations subject to US law, US surveillance, and US business decisions. When Big Tech changes its terms, raises prices, or gets acquired, you have no recourse.

digitaleu.me helps you move out. We map your digital footprint, show you the risks, and guide you to privacy-respecting European alternatives — one service at a time.

🌍 **Live at [digitaleu.me](https://digitaleu.me)**

If you want to contribute to this project, please contact: torisor@pm.me

---

## What it does

**For individuals (`/b2c`):**
- Scan your inbox to discover which Big Tech services you depend on
- See the threat level, data protection rating, and breach history for each
- Get matched with a vetted European alternative (Proton, Tuta, Mullvad, and 140+ more)
- Track your migration progress on a personal dashboard

**For businesses (`/b2b`):**
- Get a full audit of your company's US tech dependencies
- Receive a prioritised migration roadmap with cost estimates
- Hands-on execution support: configuration, data transfer, staff onboarding
- GDPR & NIS2 compliance built into every recommendation

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Web app | Vite + React 19 + TypeScript | Fast, type-safe SPA |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first, no runtime |
| Backend / DB | Supabase (🇨🇭 Zürich, eu-central-2) | EU data residency, zero-knowledge ready |
| Hosting | Vercel (under review → 🇫🇷 Clever Cloud / 🇩🇪 Hetzner) | Speed now, sovereignty later |
| Analytics | Mouseflow 🇩🇰 | Session recording, EU-based |
| Code hosting | **Codeberg 🇩🇪** | We practice what we preach |

We run on European infrastructure as much as possible. Where we don't yet, it's noted and tracked.

---

## Project structure

```
digitaleu.me/
├── apps/
│   ├── web/          # SPA — Vite + React + TypeScript + Tailwind
│   └── extension/    # Chrome/Firefox extension (MV3) — coming in Phase 2
├── packages/
│   └── shared/       # Types, alternatives catalogue, market segmentation
└── docs/             # Architecture decisions, security doctrine, affiliate links
```

---

## Getting started

```bash
npm install     # install all workspaces
npm run dev     # start web app → http://localhost:5173
npm run build   # build all packages
```

---

## Principles

1. **Privacy by design.** Inbox scanning runs 100% client-side. We never see your emails.
2. **You own your data.** Guest mode: everything in `sessionStorage`, gone when you close the tab. Profile mode: client-side encrypted before it reaches our servers.
3. **We eat our own cooking.** We use European tools ourselves. This repo is on Codeberg. Our database is in Switzerland.
4. **No dark patterns.** We recommend what fits you, not what pays us most.

---

## Business model

Affiliate commissions from European providers (Proton: 30–40% CPS, and growing). No ads, no data selling, no VC pressure.

B2B consulting for companies migrating away from Big Tech — stack audits, migration roadmaps, execution support.

---

## Roadmap

- [x] Audience selector (B2C / B2B)
- [x] B2C migration dashboard with inbox scanner
- [x] B2B consulting page with contact form
- [x] 150+ vetted European alternatives catalogue
- [ ] Browser extension (MV3) — autofill new email on external sites
- [ ] Full i18n (all European languages)
- [ ] Expanded affiliate catalogue beyond Proton

---

## License

Source-available. All rights reserved for now — open licensing under consideration.

---

*Built in Norway. Hosted in Switzerland. For Europe.*
