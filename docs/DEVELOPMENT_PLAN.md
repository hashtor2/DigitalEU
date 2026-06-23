# DEVELOPMENT_PLAN.md — Faseinndelt roadmap

> Lever sammen med `CLAUDE.md` (master-kontekst) og `docs/SECURITY.md`.
> Planen er retningsgivende, ikke en kontrakt — vi itererer. Hver fase har
> mål, nøkkeloppgaver, sikkerhetshensyn og "ferdig når"-kriterier.

---

## Fase 0 — Fundament ✅ (fullført)

**Mål:** Teknisk grunnstruktur som er lett å utvide.

- [x] Monorepo (npm workspaces): `apps/web`, `apps/extension`, `packages/shared`.
- [x] Web-app: Vite + React 19 + TS + Tailwind v4 + minimal landingsside.
- [x] Delte typer i `@digitaleu/shared`.
- [x] Privat GitHub-repo, `.gitignore`, `.gitattributes`, `research/` utenfor git.
- [x] CLAUDE.md + sikkerhets- og plandokumenter.

---

## Fase 1 — MVP web-app 🚧 (byggeklosser ferdige; live-flyt forenklet)

**Mål:** En fungerende, sikker nettside der en bruker kan se hvilke tjenester
de har, få europeiske alternativer og en personvernscore.

> **Status nå (faktisk flyt, 2026-06-20):** Den *live* brukerflyten er forenklet:
> `/` (markedsføring) → `/select` (manuell tjenestevelger) → `/dashboard`
> (statisk personvernrapport drevet av valget). De avanserte byggeklossene
> nedenfor — OAuth-innboksskanning, zero-knowledge-kryptering, Gjest/Profil-modus
> — **finnes som ferdige, testede moduler** (`apps/web/src/lib/gmailScanner.ts`,
> `outlookScanner.ts`, `crypto.ts`, `guestStorage.ts`, `hooks/useMigrationState.ts`),
> men er **for øyeblikket ikke koblet inn** i den nye dashbord-flyten. Se ADR #18.

**Nøkkeloppgaver**
1. [x] **Verktøyoppsett:** shadcn/ui, Vitest, GitHub Actions CI (build/lint/test),
   Plausible-analyse (EU).
2. [x] **Ruting & skall:** klientside-ruting. *Modusbryter (Gjest/Profil) finnes i
   `useMigrationState`/Header, men er ikke eksponert i den nye dashbord-flyten.*
3. [x] **Supabase (EU-region):** prosjekt, Auth, skjema med RLS på alt
   (nytt prosjekt `fuiebtpezpoxvkuuhaqy`, Zürich; `user_vault`-trigger i 0002).
4. [x] **Zero-knowledge-lag:** `crypto.ts` (Web Crypto) finnes + testet.
   *Ikke koblet inn i live-flyt nå (ingen Profilmodus-skriving i dashbordet).*
5. [~] **Innboksskanner v1 — multi-candidate testing:** Gmail/Outlook via OAuth (metadata), 100 % klientside.
   **Lovable-prototype** (React) integrert i `/emailscanner` (2026-06-23) med OAuth + Nordic Warmth styling.
   Testing multiple scanner implementations before locking canonical version for live dashboard. See memory: `scanner-testing-strategy.md`.
6. [x] **Alternativ-matching:** `SERVICES` kobles til `ALTERNATIVES`
   (`euAlternativeId`); brukt i den nye rapporten.
7. [x] **Datalekkasje-sjekk (Have I Been Pwned):** secure Supabase Edge Function
   API-proxy med sandbox-fallback. *Ikke eksponert i live UI ennå.*
8. [~] **Monetisering:** `create-checkout` Edge Function (Stripe €29) skrevet.
   **Utsatt** — ikke prioritert nå (UI-wiring + affiliate-gate gjenstår).
9. [x] **i18n-fundament:** engelsk default-locale.
10. [ ] **Juridisk:** personvernerklæring + samtykkeflyt (kreves før OAuth-skanning
   re-eksponeres utad).

**Ny, live MVP-flyt (lagt til i denne fasen)**
- [x] **Tjenestevelger (`SelectorPage`):** søk/filtrer og velg tjenester; lagres i
  `sessionStorage` (gjest-først, ingen server).
- [x] **Tjenestekatalog med trusselscore (`services.ts`):** trussel-/personvern-
  scorer, eierland, slett-/bytt-e-post-lenker per tjeneste.
- [x] **Personvernrapport (`DashboardPage`):** tabell med scorer + EU-alternativ
  per valgt tjeneste.

**Sikkerhetshensyn:** §3, §4, §6 i SECURITY.md. Den nåværende live-flyten holder
data i `sessionStorage` (gjest-først) og sender ingenting til server.

**Ferdig når:** Beslutning tatt om kanonisk flyt (se ADR #18), og den valgte
flyten er trygg og komplett ende-til-ende.

---

## Fase 2 — Utvidelse, språk & guider 🚧 (påbegynt)

**Mål:** Gjøre selve byttet enkelt, og bredde ut innholdet.

**Nøkkeloppgaver**
1. [x] **Nettleserutvidelse (MV3):** `apps/extension` med background, content-autofill og popup.
2. [x] **Outlook/Graph-skanning** ferdigstilt og integrert i dashbordet.
3. [ ] **i18n-utrulling:** oversett til alle europeiske språk.
4. [ ] **Nettleser-sikkerhetsguide:** sammenligning av nettlesere (sikkerhet,
   personvern, opphav) + promotering av trygt, helst europeisk valg.
5. [x] **Bredere alternativ-katalog** med flere kategorier og real-time filtrering.

**Sikkerhetshensyn:** §5 i SECURITY.md (utvidelsens permissions & messaging).

**Ferdig når:** Bruker kan gå hele veien fra skanning → alternativ → bytte konto
via utvidelsen, på sitt eget språk.

---

## Fase 3 — Europeisk tech-katalog

**Mål:** Fra verktøy til destinasjon. Bred, kuratert og redaksjonelt ærlig
katalog over europeisk teknologi (ikke en ren affiliate-side).

**Nøkkeloppgaver**
1. [x] **Kategorisert katalog med søk/filtrering** (DirectoryPage.tsx).
2. [ ] Redaksjonelt innhold/guider per kategori.
3. [ ] Mobilapper som alternativer (utforsk).
4. [ ] Balansert affiliate vs. etiske direkte-anbefalinger.

---

## Fase 4 — B2B

**Mål:** Adressere bedriftsmarkedet (størst inntektspotensial).

**Nøkkeloppgaver (utforskes)**
1. B2B-migreringsverktøy / -vurdering (suverenitet, compliance, CLOUD Act-risiko).
2. Team-/organisasjonskontoer.
3. Tjeneste-/konsulentlag rundt migrering.

---

## Tverrgående (gjelder alle faser)

- **Sikkerhet:** sjekkliste før hver commit (SECURITY.md §9).
- **Europeisk-først:** vurder EU-alternativ ved hvert nytt verktøyvalg (CLAUDE.md §6).
- **Testing & CI:** voks testdekning med funksjonalitet; CI grønn før merge.
- **Åpenhet:** all databehandling skal være ærlig dokumentert utad.

---

## Umiddelbare neste steg (konkret)

1. [x] Bygg innboksskanner, sjekkliste og autofyll-utvidelse (MV3).
2. [x] Integrer Google og Microsoft Graph metadata-skanning.
3. [ ] Sett opp OAuth Client IDs på dine Google- og Azure-kontoer for live-testing.
4. [ ] Implementer Stripe €29 engangskjøp og affiliate-synkronisering.
