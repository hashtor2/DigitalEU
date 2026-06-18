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
- **100 % klientside.** Skanning og analyse skjer i nettleseren. E-postinnhold
  sendes **aldri** til vår backend, og logges aldri.
- **In-memory.** Behandle data i minnet; ikke persister rådata. Resultatet er en
  avledet liste over tjenester/domener.
- **Token-håndtering:**
  - *Gjestemodus:* token lever kun i økten; ingen persistering utover `sessionStorage`.
  - *Profilmodus:* unngå å lagre langlivede tokens hvis mulig; hvis nødvendig,
    behandle som svært sensitivt og krypter klientside.
- **Åpenhet:** Forklar tydelig, før tilkobling, hva vi gjør (og ikke gjør) med
  innboksen. Samtykke skal være informert.
- **Revoker-lett:** Gjør det enkelt for brukeren å koble fra / trekke tilbake tilgang.

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

## 9. Sikkerhetssjekkliste FØR HVER COMMIT (obligatorisk)

Gå gjennom denne før `git commit`:

- [ ] Ingen hemmeligheter/nøkler/tokens i diffen (heller ikke i kommentarer/tester).
- [ ] Ingen brukerdata, e-postinnhold eller PII logget eller persistert utilsiktet.
- [ ] OAuth-scopes er fortsatt minimale — ingen ny scope sneket inn.
- [ ] Klientside-kryptering omgås ikke (ingen klartekst-profildata mot Supabase).
- [ ] RLS-policy finnes for nye tabeller.
- [ ] Utvidelsen sender ikke brukerdata ut; permissions ikke utvidet unødig.
- [ ] Nye avhengigheter er nødvendige og vurdert.
- [ ] Brukervendt tekst lekker ikke sikkerhetsantakelser / villeder ikke om personvern.

> Ved tvil: stopp og still spørsmål før commit. Sikkerhet > hastighet.
