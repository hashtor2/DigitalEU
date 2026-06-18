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

## Fase 1 — MVP web-app 🎯 (ferdigstilt)

**Mål:** En fungerende, sikker nettside der en bruker kan skanne innboksen,
se hvilke tjenester de har, få europeiske alternativer, og låse opp via
affiliate eller betaling.

**Nøkkeloppgaver**
1. [x] **Verktøyoppsett:** shadcn/ui, Vitest, GitHub Actions CI (build/lint/test),
   Plausible-analyse (EU).
2. [x] **Ruting & skall:** klientside-ruting, dashbord-skall med modusbryter
   (Gjest / Profil).
3. [x] **Supabase (EU-region):** prosjekt, Auth, skjema med RLS på alt.
4. [x] **Zero-knowledge-lag:** klientside-kryptering (Web Crypto) for Profilmodus,
   med tydelig brukerinformasjon.
5. [x] **Innboksskanner v1:** Gmail via OAuth (read-only/metadata), 100 % klientside,
   utled tjenesteliste fra avsenderdomener.
6. [x] **Alternativ-matching:** koble oppdagede tjenester til `ALTERNATIVES`.
7. [x] **Datalekkasje-sjekk (Have I Been Pwned):** secure Supabase Edge Function
   API-proxy for lekkasjesjekker med sandbox-fallback.
8. [ ] **Monetisering:** affiliate-gate + Stripe €29 engangskjøp.
9. [x] **i18n-fundament:** engelsk default-locale, fullstendig oversatt landingsside og dashboard.
10. [ ] **Juridisk:** personvernerklæring + samtykkeflyt for innbokstilgang.

**Sikkerhetshensyn:** §3, §4, §6 i SECURITY.md er kritiske her. Ingen
e-postinnhold til server; minimale scopes; kryptering før lagring.

**Ferdig når:** En bruker kan trygt koble Gmail, se sine tjenester + alternativer,
og låse opp produktet — i både Gjest- og Profilmodus.

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
