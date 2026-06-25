# TELEGRAM_AGENTS.md — Telegram-styrte AI-agenter for digitaleu.me

> **Status:** SPEC / planlagt (ikke bygget). Skrevet 2026-06-25.
> **Eier:** Tor (solo founder) + Lead Engineer-agenten.
> **Formål:** Gjøre de eksisterende persona-promptene i `docs/agents/` om til
> *levende, Telegram-styrte agenter som kan utføre faktisk arbeid* i repoet.
>
> Denne filen er den autoritative spesifikasjonen. Bygg etter den. Endrer vi en
> beslutning, oppdater §9 (beslutningslogg) her og ADR-en i `CLAUDE.md` ved behov.

---

## 1. Mål

I dag er agentene i `docs/agents/` rene system-prompts: du limer dem inn i en
AI-chat manuelt. Vi vil gjøre dem **operative**:

- Snakke med hver agent i en **egen Telegram-chat** (én bot per agent).
- Agenten skal kunne **utføre oppgaver** — lese/skrive filer, kjøre kommandoer,
  committe til git — ikke bare gi råd.
- Alltid-på: tilgjengelig fra mobilen, uavhengig av om PC-en er på.

Ikke-mål (nå): web-UI, stemmestyring, integrasjon mot ekte brukerdata, autonome
agenter som jobber uten at jeg starter en oppgave.

---

## 2. Valgte beslutninger (fra planleggingen 2026-06-25)

| Beslutning | Valg | Begrunnelse |
|---|---|---|
| **Eksekveringsnivå** | **Full repo-tilgang** | Agentene skal kunne gjøre ekte arbeid (read/write/bash/git), ikke bare svare. Krever streng sikkerhet — se §6. |
| **Bot-topologi** | **10 separate bots** (én token per agent) | Reneste mentale modell: 10 uavhengige DM-tråder. Hver agent = egen BotFather-bot. |
| **Hosting** | **EU VM (Hetzner 🇩🇪)** | Følger europeisk-først-prinsippet (CLAUDE.md §6). Alltid-på, full filsystem + git. ~€4/mnd. |
| **Eksekveringsmotor** | **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) | Headless Claude Code. Eneste rene vei til faktisk oppgaveutførelse. Persona-`.md` brukes som system-prompt uendret. |
| **Isolasjon** | **Git worktree per agent** | 10 agenter som skriver i samme klone kolliderer. Hver agent på egen branch `agent/<rolle>`. |

---

## 3. Arkitektur

```
Telegram (10 bots — én per agent)
        │  long-poll / webhook
        ▼
Hetzner VM 🇩🇪  (Ubuntu, ~€4/mnd, alltid-på, pm2-styrt)
  ├── orchestrator (Node/TS-prosess)
  │     ├── bot[01-ceo]       → persona = docs/agents/01-ceo.md
  │     ├── bot[02-marketer]  → persona = docs/agents/02-marketer.md
  │     ├── ... 10 bots, hver sin BotFather-token
  │     └── felles melding-loop: motta → sjekk eier → kjør agent → svar
  │
  ├── Claude Agent SDK  (@anthropic-ai/claude-agent-sdk)
  │     én session per agent; persona som systemPrompt
  │     verktøy: Read/Write/Edit/Bash/Grep/Glob + git
  │
  └── repo-klone  (KASTBAR — ikke min ekte arbeidstre)
        └── git worktree per agent → hver agent på egen branch
```

**Hvorfor hver del:**
- **Claude Agent SDK** er headless Claude Code. Det er den eneste rene måten å få
  *oppgaveutførelse* (filendringer, bash, git) i stedet for bare chat. Hver
  persona-fil legges inn som system-prompt **uendret** — de eksisterende
  `.md`-filene blir agent-definisjonene uten omskriving.
- **Én prosess, 10 bot-tokens.** Hver bot poller Telegram uavhengig, men deler
  orchestrator-koden. Legge til agent #11 senere = ny token + ny persona-fil,
  ingen ny infrastruktur.
- **Git worktree per agent.** 10 agenter som skriver i én klone kolliderer
  konstant. Hver agent får eget worktree på branch `agent/ceo`, `agent/engineer`
  osv. De rører aldri hverandres arbeid eller `main`.

---

## 4. Agentene (10)

8 finnes allerede i `docs/agents/`. Vi legger til 2 som roadmappen trenger.

