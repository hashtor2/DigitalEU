# CLAUDE.md — Master-kontekst for digitaleu.me

> Denne filen er den autoritative konteksten for prosjektet. Den lastes inn i
> hver Claude Code-økt og bevarer retning på tvers av terminalvinduer og maskiner.
> **Hold den oppdatert.** Endrer vi en beslutning, oppdateres beslutningsloggen (§10).
> Detaljer ligger i `docs/SECURITY.md` og `docs/DEVELOPMENT_PLAN.md`.

---

## 1. Prosjektet i ett blikk

**digitaleu.me** er en europeisk migrasjonsportal som hjelper vanlige forbrukere
(B2C) med å flytte det digitale livet sitt bort fra Big Tech og over til
personvernvennlige, europeiske alternativer.

Produktet består av tre deler som spiller sammen:
1. **Web-applikasjon (digitaleu.me)** — landingsside, katalog, dashbord, betaling, brukerinformasjon.
2. **Innboksskanner (scanner.digitaleu.me)** — standalone-app for Gmail/Outlook-analyse, OAuth-basert innboksaksess, service-deteksjon med betalingsflow (Stripe) + affiliate-integrasjon.
3. **Nettleserutvidelse (MV3)** — autofyller ny e-postadresse på eksterne sider
   (Netflix, Spotify, ...) slik at det blir lett å bytte kontoadresse. Fase 2.

**Forretningsmodell:** Gratis hvis brukeren registrerer seg hos en partner via
vår affiliate-lenke, ELLER €5 som engangskjøp via betalingsleverandør (begge metoder integrert i scanner).

---

## 2. Strategisk visjon (VIKTIG — les dette)

digitaleu.me skal **ikke** ende opp som en ren Proton-affiliateside. Det er bare
startpunktet. Den langsiktige retningen:

- **Fase 1 (nå):** Bygg nettsiden og verktøyene (innboksskanner, dashbord,
  utvidelse). Starter med et lite utvalg sterke alternativer (Proton, Tuta,
  Mullvad m.fl.).
- **Fase 2:** Utvid til en bred, kuratert **katalog over europeisk teknologi**
  på tvers av kategorier, med guider og sammenligninger (bl.a. en
  nettleser-sikkerhetsguide, se §7).
- **Fase 3:** **B2B-marked** — her ligger trolig det største inntektspotensialet
  (bedrifter som vil bort fra Big Tech av suverenitets-/compliance-hensyn).

Beslutninger skal tas i lys av denne retningen, ikke bare det kortsiktige MVP-et.

---

## 3. Kjerneprinsipper (ufravikelige)

1. **Sikkerhet først, alltid.** Vi ber om tilgang til brukerens e-post — noe av
   det mest private som finnes. Det krever at vi behandler sikkerhet som
   produktets viktigste funksjon, ikke en ettertanke. Se `docs/SECURITY.md`.
2. **Brukeren eier sine egne data.** Vi er forkjempere for dette. I praksis:
   datamininmering, klientside-/zero-knowledge-kryptering, lokal-først der mulig,
   og full åpenhet om hva vi gjør med data.
3. **Europeisk-først ("dogfooding").** Der det er mulig, skal *vi selv* bruke
   europeiske leverandører og verktøy — ikke bare anbefale dem til andre. Se §6.
4. **Åpenhet.** Brukeren skal informeres tydelig om kryptering, innboksskanning
   og hva som lagres hvor. Ingen skjult sporing.
5. **Personvern by design & by default.** Den tryggeste innstillingen er
   standardvalget (f.eks. Gjestemodus).

---

## 4. Arkitektur

**Monorepo** basert på **npm workspaces** (ingen ekstra verktøy med mindre vi
trenger det). Node.js >=20.

```
digitaleu.me/
├── apps/
│   ├── web/          # SPA: landingsside + katalog. Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui
│   ├── scanner/      # Standalone scanner SPA (scanner.digitaleu.me). Innboksskanning, OAuth, betaling, service-deteksjon
│   └── extension/    # Chrome/Firefox-utvidelse (Manifest V3) — Fase 2
├── packages/
│   └── shared/       # Delte typer, alternativ-katalog, hjelpefunksjoner
├── supabase/         # Migrations + Edge Functions (Deno)
├── docs/             # Prosjektdokumentasjon (plan, sikkerhet, arkitektur)
├── research/         # 🔒 LOKAL, gitignorert. Privat kildemateriale. ALDRI i repoet.
├── CLAUDE.md         # ← denne filen
└── package.json      # Workspace-rot
```

