# telegram-agents — Layer 2 orchestrator

Telegram-styrte AI-agenter for digitaleu.me. Hver agent-persona i
`docs/agents/` blir en egen Telegram-bot som kan utføre faktisk arbeid (lese/
skrive filer, kjøre kommandoer, committe) i sitt eget git worktree.

Full spesifikasjon: [`docs/TELEGRAM_AGENTS.md`](../../docs/TELEGRAM_AGENTS.md).

## Forutsetninger
- Node >= 20 (testet på 24).
- Claude-tilgang: enten innlogget Claude Code-abonnement (OAuth) **eller** en ekte
  `ANTHROPIC_API_KEY` (`sk-ant-…`). En ikke-Anthropic-nøkkel i miljøet ignoreres
  automatisk (se `config.ts`), så abonnementet brukes.
- Hemmeligheter i `~/digitaleu-bots.env` (UTENFOR repoet):
  ```
  OWNER_TELEGRAM_ID=<din numeriske Telegram-ID>
  BOT_01_CEO=<token>
  BOT_02_MARKETER=<token>
  ... (kun de du har laget startes)
  ```

## Kommandoer
```bash
npm install            # i denne mappen
npm run verify         # validér alle tokens mot Telegram (getMe) — gratis
npm run smoke -- ceo   # lokal test: kjør én agent uten Telegram
npm run setup:worktrees# opprett worktrees for alle aktive agenter
npm start              # start alle aktive bots (long-polling)
```

## Sikkerhet (jf. spec §6)
- **Eier-allowlist:** hver bot ignorerer alle andre enn `OWNER_TELEGRAM_ID`.
- **Worktree-isolasjon:** hver agent jobber på `agent/<rolle>`, aldri `main`.
- **Runtime-vakter:** agenten får instruks om å holde seg i worktreet, ikke pushe
  main, ikke kjøre destruktive kommandoer, aldri eksponere hemmeligheter.
- **Ingen ekte brukerdata / prod-secrets** skal ligge i klonen agentene jobber i.

## Arkitektur (filer)
- `config.ts` — env-lasting, 10 agent-definisjoner, worktree-håndtering.
- `agent.ts` — Claude Agent SDK-wrapper (persona som system-prompt, session-minne).
- `index.ts` — én grammy-bot per agent, allowlist, /reset /status, melding-ruting.
- `git.ts` — tynn git-subprosess-wrapper.
- `verify.ts` / `smoke.ts` / `setup-worktrees.ts` — verktøyskript.

> **Status:** Fase 1 (lokal proof) verifisert med 4 bots (CEO, Marketer, Writer,
> Designer). Neste: legg til resten av tokenene, så Hetzner-deploy (spec §7 Fase 3).
