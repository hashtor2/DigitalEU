# @digitaleu/extension (kommer senere)

Plassholder for Chrome/Firefox-utvidelsen (Manifest V3).

## Planlagt ansvar

- Mottar `ny_epost` (f.eks. `bruker@proton.me`) fra web-appen.
- Navigerer til en ekstern side (Netflix, Spotify, ...) og autofyller e-postfeltet
  slik at brukeren enkelt kan bytte kontoadresse.
- Deler typer og logikk med web-appen via `@digitaleu/shared` (se
  `FillEmailMessage` i `packages/shared/src/types.ts`).

## Planlagt struktur

```
apps/extension/
├── manifest.json        # Manifest V3
├── src/
│   ├── background.ts     # service worker
│   ├── content.ts        # injiseres på målsider, fyller inn e-postfeltet
│   └── popup/            # liten React-popup (gjenbruker Vite-oppsettet)
└── vite.config.ts        # bygges med @crxjs/vite-plugin e.l.
```

Bygges som eget npm-workspace når web-appens kjerneflyt er på plass.
