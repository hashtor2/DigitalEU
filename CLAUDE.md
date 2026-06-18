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

Produktet består av to deler som spiller sammen:
1. **Web-applikasjon (SPA)** — landingsside, innboksskanner, dashbord, betaling.
2. **Nettleserutvidelse (MV3)** — autofyller ny e-postadresse på eksterne sider
   (Netflix, Spotify, ...) slik at det blir lett å bytte kontoadresse.

**Forretningsmodell:** Gratis hvis brukeren registrerer seg hos en partner via
vår affiliate-lenke, ELLER €29 som engangskjøp via betalingsleverandør.

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
trenger det).

```
digitaleu.me/
├── apps/
│   ├── web/          # SPA: Vite + React 19 + TypeScript + Tailwind v4 (+ shadcn/ui)
│   └── extension/    # Chrome/Firefox-utvidelse (Manifest V3) — bygges i Fase 2
├── packages/
│   └── shared/       # Delte typer, alternativ-katalog, hjelpefunksjoner
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
| Komponenter     | shadcn/ui                           | ⏳ planlagt  |
| Backend/DB/Auth | Supabase (EU-region)                | ⏳ planlagt  |
| Betaling        | Stripe (engangskjøp €29)            | ⏳ planlagt  |
| Analyse         | Plausible (🇪🇪 EU, cookieless)        | ⏳ planlagt  |
| Testing         | Vitest                              | ⏳ planlagt  |
| CI              | GitHub Actions (build/lint/test)    | ⏳ planlagt  |
| Hosting         | Vercel (se §6 — åpen vurdering)     | ⏳ planlagt  |

### Dataflyt (overordnet)
- **Innboksskanning** skjer **100 % klientside** via OAuth (Gmail/Outlook),
  med minst mulige (helst read-only/metadata) scopes. E-postinnhold sendes
  aldri til noen server. Vi utleder kun hvilke tjenester brukeren har konto hos.
- **Gjestemodus:** data lever kun i `sessionStorage` på klienten.
- **Profilmodus:** data **krypteres klientside (zero-knowledge)** før de lagres
  i Supabase. Vi skal aldri kunne lese klartekst.
- **Utvidelsen** er **lokal-først**: den mottar `ny_epost` fra web-appen og
  fyller felt lokalt — den sender aldri brukerdata til vår backend.

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
| Backend/DB     | Supabase           | 🇺🇸 USA (open source) | self-host / Nhost; **data i Sveits (Zürich, eu-central-2)** | ✅ Data i Sveits 🇨🇭 |
| Hosting        | Vercel             | 🇺🇸 USA         | Clever Cloud 🇫🇷, Scaleway 🇫🇷, OVHcloud 🇫🇷, Hetzner 🇩🇪 | ⚠️ Åpen vurdering |
| Kodehosting    | GitHub             | 🇺🇸 Microsoft   | Codeberg 🇩🇪, GitLab (self-host) | ⚠️ Åpen vurdering (rapporten anbefaler migrering) |
| Betaling       | Stripe             | 🇺🇸/🇮🇪          | Mollie 🇳🇱, Paddle               | ⚠️ Åpen vurdering              |
| Domeneregistrar| Spaceship          | 🇺🇸 (antatt)    | Gandi 🇫🇷, INWX 🇩🇪, Netim 🇫🇷     | ⚠️ Notert (domenet er kjøpt)   |
| Breach-sjekk   | Have I Been Pwned  | 🌍 (ikke-EU)    | (ingen reelt ekvivalent)        | ✅ Akseptabelt unntak (sikkerhetstjeneste) |

> Domenet **digitaleu.me** er kjøpt og driftes via Spaceship.
> "Åpen vurdering" = bevisst beholdt nå for utviklerhastighet, men skal revurderes
> – særlig før vi profilerer suverenitet tungt utad, av troverdighetshensyn.

---

## 7. Forretningsmodell & produktnotater

- **Pris:** Gratis via partner-affiliate ELLER €29 engangskjøp (Stripe).
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
# Repo: https://github.com/hashthor/digitaleu.me (privat). Konto: hashthor.
git add -A && git commit -m "..." && git push
```

