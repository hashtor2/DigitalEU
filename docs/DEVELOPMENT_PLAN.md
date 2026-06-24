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

## Fase 1 — MVP web-app + standalone scanner ✅ (live, Phase 1.5 underway)

**Mål:** En fungerende, sikker nettside der en bruker kan se hvilke tjenester
de har, få europeiske alternativer, en personvernscore, og betale €5 for tilgang.

> **Status nå (2026-06-24):** Både web-app (`digitaleu.me`) og scanner (`scanner.digitaleu.me`)
> er **live på Vercel.** Server-side scanning via Edge Function deployed. Stripe checkout
> integrert. Nordic Warmth brand + dark mode complete. Design system merged.
>
> **Live brukerflyt:** `/` (markedsføring) → `/select` (tjenestevelger) → `/dashboard`
> (personvernrapport). Scanner er standalone SPA på eget subdomene; deler Supabase +
> Stripe config med web.
>
> **Innboksskanning:** Server-side (`scan-email` Edge Function) for sikkerhet/skalering.
> Se ADR #22 og SECURITY.md §3. Brukeren bevarer full kontroll via OAuth.

**Nøkkeloppgaver**
1. [x] **Verktøyoppsett:** shadcn/ui, Vitest, GitHub Actions CI (build/lint/test),
   Plausible-analyse (EU).
2. [x] **Ruting & skall:** React Router v7 på både web og scanner.
3. [x] **Supabase (EU-region):** prosjekt `fuiebtpezpoxvkuuhaqy` (Zürich), Auth, RLS på alt.
4. [x] **Zero-knowledge-lag:** `crypto.ts` (Web Crypto) eksisterer for Profilmodus.
5. [x] **Innboksskanner v1:** Gmail/Outlook via OAuth, server-side (`scan-email` Edge Function),
   live og testbar.
6. [x] **Alternativ-matching:** `SERVICES` ↔ `ALTERNATIVES` i live rapport.
7. [x] **Datalekkasje-sjekk:** `check-breach` Edge Function (HIBP proxy), live.
8. [x] **Monetisering:** `create-checkout` + `stripe-webhook` Edge Functions, Stripe live.
9. [x] **i18n-fundament:** engelsk default; struktur i plass for europeiske språk.
10. [ ] **Juridisk:** personvernerklæring + samtykkeflyt (kreves før Phase 2 utrulling).

**Sikkerhetshensyn:** SECURITY.md §3 (server-side scanning), §4 (moduser), §6 (hemmeligheter).

**Ferdig når:** Juridisk gjennomgang ferdig, Phase 2 prioritert.

---

## Fase 2 — Katalog-ekspansjon & growth 🚧 (prioritert)

**Mål:** Fra verktøy til destinasjon. Bred, kuratert katalog over europeisk
teknologi, med innhold som drar organisk trafikk og affiliate-inntekt.

**Nøkkeloppgaver (prioritert rekkefølge)**
1. [ ] **Juridisk:** personvernerklæring, samtykkeflyt, GDPR-compliance.
2. [ ] **Katalog-innhold:** 50+ tjenester, kategorisert, med redaksjonelt vurderinger.
   - Kryss-tilkoblinger mellom kategorier (f.eks. "best email + cloud storage").
   - Trust-badges (EU-datalag, open-source, no logging, osv.).
3. [ ] **Nettleser-sikkerhetsguide:** sammenligning av moderne nettlesere
   (sikkerhet, personvern, opphav), med anbefaling av europeisk valg.
4. [ ] **i18n-utrulling:** oversett til de 24 viktigste europeiske språkene.
5. [ ] **SEO & content:** blogg-innslag, guider, FAQ — dra søketrafikk.
6. [ ] **Affiliate-integrasjon:** tracking av clicks/conversions per tjeneste,
   partner-onboarding.
7. [ ] **Nettleserutvidelse v1:** autofyll e-postadresse, liten og sikker.

**Revenue drivers (Phase 2)**
- €5 checkout (live, men lav konvertering nå — fokus på katalog-trafikkk).
- Affiliate-inntekt fra partnerlinks (Proton, Tuta, Mullvad, osv.).
- Sponsored posts / partnerskaps-innslag (ærlige, merket).

**Sikkerhetshensyn:** SECURITY.md §5 (utvidelsen), §6 (hemmeligheter).

**Ferdig når:** Katalog har 50+ tjenester, gjennomsnittlig 200+ monthly organic
visits, og affiliate-program er aktiv.

---

## Fase 3 — B2B & suverenitet

**Mål:** Åpne bedriftsmarkedet (EU companies seeking data sovereignty, compliance).

**Nøkkeloppgaver**
1. [ ] **B2B-site/landingsside:** bedriftsbrukstilfeller, GDPR/compliance messaging.
2. [ ] **Bulk onboarding:** API for bedrifter å mappe ansatts e-postadresser → alternativer.
3. [ ] **Premium support:** SLA, dedicated account reps.
4. [ ] **Analytics:** hvem bytter mest? Hvilke kategorier? Hvilke EU-leverandører
   vinner?
5. [ ] **Suverenitets-sertifisering:** ISO 27001, eget EU-dataresidency-offering.

**Revenue potential:** €500-2K/år per SME, €50K+/år per enterprise.

**Ferdig når:** Første 3-5 B2B-kunder onboardet og månedlig gjentakende inntekt etablert.

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
4. [ ] Implementer Stripe €5 engangskjøp og affiliate-synkronisering.
