# SECURITY.md — Sikkerhets- og personverndoktrine

> digitaleu.me ber om tilgang til noe av det mest private en bruker har:
> e-postinnboksen. Tilliten det krever er produktets viktigste valuta.
> Dette dokumentet er ikke "nice to have" — det er kjernen i produktet.
> Les sammen med `CLAUDE.md` §3 og §5.

---

## 1. Trusselmodell & filosofi

Vi designer som om vi selv er en motstander vi ikke vil stole på. Mål: selv om
vår infrastruktur kompromitteres, skal brukerens private data forbli beskyttet.

Konsekvenser:
- Vi vil **ikke kunne lese** brukerens innbokssinnhold (det forlater aldri klienten).
- Vi vil **ikke kunne lese** brukerens lagrede profildata (kryptert klientside).
- Et brudd hos oss skal eksponere minst mulig — helst bare kryptert "støy".

---

## 2. Dataklassifisering

| Klasse                | Eksempler                                  | Håndtering                                  |
| --------------------- | ------------------------------------------ | ------------------------------------------- |
| **Svært sensitiv**    | E-postinnhold, OAuth-tokens                | Aldri til vår server. Kun i minne/klient.   |
| **Sensitiv**          | Liste over tjenester brukeren har konto hos | Gjest: sessionStorage. Profil: kryptert.    |
| **Personopplysning**  | E-postadresse, kontostatus                 | Kryptert i Profilmodus; minimeres.          |
| **Ikke-sensitiv**     | Alternativ-katalog, UI-state               | Fritt.                                       |

Grunnregel: **datamininmering** — samle og lagre minst mulig, kortest mulig.

---

## 3. Innboksskanning (kjernefunksjon — høyest risiko)

- **Kun OAuth.** Ingen rå IMAP-passord i v1. Bruk Gmail API / Microsoft Graph.
- **Minimale scopes.** Be om read-only / metadata-scope der det dekker behovet
  (vi trenger i praksis bare avsender-domener, ikke meldingstekst).
  - Gmail: `gmail.metadata` (avsenderdomener, aldri body/vedlegg)
  - Outlook: `Mail.ReadBasic` (avsender, dato, aldri body/vedlegg)
- **Authorization Code + PKCE (KRITISK).**
  - **NB:** Ikke Implicit Grant (deprecated). Tokens må ALDRI være i URL hash.
  - Flyt: Bruker → Google/Microsoft → code → Edge Function exchange → access token
    (edge-only) → Edge Function bruker token → domenelisten til klient.
  - Detaljert guide: se `OAUTH_FLOW_MIGRATION.md`.
  - **Deadline:** Implementer før offentlig lansering.
- **Server-side (Supabase Edge Function `scan-email`).** Grunner:
  - **CORS-frihet:** code kan sendes fra nettleseren til Edge Function uten
    CORS-problemer med Gmail/Outlook.
  - **Sikker token-håndtering:** access token behandles kun på Edge Function,
    aldri eksponert i HTML/JS eller URL.
  - **Bedre error-recovery:** timeout/rate-limiting håndteres server-side.
  - **Skalering:** håndterer flere samtidige brukere uten blokkering av klienten.
- **Metadata-only.** Edge Function leser kun avsenderdomener fra meldingsheadere,
  aldri e-postinnhold eller vedlegg. Data ekstraheres og returneres; token lagres
  aldri.
- **Ephemeral token flow:**
  1. Bruker autentiserer via Google/Microsoft OAuth.
  2. Google/Microsoft returnerer **authorization code** (ikke access token).
  3. Klient sender code til Edge Function over HTTPS (sammen med code_verifier).
  4. Edge Function bytter code + code_verifier mot access token hos Google/Microsoft.
  5. Access token brukes umiddelbar for å hente metadata, ekstraherer domener.
  6. Access token og code kastes umiddelbar etter; lagres aldri i Supabase.
  7. Kun domenelisten returneres til klienten.
- **Åpenhet:** Forklar tydelig, før tilkobling, at vi bruker OAuth-token for
  server-side scanning, at data er metadata-only, og at brukeren kan tilbakekalle
  tilgang når som helst (OAuth-revoking, ikke vår kontroll).