| # | Fil | Rolle | Status |
|---|------|------|--------|
| 1 | `01-ceo.md` | CEO / sjefsstrateg | ✅ finnes |
| 2 | `02-marketer.md` | CMO / markedsfører | ✅ finnes |
| 3 | `03-writer.md` | Redaktør / skribent | ✅ finnes |
| 4 | `04-designer.md` | Designsjef / UX | ✅ finnes |
| 5 | `05-engineer.md` | Teknisk leder | ✅ finnes |
| 6 | `06-legal.md` | Juridisk & personvern | ✅ finnes |
| 7 | `07-partnerships.md` | Partnerskapssjef | ✅ finnes |
| 8 | `08-support.md` | Kundestøtteleder | ✅ finnes |
| 9 | `09-researcher.md` | **Research/Analyst** — eier EU-tech-katalogresearch (jf. `GeminiResearchOnEUTechAlternatives.md`); Fase 2-kjerne | ✏️ ny |
| 10 | `10-devops.md` | **DevOps/Release** — Supabase-migrasjoner, Edge Functions, deploy, overvåking | ✏️ ny |

> **Åpent valg:** #10 kan byttes til en **QA/Security Auditor** i stedet — passer
> trolig bedre med security-first-etosen. Avgjøres i Fase 0.

Persona-filene må følge eksisterende format: Block A (prosjektkontekst),
Block B (team-oversikt), Block C (rolle). Når #9 og #10 legges til må Block B
oppdateres i **alle 10 filene** så teamlista stemmer.

---

## 5. Hvordan det fungerer (melding-flyt)

1. Jeg sender en melding til f.eks. **@digitaleu_engineer_bot** på Telegram.
2. Orchestrator mottar oppdateringen, sjekker **avsenderens numeriske Telegram-ID**
   mot eier-allowlist. Ukjent ID → ignoreres stille.
3. Riktig agent-session velges (persona = `05-engineer.md`, worktree = `agent/engineer`).
4. Agent SDK kjører meldingen som en tur med full verktøytilgang i agentens worktree.
5. Eventuelle filendringer committes på agentens branch (aldri `main`).
6. Agenten svarer i chatten med resultat + diff/oppsummering.
7. Hele kjeden logges (§6.5).

**Per-agent kommandoer (Fase 4):**
- `/reset` — nullstill samtalekontekst for denne agenten.
- `/branch` — vis/bytt agentens arbeidsbranch.
- `/status` — vis siste handlinger, ucommittede endringer, gjeldende branch.
- `/diff` — vis diff for agentens branch mot `main`.

---

## 6. Sikkerhetsmodell (ufravikelig)

En Telegram-bot med bash + git er i praksis et **remote-code-execution-endepunkt**.
Dette er den farligste komponenten i hele stacken — større eksponering enn
scanneren. Harde regler:

1. **Eier-allowlist.** Hver bot sjekker innkommende Telegram numerisk bruker-ID
   mot **min** ID og dropper alle andre stille. Bot-tokens lekker; dette er den
   reelle porten — ikke stol på at token-et er hemmelig.
2. **VM-klonen har INGEN ekte hemmeligheter og INGEN brukerdata.** Ingen prod-`.env`,
   ingen Supabase `service_role`, ingen Stripe live-nøkler, ingen OAuth-secrets.
   Hele merkevaren er personvern — agentene skal være *strukturelt ute av stand*
   til å røre brukerdata.
3. **Agentene pusher aldri `main`.** De committer til `agent/*`-brancher og åpner
   PR-er; jeg reviewer og merger. Ingen force-push, ingen direkte main-skriving.
4. **Kun to typer hemmeligheter på VM-en:** `ANTHROPIC_API_KEY` + de 10
   Telegram-tokenene, i env-vars / låst `.env`, aldri committet. Firewall: kun
   SSH inn + utgående HTTPS.
5. **Audit-logg.** Hver Telegram-kommando → agent-handling → git-commit logges,
   så jeg kan se nøyaktig hva hver agent gjorde.
6. **Spend-cap** på Anthropic-nøkkelen (token-basert prising; sett tak).

> **Forutsetning før produksjon:** Den lekkede `service_role`-nøkkelen i
> `reset-user.js` (se memory `leaked-service-role-key.md`) **må roteres** før noe
> av dette går live.

---

## 6.5 Kapabilitetsutforskning — NESTE STEG (før vi skalerer til 10)

> **Beslutning 2026-06-25:** Pause skaleringen til 10 bots. Først utforske hva de
> **allerede live** agentene (CEO, Marketer, Writer, Designer) kan *kobles til* og
> *gjøre*. Persona #5–10 er kodeklare (`config.ts` + persona-filer finnes, slot #10
> byttet til **QA/Security Auditor**); de aktiveres straks tokens legges i env-filen.
> Verdien ligger nå i å gjøre de fire eksisterende dypere/mer nyttige, ikke å legge
> til flere bots.

