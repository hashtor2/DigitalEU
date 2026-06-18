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

`.mcp.json` i prosjektroten konfigurerer connectoren. Den leser tokenet fra
miljøvariabelen `SUPABASE_ACCESS_TOKEN` — **ingen hemmeligheter i repoet**.

1. Lag en Personal Access Token: Supabase → **Account → Access Tokens**.
2. Sett den som miljøvariabel før du starter Claude Code:
   ```powershell
   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
   ```
3. Start Claude Code på nytt og godkjenn MCP-serveren når du blir spurt.

> **Windows-merknad:** Hvis `npx` ikke starter MCP-serveren, endre `command`
> i `.mcp.json` til `cmd` og legg `"/c", "npx"` først i `args`.
>
> **Sikkerhet:** En access-token uten `--project-ref` gir tilgang på tvers av
> hele Supabase-kontoen. Når prosjektet er satt opp, anbefales det å låse
> connectoren til ett prosjekt og evt. `--read-only` for daglig bruk
> (se docs/SECURITY.md).

## Skjema (kort)

- **`user_vault`** — én rad per bruker med all migreringsfremgang som én
  klientside-kryptert blob (zero-knowledge). RLS: kun egen rad.
- **`entitlements`** — betalt/affiliate-tilgang. RLS: bruker kan lese egen rad;
  skriving skjer kun server-side med `service_role`.
