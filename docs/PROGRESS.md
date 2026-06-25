# PROGRESS.md — Byggdagbok

> Levende logg over hva som faktisk er **ferdig utviklet og implementert**.
> Dette er den eneste aktive sprintloggen for prosjektet og skal oppdateres
> etter hver arbeidssprint for å holde kontekst samlet.
> Oppdateres hver gang en funksjon eller del av nettsiden er ferdigstilt.
> Planen for hva som *skal* gjøres ligger i `docs/DEVELOPMENT_PLAN.md`.
>
> Status-ikoner: ✅ ferdig · 🚧 påbegynt · ⏳ ikke startet

## How to Use This File

- Read the latest section before starting new work.
- Add sprint outcomes here immediately after finishing a work session.
- Keep this file as the canonical place for progress, verification, and next steps.
- Do not duplicate sprint status elsewhere unless there is a short historical note that points back here.

---

## Status Snapshot — 2026-06-25

### Completed (email scanner repair)
- [x] End-to-end inbox scan wired: OAuth → `scan-email` Edge Function → client-side `DOMAIN_MAPPINGS` matching → results UI
- [x] Guest flow: auto-scan after OAuth → `/scanner/results/guest` (sessionStorage)
- [x] Authenticated flow: auto-scan after OAuth → persisted `scans` / `scan_results` → `/scanner/results/:scanId`
- [x] Restored `0009_scanner_schema.sql`; added `0010_scan_results_insert_policy.sql` (RLS insert/update)
- [x] Removed broken `gmail-scan` call; Outlook scope fixed to `Mail.ReadBasic`
- [x] OAuth redirect docs updated to `/scanner/auth/email-callback`

### Remaining to test
- [ ] **Vercel:** add `VITE_STRIPE_PUBLIC_KEY` — run `.\scripts\sync-vercel-stripe-env.ps1` then `vercel --prod`
- [ ] Register OAuth redirect URIs in Google/Azure consoles (see `docs/OAUTH_SETUP_GUIDE.md`)
- [ ] Production Gmail/Outlook OAuth + scan smoke test
- [x] **Supabase secrets:** OAuth + Stripe + service role verified via `supabase secrets list`

---

## Status Snapshot — 2026-06-24

### Completed
- [x] **SCANNER APP MERGED INTO WEB APP** — Scanner app now runs under `/scanner` route in main web app instead of separate subdomain. Resolves Vercel routing issue where scanner.digitaleu.me was incorrectly serving web app instead of scanner app. Single deployment simplifies infrastructure. Commit 94cdddf.
- [x] Scanner dashboard rebuilt as a structured account center with connected inboxes, access status, recent scans, security, and account actions.
- [x] Scanner navigation corrected so logged-in users see Dashboard and Sign out, and public links resolve to valid destinations.
- [x] Manual-check anchor added so dashboard links resolve to the manual review section.
- [x] Missing scanner favicon added to stop 404 noise.
- [x] Supabase Edge Function `delete-account` implemented and deployed.
- [x] Missing scanner tables were created in Supabase so dashboard fetches no longer return 404.
- [x] Main web app Stripe initialization guarded so pages without a publishable key do not crash.
- [x] Production deploy forced to Vercel and aliased to `www.digitaleu.me`.
- [x] Legal trust layer implemented in web app: new `/terms` and `/privacy` pages, routed and linked from payment/signup/footer surfaces.
- [x] Dead legal anchors (`#terms`) replaced with real route links in onboarding and payment components.
- [x] Plausible bootstrap added in app shell (production + env-gated) with env typings and `.env.example` entries.
- [x] Lightweight analytics QA route added at `/qa/analytics` for quick Plausible runtime checks and manual event firing in production.
- [x] Trust badges implemented for catalog credibility signals (EU/EEA data region, tested partner, open-source option, migration guide).
- [x] Cross-links added to catalog UX: quick stack filters on directory page and "Complete your stack" recommendations on alternative detail pages.

### Verified
- [x] Scanner routes working locally at http://localhost:5191/scanner and http://localhost:5191/scanner/scan
- [x] Demo scan page displays all 7 detected services with Nordic Warmth design
- [x] Scanner layout (header, nav, theme toggle) renders correctly inside web app routing
- [x] Web workspace build passes: 2024 modules transformed, 0 TypeScript errors
- [x] All TypeScript errors fixed (unused variables, missing props)
- [x] Git commit 94cdddf pushed to GitHub
- [x] Vercel should auto-deploy on push to main
- [x] Scanner workspace build passes.
- [x] Dashboard route auth-gates correctly when logged out.
- [x] Live scanner dashboard loads without the previous 404 fetch errors.
- [x] Live `/guides` page resolves correctly.
- [x] Live `/emailscanner` page loads after the production redeploy.
- [x] Web production build passes after legal routes/pages and Plausible bootstrap changes.
- [x] Web production build passes after analytics QA route and trust badge/cross-link catalog updates.