**Hva en agent allerede kan i dag:** headless Claude Code i sitt eget git-worktree
(`agent/<rolle>`), full verktøytilgang (Read/Write/Edit/Bash/Grep/Glob + git).
Den committer på sin branch, aldri `main`. Den kan i prinsippet kobles til *alt som
ligger på VM-en*: repoet (kode/innhold/docs), CLI-er (f.eks. `gh`, `vercel`),
MCP-servere (Supabase MCP), og eksterne API-er via `curl` med snevert scopede nøkler.

### Writer → publiser en artikkel på nettsiden
Spørsmålet: «kan jeg si til Writer *skriv en artikkel og publiser den på nettsiden*?»
Svar: **ja — innholdet er allerede fildrevet, så Writer kan skrive det i dag.** To veier:

- **Vei A — repo-basert (matcher dagens arkitektur, trygg, mulig NÅ).**
  Innhold bor i repoet:
  - Guider: data i `apps/web/src/data/guide-content.ts` + indeks-entry i
    `apps/web/src/pages/GuidesPage.tsx` (`GUIDES`-arrayen), rute `/guides/:id`.
  - Nyhetsartikler: `NEWS_ARTICLES`-array i `apps/web/src/pages/NewsPage.tsx`.

  Writer skriver artikkelen i sin klone og committer på `agent/writer`.
  **«Publisering» = du merger branchen → Vercel auto-deployer.** Review-gaten
  (du merger) er bevart — helt i tråd med sikkerhetsmodellen §6.
  *Forbedring verdt å gjøre:* refaktorer artikler/guider til rene data-/markdown-
  filer slik at Writer kun slipper inn **én** innholdsfil + én indeks-entry, uten
  å røre TSX-logikk. Lavere risiko, renere diff, lettere review.

- **Vei B — DB-basert (helautomatisk «live» uten deploy).**
  Lag en `articles`-tabell i Supabase og render siden fra den (slik `news_digests`
  og `daily_news_articles` allerede gjør). Writer kaller en dedikert
  *publish*-Edge-Function (draft → review → publish) → artikkelen er live uten
  build/deploy. **MEN dette bryter sikkerhetsgrensen §6.2** (VM-klonen skal *ikke*
  ha prod-secrets eller DB-tilgang). Krever bevisst design: ingen rå `service_role`
  på VM-en — kun en snever, scoped funksjon + en redaksjonell review-gate.
  Behandles som eget designspørsmål, ikke nå.

- **Anbefaling:** start med **Vei A** (mulig i dag, trygt). Vurder Vei B senere.

### Andre integrasjoner å utforske for de eksisterende agentene
- **`gh` CLI på VM-en:** agentene åpner *faktiske PR-er* automatisk (ikke bare
  lokale commits) — du reviewer/ merger fra mobilen.
- **`vercel` CLI:** preview-deploy per branch, så du ser endringen *før* merge.
- **Supabase MCP (read-only/scoped):** for fremtidige Researcher/QA-oppgaver —
  aldri med skrivetilgang til prod-data.
- **Marketer → social:** det finnes allerede Twitter-posting Edge Functions
  (jf. CLAUDE.md §12) — koble via en scoped funksjon, ikke rå nøkler på VM-en.
- **Kryss-agent-handoff:** CEO drafter en oppgave til Writer (Fase 4-idé).

### Sjekkliste (denne utforskningsrunden)
- [x] **Bevis Vei A ende-til-ende** — gjort 2026-06-25: Writer skrev guide
      «Best European Calendar Apps in 2026», committet på `agent/writer`, pushet,
      åpnet **PR #1** mot `main`. Ren 2-fils diff (`guide-content.tsx` + `GuidesPage.tsx`).
- [x] **Installer `gh` på VM-en + agentene åpner PR-er** — gjort 2026-06-25.
      `gh` 2.95.0 installert; `GH_TOKEN` (fine-grained PAT, Contents+PR R/W) i
      `digitaleu-bots.env`; `gh auth setup-git` wirer HTTPS-push. Guardrails i
      `agent.ts` instruerer push + `gh pr create` (med compare-URL som fallback).