### Teknologistakk

| Lag             | Valg                                | Status      |
| --------------- | ----------------------------------- | ----------- |
| Build/dev       | Vite 6                              | ✅ i bruk    |
| UI              | React 19 + TypeScript               | ✅ i bruk    |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`) | ✅ i bruk  |
| Komponenter     | shadcn/ui + Radix UI + Lucide       | ✅ i bruk    |
| Backend/DB/Auth | Supabase (Sverige, eu-north-1)    | ✅ i bruk    |
| Edge Functions  | Deno (Supabase Functions)           | ✅ i bruk    |
| Betaling        | Stripe (checkout + webhook)         | ✅ i bruk    |
| Analyse         | Plausible (🇪🇪 EU, cookieless)        | ⏳ planlagt (integrasjon starter) |
| Testing         | Vitest                              | ✅ i bruk    |
| CI              | GitHub Actions (build/lint/test)    | ⏳ planlagt  |
| Hosting         | Vercel (se §6 — åpen vurdering)     | ✅ i bruk    |

### Dataflyt (overordnet)
- **Innboksskanning:** OAuth (Gmail/Outlook) → ephemeral access token → **Supabase Edge Function `scan-email`** (server-side) → domene-utdrag → klient. Metadata-only, token lagres ikke, safe token exchange.
  - *Hvorfor server-side?* CORS-frihet på tredjepartssider, sikker token-håndtering, bedre error-recovery, skalering. Brukeren har full kontroll over OAuth-tillatelse (kan tilbakekalle når som helst).
- **Gjestemodus:** data lever kun i `sessionStorage` på klienten.
- **Profilmodus:** data **krypteres klientside (zero-knowledge)** før de lagres
  i Supabase. Vi skal aldri kunne lese klartekst.
- **Utvidelsen** er **lokal-først**: den mottar `ny_epost` fra web-appen og
  fyller felt lokalt — den sender aldri brukerdata til vår backend.
- **Betalinger:** Stripe Elements (klientside form) → Stripe → Edge Function webhook → Supabase payment verification + affiliate tracking.
- **Datalekkasje-sjekk:** `check-breach` Edge Function kaller Have I Been Pwned API v3 med hemmelig nøkkel (aldri eksponert klienten).

---

## 5. Sikkerhet & personvern

Dette er produktets ryggrad. Fullstendig doktrine i **`docs/SECURITY.md`**.
Absolutte minstekrav:

- **Sikkerhetsgjennomgang før hver commit.** Ingen kode committes uten at den er
  vurdert mot sjekklisten i `docs/SECURITY.md`.
- **Ingen hemmeligheter i repoet.** Bruk `.env` (gitignorert) + Vercel/Supabase
  env-vars. Skann diff for nøkler/tokens før commit.
- **Minimale OAuth-scopes.** Be aldri om mer tilgang enn strengt nødvendig.
- **Zero-knowledge i Profilmodus.** Krypter klientside før lagring; informer
  brukeren om det.
- **Datamininmering.** Lagre minst mulig, så kort som mulig.

---

## 6. Europeisk-først stack ("dogfooding")

Vi anbefaler europeiske alternativer — da bør vi bruke dem selv der det går.
Tabellen sporer hvor vi står, og hvor vi har en bevisst åpen vurdering.
**Når vi velger et nytt verktøy/tjeneste, vurder alltid et europeisk alternativ først.**

| Funksjon       | Nåværende valg     | Opphav         | Europeisk alternativ            | Status                         |
| -------------- | ------------------ | -------------- | ------------------------------- | ------------------------------ |
| Analyse        | Plausible          | 🇪🇪 Estland     | (allerede EU)                   | ✅ EU-valg                      |
| Backend/DB     | Supabase           | 🇺🇸 USA (open source) | self-host / Nhost; **data i Sverige (Stockholm, eu-north-1)** | ✅ Data i Sverige 🇸🇪 |
| Hosting        | Vercel             | 🇺🇸 USA         | Clever Cloud 🇫🇷, Scaleway 🇫🇷, OVHcloud 🇫🇷, Hetzner 🇩🇪 | ⚠️ Åpen vurdering |
| Kodehosting    | Codeberg           | 🇩🇪 Non-profit  | (allerede EU)                   | ✅ EU-valg (migrert 2026-06-20) |
| Betaling       | Stripe             | 🇺🇸/🇮🇪          | Mollie 🇳🇱, Paddle               | ⚠️ Åpen vurdering              |
| Domeneregistrar| Spaceship          | 🇺🇸 (antatt)    | Gandi 🇫🇷, INWX 🇩🇪, Netim 🇫🇷     | ⚠️ Notert (domenet er kjøpt)   |
| Breach-sjekk   | Have I Been Pwned  | 🌍 (ikke-EU)    | (ingen reelt ekvivalent)        | ✅ Akseptabelt unntak (sikkerhetstjeneste) |

> Domenet **digitaleu.me** er kjøpt og driftes via Spaceship.
> "Åpen vurdering" = bevisst beholdt nå for utviklerhastighet, men skal revurderes
> – særlig før vi profilerer suverenitet tungt utad, av troverdighetshensyn.

---

## 7. Forretningsmodell & produktnotater

- **Pris:** Gratis via partner-affiliate ELLER €5 engangskjøp (Stripe).
- **Affiliate-balanse:** Ikke bli en ren Proton-side (se §2). Affiliate finansierer
  utviklingen, men katalogen skal være bred og redaksjonelt ærlig.
- **Nettleserguide:** Nettsiden skal ha en egen guide som **sammenligner
  nettlesere** (sikkerhet, personvern, opphav) og promoterer en trygg, helst
  europeisk nettleser.
- **Datalekkasje-sjekk:** Bruker kan sjekke om e-posten er i kjente lekkasjer
  via Have I Been Pwned (API v3). Krever backend-proxy (hemmelig API-nøkkel).
  Se docs/SECURITY.md §9 og DEVELOPMENT_PLAN.md Fase 1.
- **Språk:** Engelsk som standard. Etter MVP skal nettsiden bygges ut til **alle
  europeiske språk** (i18n må være forberedt i koden fra start).
- **Mobil (senere):** Ikke nå, men mange mobilapper er gode europeiske
  alternativer — relevant for katalogen og en mulig fremtidig fase.

---

## 8. Utviklingskonvensjoner

- **Språk i kode:** Identifikatorer/typer på **engelsk**. Kommentarer kan være på
  **norsk** (som i dagens kode). Brukervendt tekst gjennom i18n (engelsk default).
- **TypeScript:** `strict` på. Delte typer bor i `@digitaleu/shared` — én kilde
  til sannhet for både web og utvidelse.
- **i18n-beredskap:** Ikke hardkod brukervendte strenger der det enkelt kan
  unngås; planlegg for oversettelse.
- **Commits:** Tydelige, tematiske meldinger (gjerne norsk). Avslutt alltid med:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **Branching:** Funksjonsarbeid på egne brancher når praktisk; små
  oppsett-/dokumentcommits direkte på `main` er greit i nåværende solo-fase.
- **Avhengigheter:** Hold dem få og reviderte (`npm audit`). Færre avhengigheter
  = mindre angrepsflate.

---

## 9. Arbeidsflyt & kommandoer

```bash
npm install        # installer for alle workspaces
npm run dev        # start web-appen → http://localhost:5173
npm run build      # bygg alle workspaces (tsc + vite)
npm run lint       # lint (når satt opp)
```

Git/GitHub:
```bash
# Repo: https://github.com/hashtor2/DigitalEU (privat). Konto: hashtor2.
git add -A && git commit -m "..." && git push
```

**Før commit:** kjør sikkerhetssjekklisten i `docs/SECURITY.md` (hemmeligheter,
scopes, datalekkasje, avhengigheter).

## 10. Dokumentasjonsflyt

- `docs/PROGRESS.md` er den eneste løpende sprintloggen og den primære
  kontekstkilden for hva som faktisk er ferdig, hva som er verifisert, og hva
  som gjenstår.
- Før du starter nytt arbeid, les alltid siste oppdatering i
  `docs/PROGRESS.md`.
- Etter hver arbeidssprint skal du oppdatere `docs/PROGRESS.md` med det som ble
  gjort, verifisert, og neste prioritering.
- `EXECUTIVE_SUMMARY.md` er avviklet som aktiv statuskilde og skal bare brukes
  som et historisk pekepunkt hvis det trengs.

### Design System Workflow (`feat/brand-identity` branch)

Designarbeid gjøres på dedikert `feat/brand-identity`-branch. **Prosessen:**

1. **Åpne** `docs/DESIGN_CHECKLIST.md` for å se neste fase.
2. **Implementer** komponenter/layout per fase (A: component overrides → B: Header/Footer → C: Service display).
3. **Sjekk** designkvalitet: farger korrekte, typografi tydelig, dark mode fungerer, WCAG AAA kontrast.
4. **Commit:** kopier commit-meldingen fra `DESIGN_CHECKLIST.md`, kjør `git commit -m "..."`.
5. **Oppdater** `DESIGN_CHECKLIST.md`: marker fase som ferdig, legg inn commit-hash og dato.
6. **Merge til main** når alle 4 faser er klare (se merkekriteria i checklist).

**Commit-maler** er allerede i filen — bare bruk dem direkte.

### Automatisering & MCP-connectors
Vi automatiserer mest mulig via MCP-connectors og CLI-er.
- **Supabase MCP:** hosted HTTP + OAuth, låst til prosjektet via `project_ref`
  i `.mcp.json` (ingen token i repoet — OAuth via `/mcp`). Brukes til
  migrasjoner og DB-ops. Prosjekt-ref: `fuiebtpezpoxvkuuhaqy` (navn:
  «emailchanger», Sverige/Stockholm, eu-north-1).
  Se `supabase/README.md`.
- **Vercel MCP:** tilgjengelig i sessionen for deploy/infra.
- **Prinsipp:** hemmeligheter til connectors settes som miljøvariabler lokalt,
  aldri committet. Skjema/migrasjoner versjoneres i `supabase/migrations/`.

---

## 11. Beslutningslogg (ADR — kort)

| #  | Beslutning                                                        | Dato       |
| -- | ----------------------------------------------------------------- | ---------- |
| 1  | Stack: Vite + React 19 + TS + Tailwind v4, npm workspaces monorepo | 2026-06-18 |
| 2  | Hosting på Vercel (åpen vurdering, jf. §6)                        | 2026-06-18 |
| 3  | Supabase som eneste backend nå; utvid ved trafikk                 | 2026-06-18 |
| 3b | Datalagring i **Sverige (Stockholm, eu-north-1)** — sterkest privacy-PR + Proton-linje; EU-adekvans gir fri GDPR-flyt. EU-residens tilbys separat for B2B ved behov | 2026-06-18 |
| 4  | Innboksskanning 100 % klientside                                  | 2026-06-18 |
| 5  | Kun OAuth (ingen rå IMAP-passord) i v1                            | 2026-06-18 |
| 6  | Profilmodus: zero-knowledge klientside-kryptering + informer bruker | 2026-06-18 |
| 7  | Supabase Auth for Profilmodus                                     | 2026-06-18 |
| 8  | Analyse via Plausible (EU, cookieless) — dekker tracking + personvern | 2026-06-18 |
| 9  | Utvidelse: lokal-først, null brukerdata til vår backend           | 2026-06-18 |
| 10 | Sikkerhetsgjennomgang før hver commit (obligatorisk)             | 2026-06-18 |
| 11 | i18n: engelsk default, alle europeiske språk etter MVP            | 2026-06-18 |
| 12 | Betaling: Stripe, €5 engangskjøp (Mollie som åpen vurdering)     | 2026-06-18 |
| 13 | Utvidelse for både Chrome og Firefox                              | 2026-06-18 |
| 14 | UI-komponenter: shadcn/ui                                         | 2026-06-18 |
| 15 | Testing: Vitest. CI: GitHub Actions                               | 2026-06-18 |
| 16 | Strategi: ikke ren affiliate — utvid til EU-katalog, så B2B       | 2026-06-18 |
| 17 | **Brand:** Nordic Warmth — warm cream (#f9f7f2) + terracotta accent (#c17a5c), IBM Plex Mono headlines | 2026-06-22 |
| 18 | **Branding:** Text-only for now; logo/wordmark etter MVP           | 2026-06-22 |
| 19 | **Design:** Dark mode + light mode, WCAG AAA, desktop-first, open-source fonts | 2026-06-22 |
| 20 | **Services:** Logo for hver tjeneste + landsflagg ved navn         | 2026-06-22 |
| 21 | **Footer:** Links til EU tech websites, newsletter, copyright      | 2026-06-22 |
| 22 | **Innboksskanning:** Server-side (Supabase Edge Function) ikke client-side; årsak: CORS-frihet, sikker token-håndtering, skalering. OAuth kontrolleres av bruker (tilbakekallbar). Metadata-only, token lagres aldri. | 2026-06-24 |
| 23 | **Betalingsflow:** Stripe Elements (client-side form) + Edge Function webhook for verification + affiliate tracking. Live og testbar. | 2026-06-24 |
| 24 | **Scanner som standalone app:** `scanner.digitaleu.me` — egen SPA, samme stack (React, Supabase, Stripe). Separate deployment, integrert med web via affiliate-kryss. | 2026-06-24 |
| 25 | **Design:** UNIFIED across all apps — ONLY European Digital (emerald #10b981, deep navy dark mode) is active. All previous designs (Nordic Warmth, etc.) are DEPRECATED. Web + Scanner use identical design system from digitaleu.me. | 2026-06-25 |
| 26 | **Supabase project migration:** Old project `fuiebtpezpoxvkuuhaqy` replaced with `mwsalzjsvuvlmshxzbxg` (new region: Stockholm, Sweden, eu-north-1). All migrations, functions, and data transferred. Update .env.local and all docs. | 2026-06-25 |

---

## 12. Åpne spørsmål / til revisjon

- **Hosting (Vercel = USA):** spenning mot suverenitets-budskapet. Vurder
  europeisk PaaS (Clever Cloud, Scaleway) før vi profilerer dette tungt utad.
- **Kodehosting:** migrert til Codeberg 🇩🇪 — ferdig.
- **Betaling (Stripe vs Mollie):** Stripe live og fungerer. Mollie 🇳🇱 vurderes ved nestegang.
- **Domeneregistrar (Spaceship):** notert; europeisk registrar ved fornyelse.
- **Innboksskanning server-side:** Arkitektur valgt for sikkerhet/skalering. Se ADR #22. Brukeren bevarer full kontroll via OAuth-tilbakekall.

### Subsystemer i utvikling (ikke i MVP-scope, men built):
- **Social/news automation:** Twitter-posting, news-scraping, newsletter (4 Edge Functions + migrations). Fase 2.
- **Email verification:** send + resend flow for early access.
- **Early access system:** signup + tracking.
- **Breach-sjekking:** HIBP API proxy via Edge Function (live).
- **PDF-rapporter:** generate-report-pdf Edge Function.
- **Betaling:** Stripe checkout + webhook verification + affiliate tracking (live).

---

## 13. Pekere

**Core:**
- `docs/BRAND.md` — design system (colors, typography, components, tone).
- `docs/PROGRESS.md` — eneste levende sprintlogg og statuskilde.
- `docs/DESIGN_CHECKLIST.md` — design implementation roadmap + commit templates.
- `docs/DEVELOPMENT_PLAN.md` — faseinndelt roadmap.
- `docs/SECURITY.md` — sikkerhets- og personverndoktrine + commit-sjekkliste.
- `packages/shared/src/types.ts` — datamodellen (Alternative, StorageMode, DetectedAccount, FillEmailMessage).

**Affiliate / partnere:**
- `docs/AFFILIATE_PROGRAM.md` — **management-hub** og enkeltkilde til sannhet: aktive
  partnere, pipeline, hvor man melder seg på, kvartalsvis sjekkliste. Eies av
  Head of Partnerships-agenten.
- `packages/shared/src/affiliateLinks.ts` — **eneste** kodeplassering for affiliate-lenker
  (`AFFILIATE_LINKS`-mappet). Web + scanner importerer herfra via `@digitaleu/shared`.
- `docs/affiliate-links.md` — rå lenkearkiv (alle Proton-promovarianter). Backup; hubben er driftsvisningen.
- `docs/agents/07-partnerships.md` — agent-personaen som eier affiliate-programmet.

**Scanner & operasjonal:**
- `docs/SCANNER_*.md` — scanner-spesifikasjoner, implementasjon, deployment.
- `docs/OAUTH_SETUP_GUIDE.md` — Gmail/Outlook OAuth setup for lokalt dev + prod.
- `docs/PROGRESS.md` — løpende fremdriftsnotat.
- `EXECUTIVE_SUMMARY.md` — historisk statusoversikt, ikke primær sprintlogg.
- `docs/MARKETING_PLAN.md` — affiliate, content, growth strategy.
- `docs/IA_NAV_RESTRUCTURE.md` — navigasjon og informasjonsarkitektur.
- `supabase/README.md` — Edge Functions og migrations.

**Research & context:**
- `research/` — privat, lokal forskningsmappe (gitignorert). Kildemateriale for utvikling.