- **Revoker-lett:** Gjør det enkelt for brukeren å koble fra / trekke tilbake tilgang.
  Viser Google-/Microsoft-tillatelsesside slik bruker kan oppheve i oprindelig
  leverandør.

---

## 4. To moduser for datahåndtering

### Gjestemodus (standard, mest privat)
- All data i `sessionStorage` — forsvinner når fanen lukkes.
- Ingenting sendes til eller lagres hos oss.

### Profilmodus (lagret fremgang — zero-knowledge)
- Data **krypteres klientside før** de sendes til Supabase.
- Bruk **Web Crypto API** (AES-GCM). Nøkkel avledes fra en brukerhemmelighet
  (passphrase) via en sterk KDF (Argon2id der mulig, ellers PBKDF2 med høy
  iterasjonstelling). Nøkkelen forlater aldri klienten.
- Supabase ser bare chiffertekst. **Vi kan ikke dekryptere.**
- **Forsvar i dybden:** Row Level Security (RLS) på alle tabeller, slik at en
  bruker kun når sine egne rader — selv om krypteringen skulle svikte.
- **Informer brukeren** om at data er ende-til-ende-kryptert, og om konsekvensen:
  mister de passphrasen, mister de dataene (ingen baksdør hos oss).

---

## 5. Nettleserutvidelsen (Manifest V3)

- **Lokal-først:** Utvidelsen sender **aldri** brukerdata til vår backend.
- **Minimale permissions:** Be kun om `host_permissions` for de sidene autofyll
  faktisk trenger; unngå `<all_urls>` der det går. Bruk `activeTab` der mulig.
- **Minste privilegium i content scripts:** Injiser kun det som trengs, kun på
  relevante sider.
- **Sikker meldingsutveksling:** Web-app ↔ utvidelse via `externally_connectable`
  med streng origin-sjekk (kun digitaleu.me). Valider all innkommende data mot
  `FillEmailMessage`-typen.
- **Ingen ekstern kode:** All kode pakkes med utvidelsen (MV3-krav). Ingen
  remote-evaluering.

---

## 6. Hemmeligheter & konfigurasjon

- **Aldri** API-nøkler, tokens eller hemmeligheter i repoet.
- Bruk `.env` (gitignorert) lokalt; Vercel/Supabase env-vars i drift.
- `anon`-nøkkel fra Supabase er offentlig- by-design, men beskytt alltid med RLS.
- `service_role`-nøkkel: kun server-side/edge, aldri i klientbundle.

---

## 7. Avhengigheter & forsyningskjede

- Hold avhengigheter få og begrunnede — hver pakke er angrepsflate.
- Kjør `npm audit` jevnlig; vurder Dependabot/CI-skann.
- Foretrekk veletablerte, vedlikeholdte pakker; unngå obskure transitive avhengigheter.

---

## 8. Etterlevelse (GDPR m.m.)

- **Rettslig grunnlag & samtykke** for innbokstilgang — informert og spesifikt.
- **Rett til sletting:** brukeren kan slette profil og data fullstendig.
- **Dataportabilitet & innsyn:** legg til rette for eksport.
- **Personvernerklæring** som ærlig beskriver den faktiske (minimale) databehandlingen.
- **EU-datalagring:** velg EU-region for Supabase og andre tjenester (jf. CLAUDE.md §6).

---

## 9. Tredjepartsoppslag — datalekkasje-sjekk (Have I Been Pwned)

Funksjonen lar brukeren sjekke om e-posten finnes i kjente datalekkasjer.

- **API-nøkkel er hemmelig:** HIBP API v3 (`breachedaccount`) krever en
  `hibp-api-key`. Den ligger KUN server-side (backend-proxy: Supabase Edge
  Function / Vercel-funksjon), **aldri** i klientbundle eller en `VITE_`-variabel.
- **Backend-proxy:** klienten kaller vår egen funksjon, som kaller HIBP. Slik
  eksponeres ikke nøkkelen, og vi kan håndtere rate limiting og caching.
- **Informert samtykke:** e-posten sendes til en tredjepart (HIBP). Forklar dette
  tydelig før oppslaget. Logg ikke e-post eller resultat unødig.
- **Datamininmering:** ikke persister breach-resultater i klartekst knyttet til
  bruker; i Profilmodus følger evt. lagring zero-knowledge-modellen.
