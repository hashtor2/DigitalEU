# Scanner Subdomain Deployment (scanner.digitaleu.me)

This guide covers deploying the scanner app to the scanner.digitaleu.me subdomain on Vercel.

## Prerequisites

- GitHub account with access to https://github.com/hashtor2/DigitalEU
- Vercel account (can sign in via GitHub)
- Stripe live credentials (already configured on main site)
- Supabase project (already configured on main site)

## Step 1: Create New Vercel Project for Scanner

1. Go to https://vercel.com/new
2. Select "GitHub" and authenticate
3. Find and import the repository: `hashtor2/DigitalEU`
4. Under "Configure Project":
   - **Root Directory:** `apps/scanner`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build --workspace @digitaleu/scanner`
   - **Output Directory:** `dist`
   - **Development Command:** `npm run dev --workspace @digitaleu/scanner`
5. Click "Deploy"

## Step 2: Add Environment Variables

After initial deployment, go to **Project Settings** → **Environment Variables** and add:

### Supabase Variables
- **VITE_SUPABASE_URL**: Same as main web app
- **VITE_SUPABASE_ANON_KEY**: Same as main web app (public anon key from Supabase)

### Stripe Variables
- **VITE_STRIPE_PUBLIC_KEY**: `pk_live_51Tk2rUAcF0Ep8eR8vzfVh1TCYeordkBZRWEXD1dArrt8IEbmSR1GAQaOGacoQ2HAjbeEu8XhcY7fZqk5wzEe8FkB007POpY4RP`

### OAuth Variables (Placeholders)
- **VITE_GOOGLE_CLIENT_ID**: *(to be filled after Google OAuth setup)*
- **VITE_MICROSOFT_CLIENT_ID**: *(to be filled after Azure OAuth setup)*

## Step 3: Configure scanner.digitaleu.me Domain

1. In Vercel project settings → **Domains**
2. Add domain: `scanner.digitaleu.me`
3. Follow Vercel's DNS configuration instructions

## Step 4: Verify Deployment

After deployment, visit https://scanner.digitaleu.me to see the ScannerOnboarding component.

## Step 5: Set Up OAuth

Once scanner is deployed:

### Google OAuth
1. Google Cloud Console → Create Project "DigitalEU Scanner"
2. Enable Gmail API
3. Create OAuth 2.0 credentials (SPA)
4. Redirect URIs: `https://scanner.digitaleu.me/auth/callback`, `http://localhost:5173/auth/callback`
5. Copy Client ID → Vercel env var `VITE_GOOGLE_CLIENT_ID`
6. Redeploy

### Azure OAuth
1. Azure Portal → App Registrations → New
2. Name: "DigitalEU Scanner"
3. Redirect URI: `https://scanner.digitaleu.me/auth/callback`
4. Permissions: Mail.ReadBasic, Mail.Read
5. Copy Client ID → Vercel env var `VITE_MICROSOFT_CLIENT_ID`
6. Redeploy