**Før commit:** kjør sikkerhetssjekklisten i `docs/SECURITY.md` (hemmeligheter,
scopes, datalekkasje, avhengigheter).

### Automatisering & MCP-connectors
Vi automatiserer mest mulig via MCP-connectors og CLI-er.
- **Supabase MCP:** hosted HTTP + OAuth, låst til prosjektet via `project_ref`
  i `.mcp.json` (ingen token i repoet — OAuth via `/mcp`). Brukes til
  migrasjoner og DB-ops. Prosjekt-ref: `lttfqyrfmsgmbzvfkfij` (Sveits/Zürich).
  Se `supabase/README.md`.
- **Vercel MCP:** tilgjengelig i sessionen for deploy/infra.
- **Prinsipp:** hemmeligheter til connectors settes som miljøvariabler lokalt,
  aldri committet. Skjema/migrasjoner versjoneres i `supabase/migrations/`.

---

## 10. Beslutningslogg (ADR — kort)

| #  | Beslutning                                                        | Dato       |
| -- | ----------------------------------------------------------------- | ---------- |
| 1  | Stack: Vite + React 19 + TS + Tailwind v4, npm workspaces monorepo | 2026-06-18 |
| 2  | Hosting på Vercel (åpen vurdering, jf. §6)                        | 2026-06-18 |
| 3  | Supabase som eneste backend nå; utvid ved trafikk                 | 2026-06-18 |
| 3b | Datalagring i **Sveits (Zürich, eu-central-2)** — sterkest privacy-PR + Proton-linje; EU-adekvans gir fri GDPR-flyt. EU-residens tilbys separat for B2B ved behov | 2026-06-18 |
| 4  | Innboksskanning 100 % klientside                                  | 2026-06-18 |
| 5  | Kun OAuth (ingen rå IMAP-passord) i v1                            | 2026-06-18 |
| 6  | Profilmodus: zero-knowledge klientside-kryptering + informer bruker | 2026-06-18 |
| 7  | Supabase Auth for Profilmodus                                     | 2026-06-18 |
| 8  | Analyse via Plausible (EU, cookieless) — dekker tracking + personvern | 2026-06-18 |
| 9  | Utvidelse: lokal-først, null brukerdata til vår backend           | 2026-06-18 |
| 10 | Sikkerhetsgjennomgang før hver commit (obligatorisk)             | 2026-06-18 |
| 11 | i18n: engelsk default, alle europeiske språk etter MVP            | 2026-06-18 |
| 12 | Betaling: Stripe, €29 engangskjøp (Mollie som åpen vurdering)     | 2026-06-18 |
| 13 | Utvidelse for både Chrome og Firefox                              | 2026-06-18 |
| 14 | UI-komponenter: shadcn/ui                                         | 2026-06-18 |
| 15 | Testing: Vitest. CI: GitHub Actions                               | 2026-06-18 |
| 16 | Strategi: ikke ren affiliate — utvid til EU-katalog, så B2B       | 2026-06-18 |

---

## 11. Åpne spørsmål / til revisjon

- **Hosting (Vercel = USA):** spenning mot suverenitets-budskapet. Vurder
  europeisk PaaS (Clever Cloud, Scaleway) før vi profilerer dette tungt utad.
- **Kodehosting (GitHub):** vurder Codeberg/GitLab — rapporten anbefaler migrering.
- **Betaling (Stripe vs Mollie):** Mollie 🇳🇱 er mer "on-brand".
- **Domeneregistrar (Spaceship):** notert; europeisk registrar ved fornyelse.
- **Git-historikk:** researchdokumentene finnes i første commit-historikk — kan
  skrives bort ved behov for full renhet.

---

## 12. Pekere

- `docs/DEVELOPMENT_PLAN.md` — faseinndelt roadmap.
- `docs/SECURITY.md` — sikkerhets- og personverndoktrine + commit-sjekkliste.
- `research/` — privat, lokal forskningsmappe (gitignorert). Kildemateriale for utvikling.
- `packages/shared/src/types.ts` — datamodellen (Alternative, StorageMode,
  DetectedAccount, FillEmailMessage).
