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

| Dato       | Element                                                  | Status |
| ---------- | -------------------------------------------------------- | ------ |
| 2026-06-18 | **Zero-knowledge klientside-kryptering** (`crypto.ts`, AES-GCM + PBKDF2) — 5 tester grønne | ✅ |
| 2026-06-18 | **Supabase-klient** (`supabase.ts`) + `.env.example` + typede env-vars | ✅ |
| 2026-06-18 | **RLS-skjema versjonert** (`supabase/migrations/0001`): `user_vault` (zero-knowledge) + `entitlements` | ✅ (skrevet) |
| 2026-06-18 | **Supabase MCP-connector** konfigurert (`.mcp.json`, token via env) | ✅ |
| 2026-06-18 | **Klientside-ruting** (react-router, lazy-lastet dashbord)  | ✅ |
| 2026-06-18 | **Dashbord-skall** med Gjest/Profil-modusbryter + fremdrift | ✅ |
| 2026-06-18 | **Gjestemodus-lagring** (`guestStorage.ts` + `useMigrationState`) — sessionStorage, 4 tester | ✅ |
| 2026-06-18 | Datalekkasje-sjekk (HIBP) lagt inn i planen (SECURITY §9)  | ✅ (planlagt) |
| —          | Opprett Supabase-prosjekt (EU/Frankfurt) + kjør migrasjon | ⏳ (krever deg) |
| —          | Supabase Auth-flyt + Profilmodus-lagring (zero-knowledge) | ⏳ |
| —          | Innboksskanner v1 (Gmail OAuth, 100 % klientside)        | ⏳ |
| —          | Alternativ-matching (oppdaget tjeneste → alternativ)     | ⏳ |
| —          | Datalekkasje-sjekk (Have I Been Pwned, via backend-proxy) | ⏳ |
| —          | Affiliate-gate + Stripe €29 engangskjøp                  | ⏳ |
| —          | i18n-fundament (engelsk default)                         | ⏳ |
| —          | Personvernerklæring + samtykkeflyt                       | ⏳ |
| —          | Plausible-analyse (EU)                                   | ⏳ |

---

## Loggnotater

- **2026-06-18:** Grunnoppsett, dokumentasjon og utviklerverktøy (shadcn/ui,
  Vitest, CI) ferdig. Klar til å starte Fase 1. Testkommando: `npm test`.
  Byggkommando: `npm run build`. Dev: `npm run dev`.
- **2026-06-18:** Supabase-fundament lagt: zero-knowledge kryptomodul (testet),
  Supabase-klient, versjonert RLS-skjema, og Supabase MCP-connector (`.mcp.json`).
  **Venter på deg:** opprett Supabase-prosjekt i EU-region, sett
  `SUPABASE_ACCESS_TOKEN`, fyll `apps/web/.env`. Da kjører vi migrasjonen via MCP.
- **2026-06-18:** Ruting + dashbord-skall (Gjest/Profil) implementert og
  fungerer uten database. Gjestemodus persisterer til sessionStorage. HIBP
  datalekkasje-sjekk lagt inn i planen. 20 tester grønne, bygg rent (Supabase
  code-splittet ut av landingssiden).