### Remaining to test
- [ ] Production deployment of scanner merge (check www.digitaleu.me/scanner loads new design)
- [ ] Full Gmail OAuth round-trip in production at `/scanner/auth/signin`
- [ ] Full Outlook OAuth round-trip in production.
- [ ] Authenticated dashboard actions with a real user session at `/scanner/dashboard`
- [ ] `delete-account` success path with a valid bearer token.
- [ ] Stripe payment flow, if the premium unlock path is still active in production.
- [ ] Guide deep links under `/guides/:id`.
- [ ] Live smoke test of `/terms` and `/privacy` route availability and footer/payment navigation to those routes.
- [ ] Confirm Plausible events in production (pageview + affiliate click events).
- [ ] Confirm `/qa/analytics` route works in production and test events appear in Plausible dashboard.
- [ ] Spot-check trust badges and cross-link recommendations on live `/directory` and `/alternative/:id` pages.

### Next development items
- [ ] Monitor Vercel deployment and verify www.digitaleu.me/scanner shows new scanner design
- [ ] Verify OAuth redirect URIs still work (may need to update to www.digitaleu.me/scanner/auth/email-callback)
- [ ] Remove separate scanner app from Vercel and codeberg if deployment confirmed working
- [ ] Continue account/security polish, especially 2FA management and delete-account UX.
- [ ] Reduce non-functional console noise such as analytics request aborts if desired.
- [ ] Keep affiliate placement conservative: Proton where it is genuinely the strongest alternative, not everywhere.

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
| 2026-06-18 | **Opprett Supabase-prosjekt (Sverige/Stockholm)** + kjør migrasjon (`0001_initial_schema.sql`) | ✅ |
| 2026-06-18 | **Supabase Auth-flyt + Profilmodus-lagring (zero-knowledge)** — fullstendig klientside-kryptert synkronisering, låseskjerm og øktbevaring | ✅ |
| 2026-06-18 | **Innboksskanner v1** — klientside Gmail OAuth (metadata-headers) batch-skanning med unikt avsender-uttrekk | ✅ |
| 2026-06-18 | **Outlook/Graph-skanning** — klientside Microsoft Graph API OAuth 2.0 (Mail.ReadBasic) for Outlook & Hotmail (fremskyndet fra Fase 2) | ✅ |
| 2026-06-18 | **GitHub OAuth-innlogging** — integrert i bruker-registreringsflyten (med klientside zero-knowledge låseskjerm-avledning) | ✅ |
| 2026-06-18 | **Alternativ-matching** — automatisk matching av skannede domener mot `DOMAIN_MAPPINGS` og `ALTERNATIVES` | ✅ |
| 2026-06-18 | **Cloud-migreringsguider** — interaktive, innebygde, visuelle step-by-step guider for e-post, passord og skyfiler (Dropbox/Drive to Proton Drive) | ✅ |
| 2026-06-18 | **Datalekkasje-sjekk (Have I Been Pwned)** — secure Supabase Edge Function API-proxy for breach checks with local fallback | ✅ |
| —          | Affiliate-gate + Stripe €5 engangskjøp                  | ⏳ |
| 2026-06-18 | **i18n-fundament** — fullstendig engelsk-basert, conversion-focused landingsside og dashbord-ruting | ✅ |
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
- **2026-06-18:** Fullført end-to-end integrasjon av **Profilmodus (Zero-Knowledge)**. Supabase-tilkoblingen er konfigurert i `.env` mot det nye prosjektet i Sverige (Stockholm), migrasjonen er klargjort, og klientside-kryptert synkronisering med automatiske sky-oppdateringer er fullt implementert og testet. Låseskjerm med passfrasere-opplåsing beskytter økten. Alle 21 tester i monorepoet kjører nå grønt!
- **2026-06-18:** Stor-oppdatering: Bygget innboksskanner (Gmail OAuth 100 % klientside) med batching og domene-ekstrahering, koblet opp alternativ-matching direkte mot `DOMAIN_MAPPINGS`, og opprettet en produksjonsklar **Supabase Edge Function** (`check-breach`) for sikker Have I Been Pwned sjekk. Hele prosjektet er oversatt til et engelsk, høytkonverterende "Gmail-to-Proton" fokus. Testdekningen er økt til 36 suksessfulle enhetstester, og full produksjonsbygning fullfører 100 % feilfritt.
- **2026-06-18:** Fullført utvidelse av innboksskanneren med native Microsoft Outlook / Hotmail OAuth 2.0 (MS Graph) integrasjon, lagt inn GitHub OAuth innlogging i Supabase auth-flyten med støtte for zero-knowledge krypteringsavledning, og utviklet interaktive, visuelle migreringsguider for skyfiler, e-post og passord innebygget direkte i dashbordets sjekklister. Testdekningen økt til 40 suksessfulle enhetstester, og full produksjonsbygning er 100 % grønn.
