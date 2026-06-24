# OAUTH_TESTING_QUICK_START.md

**Quick startup guide for OAuth Code+PKCE local testing**

---

## 🚀 One-Command Start (Windows)

### Option 1: Double-click (Easiest)

```
Double-click: scripts/start-oauth-test.bat
```

This will:
1. ✅ Check Node.js and npm
2. ✅ Install dependencies
3. ✅ Verify all OAuth files exist
4. ✅ Build TypeScript
5. ✅ Start dev server on http://localhost:5174
6. ✅ Show testing checklist

### Option 2: Command Line

```bash
# PowerShell
cd c:\Users\toris\Documents\DigitalEU.me
.\scripts\start-oauth-test.bat

# Or Git Bash
bash scripts/start-oauth-test.sh
```

### Option 3: Manual (Full Control)

```bash
npm install
npm run dev:scanner
```

---

## ✅ Pre-Flight Validation (Before Testing)

Run this to verify OAuth implementation:

```bash
node scripts/validate-oauth.mjs
```

Expected output:
```
========================================
OAuth Code+PKCE Implementation Validator
========================================

1. File Structure
✓ apps/scanner/src/lib/oauth-utils.ts
✓ apps/scanner/src/routes/auth/email-callback.tsx
✓ apps/scanner/src/routes/auth/signin.tsx
✓ apps/scanner/src/App.tsx
✓ supabase/functions/exchange-email-code/index.ts

2. PKCE Implementation Checks
  ...checks pass...

3. Security Checks
✓ No console.* statements in Edge Function

All checks passed! Ready for local testing.
```

---

## 📋 Manual Testing (After Dev Server Starts)

### Test Gmail OAuth Flow

1. **Start:** http://localhost:5174/auth/signin

2. **Click:** "🔗 Connect Gmail"

3. **Expected:**
   - Redirected to Google login
   - NO `#access_token=...` in URL (should see `?code=...` instead)
   - Consent screen appears
   - After approval → redirects to `/dashboard`

4. **Verify in Browser Console:**
   ```javascript
   // Press F12 → Console tab → paste:
   console.log(sessionStorage.getItem('email_access_token'))
   // Should show a token (not empty)
   
   console.log(sessionStorage.getItem('email_provider'))
   // Should show: "gmail"
   ```

### Test Outlook OAuth Flow

1. **Open new tab:** http://localhost:5174/auth/signin

2. **Click:** "🔗 Connect Outlook"

3. **Expected:** Same flow, but Microsoft login instead of Google

### Security Checks

1. **Verify NO tokens in browser history:**
   ```
   Ctrl+H → Search "access_token"
   → Should find NOTHING (secure!)
   ```

2. **Verify CSRF protection:**
   ```
   Open DevTools → Network tab
   → Filter: email-callback
   → Check request body includes state + code
   ```

3. **Verify no console errors:**
   ```
   DevTools → Console tab
   → Should see NO red errors
   ```

---

## 🐛 Troubleshooting

### "VITE_GOOGLE_CLIENT_ID not found"

**Fix:**
```bash
# Create apps/scanner/.env.local with:
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_MICROSOFT_CLIENT_ID=<your-microsoft-client-id>
VITE_SUPABASE_URL=https://mwsalzjsvuvlmshxzbxg.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Get values from:
- **Google Client ID:** Google Cloud Console → OAuth 2.0 credentials
- **Microsoft Client ID:** Azure AD → App registrations
- **Supabase:** Supabase dashboard → Settings → API

### "ERR_REDIRECT_MISMATCH" from OAuth provider

**Fix:**
1. Open Google Cloud Console / Azure AD
2. Check OAuth redirect URIs
3. Ensure `http://localhost:5174/auth/email-callback` is listed
4. Save and retry

### Port 5174 already in use

