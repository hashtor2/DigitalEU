# OAuth Setup Guide

## Google OAuth (Gmail Scanner) — Current Setup

### Current Configuration
- **Client ID**: `646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com`
- **Scope**: `gmail.metadata` (read-only metadata, no email bodies)
- **Flow**: Authorization Code with PKCE (S256)
- **Token Location**: URL fragment `#access_token=...` (memory-only, never stored)
- **Redirect Path**: `/auth/email-callback` (handles OAuth callback)

### Setup Steps

#### 1. Go to Google Cloud Console
```
https://console.cloud.google.com/apis/credentials
```

#### 2. Find OAuth 2.0 Client ID
Click on: `646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com`

#### 3. Add/Verify Redirect URIs
Under **"Authorized redirect URIs"**, ensure these are registered:

**Development (Local Testing):**
```
http://localhost:5174/auth/email-callback
http://localhost:5187/auth/email-callback
```

**Production:**
```
https://www.digitaleu.me/auth/email-callback
https://scanner.digitaleu.me/auth/email-callback
```

> **NOTE**: The redirect path has changed from `/emailscanner` to `/auth/email-callback` to properly handle OAuth callbacks in the scanner app.

#### 4. Save and Wait
Click **Save** and wait 5-10 seconds for Google to propagate changes globally.

#### 5. Test Locally

**Option A - Scanner App (port 5174):**
```
http://localhost:5174/
Click: "Scan Gmail →"
```

**Option B - Web App (port 5187):**
```
http://localhost:5187/emailscanner
Follow the "Scan Gmail" flow
```

You should see the Google sign-in prompt instead of a redirect error.

---

## Microsoft OAuth (Outlook Scanner) — TODO

### Step 1: Get Tenant ID from Azure Portal
```
https://portal.azure.com
```

1. Navigate to **Azure Active Directory → Overview**
2. Copy **Tenant ID** (GUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
3. Update `.env`:
```bash
VITE_MICROSOFT_TENANT_ID="your-tenant-id-here"
```

### Step 2: Verify App Registration
- **Client ID**: `7780aaaa-4b85-4209-81f3-c60316af47e4` ✅ (web + scanner use same)
- **Redirect URIs** (in Azure Portal → App registrations → Redirect URIs):
  - `http://localhost:5174/auth/email-callback`
  - `http://localhost:5187/auth/email-callback`
  - `https://www.digitaleu.me/auth/email-callback`
  - `https://scanner.digitaleu.me/auth/email-callback`

---

## Testing the Flow

### Demo Mode (No OAuth)
```
http://localhost:5174
Click: "try the demo (no account needed)"
```
Shows: Gmail, Outlook, Dropbox, LastPass, Netflix

### Real Gmail Scan (PKCE)
```
1. http://localhost:5174 (scanner) OR http://localhost:5187 (web)
2. Click: "Scan Gmail →"
3. Sign in to Google
4. Grant permission: gmail.metadata scope
5. Redirected back to /auth/email-callback
6. Token exchanged for email header scan
7. Results displayed, token discarded (NOT stored)
```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Cause**: Redirect URI in code doesn't match Google Cloud Console
**Solution**: 
1. Check Google Cloud Console for registered URIs (see Step 3 above)
2. Ensure `http://localhost:5174/auth/email-callback` is registered
3. Wait 5-10 seconds after saving
4. Clear browser cache and try again

### Error: "invalid_client_id"
**Cause**: Wrong client ID in `.env`
**Solution**: Verify `.env` has: `VITE_GOOGLE_CLIENT_ID=646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com`

### Token Appearing in Console?
**This is bad!** 
- Tokens should ONLY be in memory via `sessionStorage` or URL fragment
- Never use `localStorage` for OAuth tokens
- Check scanner OAuth code — should NOT persist tokens

---

## Environment Variables

### Web App (apps/web/.env)
```
VITE_GOOGLE_CLIENT_ID=646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com
VITE_MICROSOFT_CLIENT_ID=7780aaaa-4b85-4209-81f3-c60316af47e4
```

### Scanner App (apps/scanner/.env.local)
```
VITE_GOOGLE_CLIENT_ID=646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com
VITE_MICROSOFT_CLIENT_ID=f02f90cf-a10c-41bd-9d7c-08e74569d60e
```

---

## Security Checklist

- [ ] Never commit `.env` files with real credentials
- [ ] Use `.env.example` for documentation
- [ ] OAuth tokens never stored in `localStorage`
- [ ] Tokens kept in memory only (URL fragment or session)
- [ ] Scopes limited to minimum required (`gmail.metadata`, not `gmail.readonly`)
- [ ] PKCE used for all flows (prevents token leakage)
3. Sign in with your Google account
4. Grant access to read metadata (no bodies/passwords)
5. Wait 2-3 seconds for results
6. See your real detected services
```

### Real Outlook Scan
```
1. http://localhost:5186/emailscanner
2. Click: "Scan Outlook →"
3. Sign in with your Microsoft/Outlook account
4. Grant access to read basic mail
5. Wait 2-3 seconds for results
6. See your real detected services
```

---

## Debugging OAuth Errors

### Error: `redirect_uri_mismatch`
**Cause:** Redirect URI not registered in Google Cloud Console
**Fix:** Add the exact redirect URI to the OAuth app

### Error: `invalid_scope`
**Cause:** Requesting a scope the app isn't approved for
**Fix:** Go to Google Cloud Console and check OAuth Consent Screen settings

### Error: `access_denied`
**Cause:** User clicked "Cancel" on the OAuth prompt
**Fix:** This is normal; user chose not to grant access

### Token expires / "Unknown error during scan"
**Cause:** Google access token expired or revoked
**Fix:** Re-authenticate by clicking "Scan Gmail" again

---

## Privacy & Security Notes

✅ **Scope**: `gmail.metadata` = read-only email headers only
✅ **Token**: Stored in browser memory only, never saved
✅ **Emails**: No email bodies, attachments, or contact lists accessed
✅ **Backend**: Token passed once to backend, never stored
✅ **Frontend**: Results encrypted before saving to profile (AES-256-GCM)

---

## Production Deployment

Before deploying to production:

1. ✅ Test both Google and Outlook OAuth locally
2. ✅ Register production redirect URIs in Google Cloud Console
3. ✅ Register production redirect URIs in Azure Portal
4. ✅ Set production `STRIPE_PUBLISHABLE_KEY` (if using payments)
5. ✅ Run security checklist: `docs/SECURITY.md`
6. ✅ Deploy to Vercel (web app)
7. ✅ Deploy to Supabase (edge functions)

---

## Files Updated

- `.env` — OAuth credentials placeholder
- `.env.example` — OAuth template
- `apps/web/src/lib/gmailScanner.ts` — Google OAuth URL generation
- `apps/web/src/hooks/useClientSideScanner.ts` — OAuth flow handling
- `supabase/functions/scan-email/index.ts` — Backend scanning

---

**Status**: 🔴 Waiting for Google Cloud Console redirect URI registration  
**Next Step**: Add redirect URIs → Test locally → Test Outlook → Deploy
