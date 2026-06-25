# digitaleu.me

**Your digital life is running on American infrastructure. That's a problem.**

Every email you send through Gmail, every file in Dropbox, every message on Slack — it all flows through US corporations subject to US law, US surveillance, and US business decisions. When Big Tech changes its terms, raises prices, or gets acquired, you have no recourse.

digitaleu.me helps you move out. We map your digital footprint, show you the risks, and guide you to privacy-respecting European alternatives — one service at a time.

🌍 **Live at [digitaleu.me](https://www.digitaleu.me)**

✅ **Email Scanner Live** — Try it now at [digitaleu.me/emailscanner](https://www.digitaleu.me/emailscanner)

If you want to contribute to this project, please contact: torisor@pm.me

---

## What it does

**For individuals (`/b2c`):**
- ✅ **Scan your inbox** to discover which Big Tech services you depend on (LIVE)
  - Gmail & Outlook OAuth 2.0 support
  - Backend scans emails server-side, frontend matches 100% client-side
  - Demo mode available for testing without account
- ✅ **See alternatives matched** to your detected services (LIVE)
- ⏳ **Personal dashboard** to track migration progress (coming soon)
- ⏳ **Browser extension** to autofill new email on external sites (Phase 2)

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
| Backend / DB | Supabase (🇸🇪 Stockholm, eu-north-1) | EU data residency, zero-knowledge ready |
| Email Scanning | Supabase Edge Functions | Server-side OAuth, client-side matching |
| Auth | Supabase Auth (planned) | Zero-knowledge encryption for profiles |
| Hosting | Vercel (under review → 🇫🇷 Clever Cloud / 🇩🇪 Hetzner) | Speed now, sovereignty later |
| Analytics | Plausible 🇪🇪 | Cookieless, EU-based |
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

**Try the scanner:**
```bash
# Production (live now)
https://www.digitaleu.me/emailscanner
```

**Develop locally:**
```bash
npm install     # install all workspaces
npm run dev     # start web app → http://localhost:5186
npm run build   # build all packages for production
```

Scanner development uses:
- Frontend: React 19 + TypeScript hooks
- Backend: Supabase Edge Functions (Deno)
- Test: Demo mode at `/emailscanner?demo=true` (no OAuth needed)

---

## Scanner Security & Privacy

The email scanner is built on privacy-by-design principles:

- **100% Client-Side Matching** — Backend returns only sender domains; all matching against alternatives happens in your browser
- **Minimal OAuth Scopes** — Gmail: `gmail.metadata` only (no email bodies), Outlook: `Mail.ReadBasic` (metadata only)
- **No Token Storage** — Access tokens are extracted from URL hash, used once, then discarded
- **Zero-Knowledge Profile Mode** — Results encrypted client-side (AES-256-GCM + PBKDF2) before reaching our servers
- **Guest Mode** — All results stored in `sessionStorage`, cleared when you close the tab

See [docs/OAUTH_SETUP_GUIDE.md](docs/OAUTH_SETUP_GUIDE.md) for technical details.

---

1. **Privacy by design.** Inbox scanning runs 100% client-side. We never see your emails.
2. **You own your data.** Guest mode: everything in `sessionStorage`, gone when you close the tab. Profile mode: client-side encrypted before it reaches our servers.
3. **We eat our own cooking.** We use European tools ourselves. This repo is on Codeberg. Our database is in Sweden.
4. **No dark patterns.** We recommend what fits you, not what pays us most.

---

## Business model

Affiliate commissions from European providers (Proton: 30–40% CPS, and growing). No ads, no data selling, no VC pressure.

B2B consulting for companies migrating away from Big Tech — stack audits, migration roadmaps, execution support.

---

## Roadmap

- [x] Audience selector (B2C / B2B)
- [x] **Email scanner with OAuth** (Gmail & Outlook, LIVE 2026-06-24)
- [x] EU alternatives catalogue (150+ services)
- [x] **Production deployment** (Vercel + Supabase)
- [ ] **Dashboard & profile mode** (zero-knowledge encryption)
- [ ] Browser extension (MV3) — autofill new email on external sites
- [ ] Full i18n (all European languages)
- [ ] B2B consulting platform with migration roadmaps

---

## License

Source-available. All rights reserved for now — open licensing under consideration.

---

*Built in Norway. Data in Sweden. For Europe.*
