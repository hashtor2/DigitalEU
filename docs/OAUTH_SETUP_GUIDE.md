# OAuth Setup Guide

## Google OAuth (Gmail Scanner)

### Current Configuration
- **Client ID**: `930614896383-60q1c4cik7pcaudbcf9kpdkoau7uc405.apps.googleusercontent.com`
- **Scope**: `gmail.metadata` (read-only metadata, no email bodies)
- **Flow**: Implicit Grant (OAuth 2.0 token redirect)
- **Token Location**: URL fragment `#access_token=...` (memory-only, not stored)

### Setup Steps

#### 1. Go to Google Cloud Console
```
https://console.cloud.google.com/apis/credentials
```

#### 2. Find OAuth 2.0 Client ID
Click on: `930614896383-60q1c4cik7pcaudbcf9kpdkoau7uc405.apps.googleusercontent.com`

#### 3. Add Redirect URIs
Under **"Authorized redirect URIs"**, add:

**Development (Local Testing):**
```
http://localhost:5186/emailscanner
```

**Production:**
```
https://www.digitaleu.me/emailscanner
https://scanner.digitaleu.me/emailscanner
```

#### 4. Save and Wait
Click **Save** and wait 5-10 seconds for Google to propagate the change globally.

#### 5. Test Locally
Go to: `http://localhost:5186/emailscanner`
Click: **"Scan Gmail →"**

You should now see the Google sign-in prompt instead of a redirect error.

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
- **Client ID**: `7780aaaa-4b85-4209-81f3-c60316af47e4` ✅
- **Redirect URIs** (in Azure Portal):
  - `http://localhost:5186/emailscanner`
  - `https://www.digitaleu.me/emailscanner`

---

## Testing the Flow

### Demo Mode (No OAuth)
```
http://localhost:5186/emailscanner
Click: "try the demo (no account needed)"
```
Shows: Gmail, Outlook, Dropbox, LastPass, Netflix

### Real Gmail Scan
```
1. http://localhost:5186/emailscanner
2. Click: "Scan Gmail →"
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