**Fix:**
```bash
# Change port in vite.config.ts
# Or kill existing process:

# PowerShell:
Get-Process node | Stop-Process -Force

# Command Prompt:
taskkill /F /IM node.exe
```

### "State parameter mismatch" error

**Cause:** PKCE parameters cleared or expired  
**Fix:** 
- Hard refresh (Ctrl+Shift+R) on email-callback page
- Clear localStorage/sessionStorage
- Start over from signin page

### Edge Function "404 Not Found"

**Cause:** Edge Function not deployed to Supabase  
**Fix:**
```bash
supabase functions deploy exchange-email-code --project-ref mwsalzjsvuvlmshxzbxg
```

---

## 🔍 What You Should See

### Console Output (Dev Server Starting)

```
  VITE v6.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5174/
  ➜  press h + enter to show help
```

### Browser (Signin Page)

```
SignIn | digitaleu.me

Traditional Login
  Email: [___________]
  Password: [___________]
  Sign In

Quick Scan
  Connect Gmail →
  Connect Outlook →

Privacy & Security
  Your email is scanned on this device only.
  No data is stored.
```

### After OAuth Approval

```
Completing email authentication...
[=====>] Connecting...

(Redirects to /dashboard after ~2-3 seconds)
```

---

## 📊 Success Criteria

✅ **Test is passing when:**

- [ ] Gmail OAuth redirects to Google login
- [ ] Outlook OAuth redirects to Microsoft login
- [ ] After consent, redirects back to app (not stuck on Google/Microsoft)
- [ ] `/auth/email-callback` route receives code parameter
- [ ] Code is exchanged for token (Edge Function called)
- [ ] Token stored in sessionStorage
- [ ] Redirects to `/dashboard`
- [ ] NO `#access_token` in any URLs
- [ ] Browser history shows NO tokens
- [ ] DevTools console shows NO red errors

---

## 🎯 Next Steps After Testing

1. **All tests pass?**
   - Commit to feature branch
   - Push to GitHub
   - Create PR for mentor review

2. **Issues found?**
   - Check troubleshooting section
   - Review OAUTH_FLOW_MIGRATION.md for details
   - Ask mentor for help

3. **Ready for staging?**
   - Deploy Edge Function: `supabase functions deploy exchange-email-code`
   - Deploy to Vercel: `git push origin feature/oauth-code-pkce`
   - Run same tests on staging URL

---

## 📚 Reference Docs

- [PHASE_1_IMPLEMENTATION_SUMMARY.md](./PHASE_1_IMPLEMENTATION_SUMMARY.md) — Overview
- [PHASE_1_IMPLEMENTATION_CHECKLIST.md](./PHASE_1_IMPLEMENTATION_CHECKLIST.md) — Detailed checklist
- [OAUTH_FLOW_MIGRATION.md](./OAUTH_FLOW_MIGRATION.md) — Full technical spec
- [SECURITY.md](./SECURITY.md) — Security requirements

---

## ⏱️ Typical Timeline

| Step | Duration | Task |
| --- | --- | --- |
| Setup | 2 min | Run startup script |
| Gmail test | 3 min | Connect Gmail OAuth |
| Outlook test | 3 min | Connect Outlook OAuth |
| Security checks | 2 min | Verify URL, history, console |
| **Total** | **~10 min** | **Full local test cycle** |

---

## 🚨 Important Notes

1. **OAuth secrets in .env.local (NEVER commit):**
   ```
   VITE_GOOGLE_CLIENT_ID=public (OK to commit)
   GOOGLE_OAUTH_CLIENT_SECRET=secret (NEVER commit)
   ```

2. **sessionStorage is ephemeral:**
   - Tokens cleared when tab closes ✓
   - Not persisted to disk ✓
   - Not accessible to other websites ✓

3. **No Edge Function secret exposure:**
   - Edge Function logs contain NO tokens
   - Supabase logs are clean
   - Safe for production

---

**Ready? Start with:** `.\scripts\start-oauth-test.bat`