- [x] **Vercel = push-trigget** (besluttet) — INGEN vercel-token på VM-en.
- [ ] **Vercel-preview gjenstår (2 dashboard-fikser):** (1) commit-epost må være
      knyttet til GitHub-kontoen — satt til `hashtor2 <yawadabtc@gmail.com>` på VM-en,
      verifiser at eposten ligger på GitHub-kontoen. (2) Kun **scanner**-prosjektet er
      koblet til GitHub auto-deploy; **web-app-prosjektet** må kobles til repoet
      (Vercel → web-prosjekt → Settings → Git, root `apps/web`) for at web-previews skal bygge.
- [ ] Vurder refaktor: artikler/guider til data/markdown-filer (lettere for Writer).
- [ ] Beslutt om/når Vei B (CMS-tabell + scoped publish-funksjon) er verdt det.

### Følge-integrasjoner (egne runder, hver med egen scoped secret)
- [ ] **Supabase MCP (read-only):** kodeskall i `agent.ts` (gated av env-var), kun
      for `researcher`/`security`; aldri skrivetilgang til prod-data. Trenger scoped token.
- [ ] **Marketer → social:** funksjonene finnes (`post-to-twitter`,
      `summarize-news-for-twitter`, `twitter-daily-post`). Agenten *trigger* en
      Edge Function (Twitter-secrets server-side), holder aldri creds selv. Trenger endepunkt-auth.
- [ ] **Kryss-agent-handoff:** CEO drafter oppgave til Writer (orchestrator-feature, Fase 4).

---

## 7. Byggefaser

### Fase 0 — Forutsetninger
- [ ] Roter lekket `service_role`-nøkkel.
- [ ] Skriv `09-researcher.md` + `10-devops.md` (matche Block A/B/C-format).
- [ ] Oppdater Block B (teamlista) i alle 10 persona-filer.
- [ ] Opprett 10 bots via BotFather, samle tokens.
- [ ] Skaff Anthropic API-nøkkel med spend-cap.
- [ ] Avgjør #10: DevOps vs QA/Security Auditor.

### Fase 1 — Enkelt-agent bevis (på Windows-PC, kastbar klone)
- [ ] Sett opp orchestrator-prosjekt (Node/TS).
- [ ] Wire Agent SDK + persona + ett worktree for **én** bot (Engineer).
- [ ] Bevis ende-til-ende: «Telegram-melding → ekte filendring → commit på branch
      → svar med diff».

### Fase 2 — Skaler til 10
- [ ] Generaliser til bot×persona×worktree-loop.
- [ ] Per-agent samtaleminne (hver chat beholder kontekst).

### Fase 3 — Flytt til Hetzner
- [ ] Provisjoner VM, klon repo, installer Node + pm2.
- [ ] Deploy, lås firewall + allowlist, slå på audit-logg.

### Fase 4 — Polish
- [ ] `/reset`, `/branch`, `/status`, `/diff`-kommandoer per bot.
- [ ] Valgfritt: kryss-agent-handoff (CEO drafter spørsmål til Engineer).
- [ ] Valgfritt: progress-streaming for lange oppgaver.

---

## 8. Kostnad

- Hetzner VM: ~€4/mnd.
- Anthropic API: betal-per-token (sett spend-cap).
- Telegram, BotFather: gratis.
- Ingen annen infrastruktur.

---

## 9. Beslutningslogg (lokal for denne specen)

| # | Beslutning | Dato |
|---|---|---|
| T1 | Eksekveringsnivå: full repo-tilgang (med streng sikkerhet) | 2026-06-25 |
| T2 | Topologi: 10 separate bots (én token per agent) | 2026-06-25 |
| T3 | Hosting: Hetzner VM 🇩🇪 (europeisk-først) | 2026-06-25 |
| T4 | Motor: Claude Agent SDK (headless Claude Code) | 2026-06-25 |
| T5 | Isolasjon: git worktree + `agent/<rolle>`-branch per agent | 2026-06-25 |
| T6 | Bygg/test på Windows-PC mot kastbar klone først; Hetzner først når sikkerhetsreglene er bevist | 2026-06-25 |

---

## 10. Åpne spørsmål

- **#10-rollen:** DevOps/Release eller QA/Security Auditor?
- **Webhook vs long-polling:** Long-polling er enklest å starte med (ingen
  innkommende port/HTTPS-sertifikat). Webhook er mer effektivt i prod. Start med
  long-polling.
- **Samtaleminne-varighet:** Hvor lenge beholdes per-agent-kontekst? (Forslag:
  i minne til `/reset`, evt. persistér til disk på VM.)
- **Kryss-agent-koordinering:** Skal agentene kunne sende oppgaver til hverandre,
  eller går alt via meg? (Forslag nå: alt via meg.)