- **EU-merknad:** HIBP er ikke-europeisk, men en anerkjent sikkerhetstjeneste
  uten reelt europeisk ekvivalent for dette datasettet — akseptabelt unntak fra
  europeisk-først (jf. CLAUDE.md §6), nettopp fordi det er et sikkerhetsverktøy.

## 10. CASA Tier 2 Security Assessment (KRITISK for Gmail `gmail.metadata`)

**Status:** Må initieres før offentlig lansering.

**Bakgrunn:**
- `gmail.metadata` er en **Restricted Scope** hos Google.
- Apps som er offentlig tilgjengelige (ikke intern/personlig bruk) krever årlig
  CASA Tier 2-sertifisering av tredjepart-lab.
- Uten sertifisering får brukeren "Unverified App"-advarsel og app er capped til 100 test users.

**Aksjon:**
1. **Kontakt Google eller autorisert lab** (f.eks. Coalfire, Corsec) for CASA Tier 2 self-serve assessment.
2. **Budget:** $540–$1,000 (varierer per lab).
3. **Tidslinje:** 4–8 uker for gjennomgang.
4. **Deliverable:** Security assessment rapport som Google aksepterer.
5. **Implementering:** Resultatet skal dokumenteres i en CASA_TIER_2_ROADMAP.md.

**Hva blir vurdert:**
- OAuth flow sikkerhet (PKCE, token-håndtering, scope-minimering).
- Data-handling (metadata-only, ingen lagring).
- Infrastruktur og RLS-policyer.
- Incident response & datalekkasje-prosedyrer.

Se `CASA_TIER_2_ROADMAP.md` for detaljer.

---

## 11. Edge Function Logging & Metadata Caching (KRITISK)

**Sikkerhetskrav:**
- Alle `console.log()`, `console.warn()`, `console.error()` som omhandler eller exponerer
  access tokens, brukerdata eller e-postdomener **må fjernes** før produksjon.
- Edge Functions logges automatisk av Supabase — logs kan få tilgang fra
  attackers hvis Supabase-kontoen kompromitteres.

**Implementering:**
- Fjern debug-logging av tokens, sender-domener og antall meldinger.
- Behold kun kritisk error-logging (f.eks. "OAuth exchange failed") uten PII/tokens.
- Bruk structured logging eller external service for sikker audit-logging.
- Test i staging før deploy.

Se `OAUTH_FLOW_MIGRATION.md` §3 for konkrete endringer.

---

## 12. B2B Admin Consent (Outlook i Enterprise)

**Scenario:** B2B kunder med Microsoft Entra ID (Azure AD) enterprise.

**Realitet:**
- Selv `Mail.ReadBasic` kan kreve tenant-wide **Admin Consent** i enterprise-miljøer.
- Admin Consent legges inn av IT-administrator, ikke slutt-bruker.

**Løsning:**
- Opprett en dedikert IT-admin-guide med eksakt scope-begrunnelse.
- Legg inn links til Microsoft docs for Admin Consent flow.
- Se `B2B_ADMIN_CONSENT_GUIDE.md` for malen.

---

## 13. Sikkerhetssjekkliste FØR HVER COMMIT (obligatorisk)

Gå gjennom denne før `git commit`:

- [ ] Ingen hemmeligheter/nøkler/tokens i diffen (heller ikke i kommentarer/tester).
- [ ] Ingen brukerdata, e-postinnhold, domener eller PII logget eller persistert utilsiktet.
- [ ] OAuth-scopes er fortsatt minimale — ingen ny scope sneket inn.
- [ ] Klientside-kryptering omgås ikke (ingen klartekst-profildata mot Supabase).
- [ ] Edge Function: ingen console.* statements som exponerer tokens eller metadata.
- [ ] Authorization Code + PKCE: tokens aldri i URL hash.
- [ ] Rate limiting på Edge Functions for å forhindre abuse.
- [ ] RLS-policy finnes for nye tabeller.
- [ ] Utvidelsen sender ikke brukerdata ut; permissions ikke utvidet unødig.
- [ ] Nye avhengigheter er nødvendige og vurdert.
- [ ] Brukervendt tekst lekker ikke sikkerhetsantakelser / villeder ikke om personvern.

> Ved tvil: stopp og still spørsmål før commit. Sikkerhet > hastighet.
