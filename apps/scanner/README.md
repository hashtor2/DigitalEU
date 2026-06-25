# scanner.digitaleu.me

Privacy-first email scanner that detects your US digital services and recommends European alternatives.

## Architecture

- **Frontend:** TanStack Start (React 19, file-based routing, server functions)
- **Styling:** Tailwind CSS v4 + Nordic Warmth design tokens
- **Backend:** Supabase (auth, Postgres with RLS, Edge Functions)
- **Database:** Profiles, mailbox connections, scans, scan results, cancellation guides
- **Privacy:** Metadata-only Gmail scanning, zero-knowledge encryption, 30-day auto-delete

## Setup

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID (from Google Cloud Console)
- `VITE_MICROSOFT_CLIENT_ID` — Microsoft OAuth client ID (from Azure AD)

### 2. Supabase setup

Apply migrations to your Supabase project:

```bash
# From the project root
supabase migration up --project-ref fuiebtpezpoxvkuuhaqy
```

Or use the Supabase dashboard to run the SQL in `supabase/migrations/`.

### 3. Install dependencies

```bash
npm install
```

### 4. Start dev server

```bash
npm run dev:scanner
```

Server runs on http://localhost:5174

## Database schema

- **profiles** — user profile (email, created_at)
- **mailbox_connections** — OAuth tokens for Gmail/Outlook (encrypted)
- **scans** — scan sessions (user, status, created_at, deleted_at)
- **scan_results** — detected services per scan
- **beta_allowlist** — closed-beta email allowlist
- **cancellation_guides** — SEO-optimized guides (/cancel/:id routes)

All tables have RLS scoped to `auth.uid()` or public (for guides).

## Key features

### 1. Authentication

- Email/password + Google OAuth
- Closed-beta gate via `beta_allowlist` table
- Supabase Auth (email confirmation required)

### 2. Gmail scanner

- OAuth metadata scope only (no message bodies)
- Samples last 500 senders from inbox
- Matches against curated services catalog
- Scans persist but auto-delete after 30 days (via `pg_cron`)

### 3. Results dashboard

- Detected services grouped by category
- EU alternative for each service
- "How to cancel" link to dynamic guide

### 4. Cancellation guides

- Dynamic routes: `/cancel/:id`
- SEO: JSON-LD (HowTo, FAQPage), og:image, canonical URLs
- Responsive hero images with srcset/sizes
- Step-by-step copy (editorial content TBD)

## Privacy

- **Read-only metadata** — sender, subject, date only
- **Zero-knowledge klientside encryption** — tokens encrypted before storage
- **GDPR-compliant** — EU-hosted (Supabase Sweden)
- **30-day auto-purge** — scans deleted automatically
- **User control** — disconnect anytime; all data wiped immediately

## Development

### Useful commands

```bash
# Start dev server
npm run dev:scanner

# Build for production
npm run build --workspace @digitaleu/scanner

# Run tests
npm run test --workspace @digitaleu/scanner

# Lint
npm run lint --workspace @digitaleu/scanner
```

### Adding routes

TanStack Start uses file-based routing. Create files in `src/routes/`:

```
src/routes/
├── __root.tsx        # root layout
├── index.tsx         # /
├── /dashboard.tsx    # /dashboard
├── /cancel/
│   └── $id.tsx       # /cancel/:id
```

### Server functions

Use `createServerFn` from `@tanstack/start` to create server-only functions:

```tsx
import { createServerFn } from '@tanstack/start'

export const scanInbox = createServerFn({ method: 'POST' }).handler(async (ctx) => {
  // server-only logic here
})
```

## Deployment

Deploy to `scanner.digitaleu.me` via Vercel (subdomain routing via `vercel.ts`).

Environment variables are set in Vercel dashboard (never commit `.env`).

## Security checklist (pre-commit)

- [ ] No secrets in code or `.env` — use env vars only
- [ ] OAuth scopes are minimal (metadata only)
- [ ] RLS policies block unauthorized queries
- [ ] Tokens encrypted before database storage
- [ ] Tokens never logged or exposed in errors
- [ ] Dependencies audited (`npm audit`)
- [ ] CORS/CSRF headers configured

---

**Contact:** For questions or security issues, contact the Lead Engineer.
