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

## Fase 1 — MVP web-app 🎯 (neste)

**Mål:** En fungerende, sikker nettside der en bruker kan skanne innboksen,
se hvilke tjenester de har, få europeiske alternativer, og låse opp via
affiliate eller betaling.

**Nøkkeloppgaver**
1. **Verktøyoppsett:** shadcn/ui, Vitest, GitHub Actions CI (build/lint/test),
   Plausible-analyse (EU).
2. **Ruting & skall:** klientside-ruting, dashbord-skall med modusbryter
   (Gjest / Profil).
3. **Supabase (EU-region):** prosjekt, Auth, skjema med RLS på alt.
4. **Zero-knowledge-lag:** klientside-kryptering (Web Crypto) for Profilmodus,
   med tydelig brukerinformasjon.
5. **Innboksskanner v1:** Gmail via OAuth (read-only/metadata), 100 % klientside,
   utled tjenesteliste fra avsenderdomener. (Outlook/Graph rett etter.)
6. **Alternativ-matching:** koble oppdagede tjenester til `ALTERNATIVES`.
7. **Monetisering:** affiliate-gate + Stripe €29 engangskjøp.
8. **i18n-fundament:** rammeverk på plass, engelsk som default-locale.
9. **Juridisk:** personvernerklæring + samtykkeflyt for innbokstilgang.

**Sikkerhetshensyn:** §3, §4, §6 i SECURITY.md er kritiske her. Ingen
e-postinnhold til server; minimale scopes; kryptering før lagring.

**Ferdig når:** En bruker kan trygt koble Gmail, se sine tjenester + alternativer,
og låse opp produktet — i både Gjest- og Profilmodus.

---

## Fase 2 — Utvidelse, språk & guider

**Mål:** Gjøre selve byttet enkelt, og bredde ut innholdet.

**Nøkkeloppgaver**
1. **Nettleserutvidelse (MV3):** `apps/extension` som eget workspace; Chrome +
   Firefox. Autofyll av `ny_epost` på eksterne sider; lokal-først; sikker
   meldingsutveksling med web-appen (origin-sjekk).
2. **Outlook/Graph-skanning** ferdigstilt.
3. **i18n-utrulling:** oversett til alle europeiske språk.
4. **Nettleser-sikkerhetsguide:** sammenligning av nettlesere (sikkerhet,
   personvern, opphav) + promotering av trygt, helst europeisk valg.
5. **Bredere alternativ-katalog** med flere kategorier.

**Sikkerhetshensyn:** §5 i SECURITY.md (utvidelsens permissions & messaging).

**Ferdig når:** Bruker kan gå hele veien fra skanning → alternativ → bytte konto
via utvidelsen, på sitt eget språk.

---

## Fase 3 — Europeisk tech-katalog

**Mål:** Fra verktøy til destinasjon. Bred, kuratert og redaksjonelt ærlig
katalog over europeisk teknologi (ikke en ren affiliate-side).

**Nøkkeloppgaver**
1. Kategorisert katalog med søk/filtrering (land, åpen kildekode, modell).
2. Redaksjonelt innhold/guider per kategori.
3. Mobilapper som alternativer (utforsk).
4. Balansert affiliate vs. etiske direkte-anbefalinger.

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

1. Skriv om git-historikken for å fjerne researchdokumentene helt (valgfritt, anbefalt).
2. Sett opp shadcn/ui + Vitest + GitHub Actions CI.
3. Opprett Supabase-prosjekt i EU-region og koble til Auth + RLS-skjema.
4. Bygg dashbord-skall med modusbryter (Gjest/Profil).
