# Environment configuration — digitaleu.me

`VITE_*` variables are **never** set in Supabase. They are baked into the browser bundle at build time (Vite).

## Verified status (2026-06-25 audit)

### Vercel (`digitaleu-me-web`)

| Variable | Production | Development | Notes |
|----------|------------|-------------|--------|
| `VITE_SUPABASE_URL` | Yes | Yes | |
| `VITE_SUPABASE_ANON_KEY` | Yes | Yes | |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Yes | |
| `VITE_MICROSOFT_CLIENT_ID` | Yes | Yes | |
| `VITE_PLAUSIBLE_DOMAIN` | Yes | No | Optional on Dev |
| `VITE_STRIPE_PUBLIC_KEY` | **Add** | **Add** | Run `.\scripts\sync-vercel-stripe-env.ps1` |
| `VITE_STRIPE_CHECKOUT_SESSION_URL` | Optional | Optional | Fallback from `VITE_SUPABASE_URL` if omitted |
| `AUTH0_*` | Present | Preview/Prod | Unused by app (Supabase Auth) — safe to remove |

After adding Stripe vars: **Redeploy** (`vercel --prod`).

### Supabase Edge secrets (`mwsalzjsvuvlmshxzbxg`)

All required secrets present: `GOOGLE_OAUTH_*`, `MICROSOFT_OAUTH_*`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### Still manual (consoles)

- Google Cloud + Azure: redirect URI `https://www.digitaleu.me/scanner/auth/email-callback`
- Stripe webhook URL (if not already): `https://mwsalzjsvuvlmshxzbxg.supabase.co/functions/v1/stripe-webhook`

---

## Vercel (production / preview)

Project: digitaleu.me web app → **Settings → Environment Variables** → enable **Production** (and Preview if needed).

| Variable | Example / source |
|----------|------------------|
| `VITE_SUPABASE_URL` | `https://mwsalzjsvuvlmshxzbxg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → publishable key |
| `VITE_GOOGLE_CLIENT_ID` | Google Cloud OAuth client (same as Supabase `GOOGLE_OAUTH_CLIENT_ID`) |
| `VITE_MICROSOFT_CLIENT_ID` | Azure app registration (same as Supabase `MICROSOFT_OAUTH_CLIENT_ID`) |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe Dashboard → publishable key (`pk_test_` or `pk_live_`) |
| `VITE_STRIPE_CHECKOUT_SESSION_URL` | Optional; defaults to `{VITE_SUPABASE_URL}/functions/v1/create-checkout` |

Redeploy after changing env vars.

## Local dev

Copy [`apps/web/.env.example`](apps/web/.env.example) to `apps/web/.env` and fill in values.

## Supabase Edge Function secrets

Dashboard → **Edge Functions → Secrets** (no `VITE_` prefix).

| Secret | Used by |
|--------|---------|
| `GOOGLE_OAUTH_CLIENT_ID` | `exchange-email-code` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | `exchange-email-code` |
| `MICROSOFT_OAUTH_CLIENT_ID` | `exchange-email-code` |
| `MICROSOFT_OAUTH_CLIENT_SECRET` | `exchange-email-code` |
| `STRIPE_SECRET_KEY` | `create-checkout`, `stripe-webhook` |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook` |
| `SUPABASE_URL` | Edge functions (often auto-set) |
| `SUPABASE_ANON_KEY` | `create-checkout`, `delete-account` |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhooks, admin functions |

OAuth: browser `VITE_GOOGLE_CLIENT_ID` must match `GOOGLE_OAUTH_CLIENT_ID` on the server (same Google OAuth app).

## Stripe Dashboard

- Publishable key → `VITE_STRIPE_PUBLIC_KEY` (Vercel + local)
- Secret key → `STRIPE_SECRET_KEY` (Supabase only)
- Webhook URL: `https://mwsalzjsvuvlmshxzbxg.supabase.co/functions/v1/stripe-webhook` → signing secret → `STRIPE_WEBHOOK_SECRET`

## CLI shortcuts

```bash
cd C:\Users\toris\Documents\DigitalEU.me
supabase secrets set --project-ref mwsalzjsvuvlmshxzbxg STRIPE_SECRET_KEY=sk_test_...
supabase functions deploy create-checkout exchange-email-code stripe-webhook --project-ref mwsalzjsvuvlmshxzbxg
```
