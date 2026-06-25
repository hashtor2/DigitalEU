# OAuth Testing — Quick Reference Card

## 🚀 Start Testing Now

### Windows Users
```
Double-click: scripts/start-oauth-test.bat
```

### Mac/Linux Users
```bash
bash scripts/start-oauth-test.sh
```

### Anyone (via npm)
```bash
npm run oauth:start
```

---

## 📋 What Happens

The startup script will:
1. ✅ Check Node.js & npm are installed
2. ✅ Install all dependencies
3. ✅ Verify all OAuth files exist
4. ✅ Build TypeScript (catch errors early)
5. ✅ Start dev server on http://localhost:5173
6. ✅ Show testing checklist in terminal

---

## 🧪 Manual Testing (2 minutes)

Once dev server starts:

### Test Gmail
1. Visit http://localhost:5173/scanner/auth/signin
2. Click "🔗 Connect Gmail"
3. Sign in to Google
4. Click "Allow"
5. Should redirect to dashboard ✅

### Test Outlook
1. Click "🔗 Connect Outlook"
2. Sign in to Microsoft
3. Click "Accept"
4. Should redirect to dashboard ✅

### Security Checks (Critical!)
1. Open DevTools (F12)
2. Go to Console tab
3. Paste: `sessionStorage.getItem('email_access_token')`
4. Should show a token (not empty) ✅
5. Open browser history (Ctrl+H)
6. Search "access_token"
7. Should find NOTHING (secure!) ✅

---

## 🔍 Before You Start

### Create `.env.local` in `apps/web/`

```
VITE_GOOGLE_CLIENT_ID=646817279563-3qupgvhauv7i0shb9mpeuuerr5goldmg.apps.googleusercontent.com
VITE_MICROSOFT_CLIENT_ID=<your-client-id>
VITE_SUPABASE_URL=https://mwsalzjsvuvlmshxzbxg.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**Don't have values?**
- Google: https://console.cloud.google.com/apis/credentials
- Microsoft: https://portal.azure.com/ → App registrations
- Supabase: https://supabase.com/ → Project settings

---

## ⚡ Alternative Commands

```bash
# Just validate (no server start)
npm run oauth:validate

# Validate + start server
npm run oauth:test

# Start dev server directly
npm run dev
```

---

## 🐛 Quick Fixes

| Problem | Fix |
| --- | --- |
| Port 5173 in use | `taskkill /F /IM node.exe` |
| Missing .env.local | Create file with vars above |
| "TypeScript error" | Run `npm run build --workspace @digitaleu/web` |
| "404 exchange-email-code" | Deploy: `supabase functions deploy exchange-email-code` |
| OAuth won't redirect | Check redirect URI in Google/Microsoft settings |

---

## 📊 Success Checklist

- [ ] Gmail OAuth connects without errors
- [ ] Outlook OAuth connects without errors
- [ ] No `#access_token` in URL (security!)
- [ ] Token in sessionStorage (DevTools)
- [ ] Redirects to dashboard
- [ ] No tokens in browser history
- [ ] No console errors (F12 → Console)

---

## 📚 Full Documentation

For more details, see:
- `docs/OAUTH_TESTING_QUICK_START.md` — Detailed testing guide
- `docs/PHASE_1_IMPLEMENTATION_SUMMARY.md` — Implementation overview
- `scripts/README.md` — Script documentation

---

## ⏱️ Timeline

| Step | Time |
| --- | --- |
| Setup (first run) | 3 min |
| Gmail test | 2 min |
| Outlook test | 2 min |
| Security checks | 1 min |
| **Total** | **~8 min** |

---

## 🎯 After Testing

If all tests pass:
1. ✅ Commit changes: `git add -A && git commit -m "OAuth Code+PKCE implementation"`
2. ✅ Push: `git push origin feature/oauth-code-pkce`
3. ✅ Create PR for mentor review
4. ✅ Deploy to staging (after approval)
5. ✅ Deploy to production (after staging tests pass)

---

**Ready? Pick a command above and run it now!** 🚀
