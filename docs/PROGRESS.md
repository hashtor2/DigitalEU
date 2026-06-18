# PROGRESS.md — Byggdagbok

> Levende logg over hva som faktisk er **ferdig utviklet og implementert**.
> Oppdateres hver gang en funksjon eller del av nettsiden er ferdigstilt.
> Planen for hva som *skal* gjøres ligger i `docs/DEVELOPMENT_PLAN.md`.
>
> Status-ikoner: ✅ ferdig · 🚧 påbegynt · ⏳ ikke startet

---

## Fase 0 — Fundament ✅

| Dato       | Element                                                      | Status |
| ---------- | ----------------------------------------------------------- | ------ |
| 2026-06-18 | Monorepo (npm workspaces): `apps/web`, `apps/extension`, `packages/shared` | ✅ |
| 2026-06-18 | Web-app: Vite + React 19 + TS + Tailwind v4                | ✅ |
| 2026-06-18 | Minimal landingsside (hero, CTA-er, alternativ-grid)       | ✅ |
| 2026-06-18 | Delte typer i `@digitaleu/shared` + startkatalog over alternativer | ✅ |
| 2026-06-18 | Privat GitHub-repo, `.gitignore`, `.gitattributes`         | ✅ |
| 2026-06-18 | `research/` lokal mappe utenfor git                        | ✅ |
| 2026-06-18 | Researchdokumenter fjernet fra git-historikken (renset)    | ✅ |
| 2026-06-18 | Dokumentasjon: CLAUDE.md, SECURITY.md, DEVELOPMENT_PLAN.md  | ✅ |
| 2026-06-18 | **shadcn/ui** satt opp (Vite, radix, Nova-preset, dark-tema) + `Button` i bruk | ✅ |
| 2026-06-18 | **Vitest** satt opp (web: jsdom + Testing Library; shared: node) — 7 tester grønne | ✅ |
| 2026-06-18 | **GitHub Actions CI** (`.github/workflows/ci.yml`): lint + build + test | ✅ |

---

## Fase 1 — MVP web-app 🚧

| Dato | Element                                                  | Status |
| ---- | -------------------------------------------------------- | ------ |
| —    | Klientside-ruting + dashbord-skall (Gjest/Profil-bryter) | ⏳ |
| —    | Supabase-prosjekt (EU-region) + Auth + RLS-skjema        | ⏳ |
| —    | Zero-knowledge klientside-kryptering (Profilmodus)       | ⏳ |
| —    | Innboksskanner v1 (Gmail OAuth, 100 % klientside)        | ⏳ |
| —    | Alternativ-matching (oppdaget tjeneste → alternativ)     | ⏳ |
| —    | Affiliate-gate + Stripe €29 engangskjøp                  | ⏳ |
| —    | i18n-fundament (engelsk default)                         | ⏳ |
| —    | Personvernerklæring + samtykkeflyt                       | ⏳ |
| —    | Plausible-analyse (EU)                                   | ⏳ |

---

## Loggnotater

- **2026-06-18:** Grunnoppsett, dokumentasjon og utviklerverktøy (shadcn/ui,
  Vitest, CI) ferdig. Klar til å starte Fase 1. Testkommando: `npm test`.
  Byggkommando: `npm run build`. Dev: `npm run dev`.
