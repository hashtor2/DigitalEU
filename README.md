# digitaleu.me

Europeisk migrasjonsportal som hjelper B2C-brukere med å flytte det digitale livet sitt bort fra Big Tech og over til personvernvennlige, europeiske alternativer (Proton, Tuta, Mullvad m.fl.).

## Arkitektur

Dette er et **monorepo** basert på npm workspaces. Web-appen og nettleserutvidelsen deler kode (typer, alternativ-data, fyll-logikk) gjennom en felles `packages/shared`.

```
digitaleu.me/
├── apps/
│   ├── web/          # Single Page Application (Vite + React + TypeScript + Tailwind)
│   └── extension/    # Chrome/Firefox-utvidelse (Manifest V3) — kommer senere
├── packages/
│   └── shared/       # Delte typer, alternativ-katalog og hjelpefunksjoner
└── package.json      # Workspace-rot
```

## Teknologivalg

| Lag            | Valg                                  | Hvorfor                                                                 |
| -------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Build/dev      | **Vite**                              | Lynrask HMR, minimal konfig, førsteklasses TS-støtte                    |
| UI             | **React 19 + TypeScript**             | Stort økosystem, AI-vennlig, typesikkerhet på tvers av app og utvidelse |
| Styling        | **Tailwind CSS v4**                   | Utility-first, ingen runtime, CSS-først konfig via Vite-plugin          |
| Datahåndtering | Session Storage (gjest) / Supabase (profil) | To moduser: maks personvern vs. lagret fremgang                 |
| Betaling       | Stripe (engangskjøp €29) + affiliate  | Definert i forretningsmodellen                                          |

## Kom i gang

```bash
npm install        # installerer for alle workspaces
npm run dev        # starter web-appen (apps/web) på http://localhost:5173
```

## Kjernefunksjonalitet (roadmap)

1. **Innboksskanner** — Gmail/Outlook via OAuth/IMAP, lokal skanning av avsendere.
2. **Dashbord** — Gjestemodus (Session Storage) og Profilmodus (kryptert Supabase).
3. **Nettleserutvidelse (MV3)** — autofyller ny e-postadresse på eksterne sider.
