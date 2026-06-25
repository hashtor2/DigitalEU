# digitaleu.me

**Your digital life is running on American infrastructure. That's a problem.**

Every email you send through Gmail, every file in Dropbox, every message on Slack — it all flows through US corporations subject to US law, US surveillance, and US business decisions. When Big Tech changes its terms, raises prices, or gets acquired, you have no recourse.

digitaleu.me helps you move out. We map your digital footprint, show you the risks, and guide you to privacy-respecting European alternatives — one service at a time.

🌍 **Live at [digitaleu.me](https://www.digitaleu.me)**

✅ **Email Scanner Live** — Unlock at [digitaleu.me/emailscanner](https://www.digitaleu.me/emailscanner), then scan at `/scanner`

If you want to contribute to this project, please contact: torisor@pm.me

---

## What it does

**For individuals (`/b2c`):**
- ✅ **Scan your inbox** to discover which Big Tech services you depend on (LIVE)
  - Gmail & Outlook OAuth 2.0 with PKCE
  - Server-side metadata scan via Supabase Edge Functions; tokens never stored
  - Embedded scanner at `/scanner/*` inside the web app
- ✅ **See alternatives matched** to your detected services (LIVE)
- ✅ **Scanner dashboard** — scan history and results at `/scanner/dashboard`
- ⏳ **Personal migration dashboard** at `/dashboard` (privacy report flow)
- ⏳ **Browser extension** to autofill new email on external sites (Phase 2)

**For businesses (`/b2b`):**
- Get a full audit of your company's US tech dependencies
- Receive a prioritised migration roadmap with cost estimates
- Hands-on execution support: configuration, data transfer, staff onboarding
- GDPR & NIS2 compliance built into every recommendation

**Scanner unlock:** Free via [Proton Mail affiliate signup](https://go.getproton.me/SH1mR), or **€5 one-time** via Stripe.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Web app | Vite + React 19 + TypeScript | Fast, type-safe SPA (scanner embedded at `/scanner/*`) |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first, European Digital design system |
| Backend / DB | Supabase (🇸🇪 Stockholm, eu-north-1) | EU data residency, zero-knowledge ready |
| Email scanning | Supabase Edge Functions (`scan-email`, `exchange-email-code`) | Server-side OAuth, metadata-only |
| Payments | Stripe Checkout + Edge Function webhook | €5 scanner unlock |
| Auth | Supabase Auth | Profile mode with client-side encryption (planned) |
| Hosting | Vercel (under review → 🇫🇷 Clever Cloud / 🇩🇪 Hetzner) | Speed now, sovereignty later |
| Analytics | Plausible 🇪🇪 | Cookieless, EU-based |
| Code hosting | **Codeberg 🇩🇪** | We practice what we preach |

We run on European infrastructure as much as possible. Where we don't yet, it's noted and tracked.

---

## Project structure

```
digitaleu.me/
├── apps/
│   ├── web/                    # SPA — landing, catalogue, embedded scanner (/scanner/*)
│   └── extension/              # Chrome/Firefox extension (MV3) — Phase 2
├── packages/
│   └── shared/                 # Types, alternatives catalogue, affiliate links
├── supabase/                   # Migrations + Edge Functions (Deno)
├── tools/telegram-agents/      # Telegram-controlled AI agent orchestrator
├── scripts/                    # OAuth validation & dev helpers
└── docs/                       # Architecture, security, progress log
```

---

## Getting started

**Try the scanner (production):**
```
https://www.digitaleu.me/emailscanner   → unlock gate
https://www.digitaleu.me/scanner        → OAuth scan flow
```

**Develop locally:**
```bash
npm install                          # install all workspaces
cp apps/web/.env.example apps/web/.env.local   # fill in Supabase + OAuth keys
npm run dev                          # web app → http://localhost:5173
npm run build                        # build all workspaces
npm run oauth:validate               # verify OAuth file structure
```

Scanner routes live under `apps/web/src/pages/scanner/`. OAuth callback: `/scanner/auth/email-callback`.

See [docs/OAUTH_SETUP_GUIDE.md](docs/OAUTH_SETUP_GUIDE.md) and [OAUTH_QUICK_REFERENCE.md](OAUTH_QUICK_REFERENCE.md) for provider setup.

---

## Scanner security & privacy

Built on privacy-by-design principles:

- **Metadata-only** — Gmail: `gmail.metadata` scope; Outlook: `Mail.ReadBasic`. No email bodies.
- **Server-side scan** — Edge Function processes inbox metadata; access tokens are not persisted.
- **Minimal OAuth scopes** — OAuth 2.0 with PKCE; user can revoke access anytime.
- **Guest mode** — Results in `sessionStorage`, cleared when the tab closes.
- **Profile mode (planned)** — Client-side encryption (AES-256-GCM + PBKDF2) before storage.

Full doctrine: [docs/SECURITY.md](docs/SECURITY.md)

---

## Principles

1. **Privacy by design.** Metadata-only scanning; tokens never stored server-side.
2. **You own your data.** Guest mode: everything in `sessionStorage`. Profile mode: encrypted before it reaches our servers.
3. **We eat our own cooking.** European tools where we can. This repo is on Codeberg. Database in Sweden.
4. **No dark patterns.** We recommend what fits you, not what pays us most.

---

## Business model

Affiliate commissions from European providers (Proton and others). No ads, no data selling.

Scanner: free via partner signup **or** €5 one-time purchase.

B2B consulting for companies migrating away from Big Tech.

---

## Roadmap

- [x] Audience selector (B2C / B2B)
- [x] Email scanner with OAuth (Gmail & Outlook)
- [x] EU alternatives catalogue (150+ services)
- [x] Production deployment (Vercel + Supabase, Stockholm)
- [x] Stripe unlock flow (€5) + Proton affiliate path
- [ ] Profile mode with zero-knowledge encryption
- [ ] Browser extension (MV3)
- [ ] Full i18n (all European languages)
- [ ] B2B consulting platform

Progress log: [docs/PROGRESS.md](docs/PROGRESS.md)

---

## License

Source-available. All rights reserved for now — open licensing under consideration.

---

*Built in Norway. Data in Sweden. For Europe.*
