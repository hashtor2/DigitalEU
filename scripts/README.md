# OAuth Testing Scripts

Automated testing and startup scripts for OAuth Code+PKCE implementation.

---

## Quick Start

### Windows (Double-click)
```
scripts/start-oauth-test.bat
```

### Mac/Linux (Terminal)
```bash
bash scripts/start-oauth-test.sh
```

### All Platforms (npm)
```bash
npm run oauth:start          # Full startup with validation
npm run oauth:validate       # Just validate, don't start server
npm run oauth:test           # Validate + start dev server
```

---

## Scripts Overview

### 1. `start-oauth-test.bat` (Windows)
**One-click startup with full validation**

Performs:
- ✅ Prerequisite checks (Node.js, npm)
- ✅ Dependency installation
- ✅ Environment variable validation
- ✅ File existence verification
- ✅ TypeScript build check
- ✅ Shows testing checklist
- ✅ Starts dev server

**Usage:** Double-click or `.\scripts\start-oauth-test.bat`

**Time:** ~2-3 minutes (including first npm install)

---

### 2. `start-oauth-test.sh` (Mac/Linux)
**Same as .bat but for Unix-like systems**

**Usage:** `bash scripts/start-oauth-test.sh`

---

### 3. `validate-oauth.mjs` (All Platforms)
**Lightweight validation without starting server**

Checks:
- ✅ All OAuth files exist
- ✅ PKCE implementation present (generateCodeVerifier, SHA256, etc.)
- ✅ Email callback route registered
- ✅ No console.log in Edge Function
- ✅ Environment variables configured
- ✅ Documentation complete

**Usage:**
```bash
node scripts/validate-oauth.mjs
# Or via npm:
npm run oauth:validate
```

**Time:** ~5 seconds

**Output:**
```
========================================
OAuth Code+PKCE Implementation Validator
========================================

1. File Structure
✓ apps/web/src/lib/oauth-utils.ts
✓ apps/web/src/pages/scanner/auth/email-callback.tsx
...

All checks passed! Ready for local testing.
```

---

## Typical Usage Flow

### Day 1: Initial Setup

```bash
# 1. Validate implementation
npm run oauth:validate

# 2. If all checks pass, start dev server
npm run dev

# 3. Browser opens to http://localhost:5173/scanner/auth/signin
# 4. Test Gmail and Outlook OAuth flows
# 5. Verify no tokens in browser history
```

### Day 2: Staging Testing

```bash
# 1. Deploy Edge Function
supabase functions deploy exchange-email-code --project-ref mwsalzjsvuvlmshxzbxg

# 2. Push feature branch to GitHub
git push origin feature/oauth-code-pkce

# 3. Test on staging URL
# 4. Verify same flows work on staging

# 5. Merge to main when ready
```

---

## Environment Setup

### Create `.env.local` in `apps/web/`

```bash
VITE_GOOGLE_CLIENT_ID=<from Google Cloud Console>
VITE_MICROSOFT_CLIENT_ID=<from Azure AD>
VITE_SUPABASE_URL=https://mwsalzjsvuvlmshxzbxg.supabase.co
VITE_SUPABASE_ANON_KEY=<from Supabase dashboard>
```

**Get values from:**
- **Google Client ID:** https://console.cloud.google.com/
- **Microsoft Client ID:** https://portal.azure.com/ → App registrations
- **Supabase:** https://supabase.com/ → Project settings → API

---

## Troubleshooting

### Scripts won't run on Windows

**Fix 1:** Use PowerShell instead of cmd.exe
```powershell
.\scripts\start-oauth-test.bat
```

**Fix 2:** Run via npm (works anywhere)
```bash
npm run oauth:start
```

### Port 5174 already in use

**Kill existing process:**
```bash
# PowerShell:
Get-Process node | Stop-Process -Force

# Cmd:
taskkill /F /IM node.exe
```

### Validation fails with "TypeScript build errors"

**Fix:** Build manually to see errors
```bash
npm run build --workspace @digitaleu/web
```

### OAuth redirect not working

**Check:**
1. Ensure `apps/web/.env.local` has correct client IDs
2. Verify redirect URI in OAuth provider settings includes `http://localhost:5173/scanner/auth/email-callback`
3. Hard refresh browser (Ctrl+Shift+R)
4. Check DevTools console for errors

---

## Testing Checklist

After scripts complete, manually verify:

- [ ] Gmail OAuth flow works (click → redirect → token received)
- [ ] Outlook OAuth flow works (same as Gmail)
- [ ] **Security:** No `#access_token` in URL
- [ ] **Security:** Browser history contains no tokens
- [ ] **Security:** DevTools console shows no red errors
- [ ] Token stored in sessionStorage (DevTools → Application)
- [ ] Redirect to `/dashboard` succeeds

---

## Reference Docs

- [OAUTH_TESTING_QUICK_START.md](../docs/OAUTH_TESTING_QUICK_START.md) — Detailed testing guide
- [PHASE_1_IMPLEMENTATION_SUMMARY.md](../docs/PHASE_1_IMPLEMENTATION_SUMMARY.md) — Implementation overview
- [OAUTH_FLOW_MIGRATION.md](../docs/OAUTH_FLOW_MIGRATION.md) — Technical specification

---

## Performance

| Command | Time | Details |
| --- | --- | --- |
| `validate-oauth.mjs` | ~5 sec | Quick validation only |
| `start-oauth-test.bat` (first run) | ~3 min | Includes npm install |
| `start-oauth-test.bat` (cached) | ~30 sec | Dependencies already installed |
| `npm run dev:scanner` | ~2 sec | Direct server start (no validation) |

---

## For Advanced Users

### Run validation without installation

```bash
# Just check files exist (no npm install)
node scripts/validate-oauth.mjs
```

### Start server without validation

```bash
# Faster if you know everything is set up
npm run dev:scanner
```

### Deploy Edge Function directly

```bash
supabase functions deploy exchange-email-code --project-ref mwsalzjsvuvlmshxzbxg
```

---

**Need help?** See [OAUTH_TESTING_QUICK_START.md](../docs/OAUTH_TESTING_QUICK_START.md) for detailed troubleshooting.
