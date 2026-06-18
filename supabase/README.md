# Supabase

Databaseskjema og oppsett for Profilmodus. Skjemaet er **versjonert** i
`migrations/` og er den eneste kilden til sannhet.

## 1. Opprett prosjektet (du gjør dette)

1. Logg inn på <https://supabase.com> og opprett et nytt prosjekt.
2. **Velg region i EU** — anbefalt **Frankfurt (eu-central-1)** (jf. CLAUDE.md §6).
3. Noter ned fra **Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public`-nøkkel → `VITE_SUPABASE_ANON_KEY`
4. Kopier `apps/web/.env.example` til `apps/web/.env` og fyll inn verdiene.

## 2. Kjør migrasjonen

Velg én av metodene:

**A) Supabase MCP (mest automatisert — anbefalt fremover)**
Når `.mcp.json` er aktiv (se under), kan Claude kjøre migrasjonen for deg.

**B) SQL-editor (raskest manuelt)**
Lim inn innholdet av `migrations/0001_initial_schema.sql` i
**SQL Editor** i Supabase-dashbordet og kjør.

**C) Supabase CLI (for CI/reproduserbarhet)**
```bash
npx supabase login                       # bruk din access-token
npx supabase link --project-ref <ref>
npx supabase db push
```

## 3. Aktiver Supabase MCP-connector (for automatisering)

Vi bruker den **hostede** Supabase MCP-en (HTTP + OAuth), konfigurert i
`.mcp.json` og låst til ett prosjekt via `project_ref`:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=drycxdvhxjejfsstwwub"
    }
  }
}
```

**Autentisering (du gjør dette):** kjør `/mcp` i Claude Code og fullfør
OAuth-innloggingen mot Supabase. Ingen access-token i repoet eller miljøet —
OAuth-tokenet håndteres av Claude Code.

> **Sikkerhet:** Connectoren er låst til dette ene prosjektet (`project_ref`).
> Vurder å legge til `&read_only=true` i URL-en for daglig bruk, og fjerne det
> kun når en migrasjon faktisk skal kjøres (se docs/SECURITY.md).

Agent-skills (`npx skills add supabase/agent-skills`) er også installert lokalt;
de er gitignorert og gjenopprettes fra `skills-lock.json`.

## Skjema (kort)

- **`user_vault`** — én rad per bruker med all migreringsfremgang som én
  klientside-kryptert blob (zero-knowledge). RLS: kun egen rad.
- **`entitlements`** — betalt/affiliate-tilgang. RLS: bruker kan lese egen rad;
  skriving skjer kun server-side med `service_role`.
