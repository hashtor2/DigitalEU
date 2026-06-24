# PHASE_1_IMPLEMENTATION_CHECKLIST.md

**Phase:** Phase 1 — OAuth Code+PKCE Deployment  
**Status:** IMPLEMENTATION IN PROGRESS  
**Start Date:** 2026-06-24  
**Target Completion:** 2026-06-26 (2 days)  
**Owner:** Lead Engineer  

---

## Summary

This checklist tracks the OAuth Code+PKCE migration (Implicit Grant → Authorization Code Flow with PKCE).

**Files Created/Modified:**
1. ✅ `apps/scanner/src/lib/oauth-utils.ts` — PKCE utilities
2. ✅ `apps/scanner/src/routes/auth/email-callback.tsx` — OAuth callback handler
3. ✅ `supabase/functions/exchange-email-code/index.ts` — Edge Function for code exchange
4. ✅ `apps/scanner/src/routes/auth/signin.tsx` — Updated OAuth flow
5. ✅ `apps/scanner/src/App.tsx` — Added email-callback route

**Status:** Code implementation complete. Ready for testing & deployment.

---

## Pre-Deployment Checklist

### Local Development (Day 1)

- [ ] **Start dev server:**
  ```bash
  npm run dev:scanner
  ```
  Expected: Server running on http://localhost:5174

- [ ] **Verify environment variables:**
  - [ ] `.env.local` has `VITE_GOOGLE_CLIENT_ID`
  - [ ] `.env.local` has `VITE_MICROSOFT_CLIENT_ID`
  - [ ] `.env.local` has `VITE_SUPABASE_URL`
  - [ ] `.env.local` has `VITE_SUPABASE_ANON_KEY`

- [ ] **Supabase Edge Function deployment (local):**
  ```bash
  supabase functions deploy exchange-email-code --project-ref fuiebtpezpoxvkuuhaqy
  ```
  Expected: Function deployed to `https://fuiebtpezpoxvkuuhaqy.supabase.co/functions/v1/exchange-email-code`

- [ ] **Manual testing — Gmail flow:**
  1. Navigate to http://localhost:5174/auth/signin
  2. Click "🔗 Connect Gmail"
  3. Verify:
     - Redirected to Google OAuth login
     - No `#access_token` in URL (code should be in query string instead)
     - Google shows app consent screen
     - After approval, redirects to `/auth/email-callback`
     - See "Completing email authentication..." spinner
     - Redirects to `/dashboard` after token exchange
  4. Verify in browser console (DevTools):
     - `sessionStorage.getItem('email_access_token')` returns a token
     - `sessionStorage.getItem('email_provider')` returns `'gmail'`

- [ ] **Manual testing — Outlook flow:**
  1. Open new browser tab (or private/incognito window)
  2. Navigate to http://localhost:5174/auth/signin
  3. Click "🔗 Connect Outlook"
  4. Verify:
     - Redirected to Microsoft login
     - Correct OAuth redirect_uri shown
     - After approval, redirects to `/auth/email-callback`
     - Token stored in sessionStorage
     - Redirects to `/dashboard`

- [ ] **Test error handling:**
  1. In browser console, manually set incorrect `codeVerifier`:
     ```javascript
     sessionStorage.setItem('oauth_code_verifier', 'wrong_verifier')
     ```
  2. Reload email-callback page
  3. Verify error message shows (e.g., "code_verifier mismatch")
  4. Verify user can click "Try signing in again" link

- [ ] **Test CSRF protection (state parameter):**
  1. Manually tamper with state in URL:
     ```
     http://localhost:5174/auth/email-callback?code=xyz&state=WRONG
     ```
  2. Verify error: "State parameter mismatch"

- [ ] **Verify no tokens in history:**
  1. Complete a full Gmail/Outlook OAuth flow
  2. Open browser history (Ctrl+H)
  3. Search history for "access_token"
  4. Verify no results (tokens should NOT be in URL)

- [ ] **Security audit (local):**
  - [ ] Run TypeScript compiler: `npm run build --workspace @digitaleu/scanner`
    - Expect: 0 errors, 0 warnings
  - [ ] Check for console.* statements in new files
    - Expected: None in production code
  - [ ] Verify no secrets in .env (should be .env.local, gitignored)

### Staging Deployment (Day 1–2)

- [ ] **Deploy Edge Function to staging:**
  ```bash
  supabase functions deploy exchange-email-code --project-ref fuiebtpezpoxvkuuhaqy
  ```

- [ ] **Deploy scanner app to staging:**
  - Branch: feature/oauth-code-pkce
  - Build: `npm run build --workspace @digitaleu/scanner`
  - Deploy to Vercel preview (automatic via PR)

- [ ] **Test staging environment:**
  - [ ] Visit staging scanner URL
  - [ ] Repeat manual testing from local (Gmail + Outlook flows)
  - [ ] Verify token exchange succeeds (no CORS errors)
  - [ ] Monitor Supabase logs for errors:
    ```bash
    supabase functions list --project-ref fuiebtpezpoxvkuuhaqy
    # Then check logs in Supabase dashboard
    ```

- [ ] **Performance check:**
  - [ ] Measure time from OAuth button click → redirectTo dashboard
    - Expected: < 3 seconds
  - [ ] Check for any slow requests in DevTools Network tab

- [ ] **Security review (code):**
  - [ ] Mentor reviews OAUTH_FLOW_MIGRATION.md
  - [ ] Mentor reviews `oauth-utils.ts` (PKCE generation)
  - [ ] Mentor reviews `exchange-email-code` Edge Function
  - [ ] Mentor verifies no tokens logged/exposed

### Production Deployment (Day 2)

- [ ] **Create pull request:**
  - [ ] Branch: feature/oauth-code-pkce
  - [ ] Include changes to all 5 files
  - [ ] Link to OAUTH_FLOW_MIGRATION.md in PR description
  - [ ] Request mentor approval

- [ ] **Merge to main:**
  - [ ] All checks passing (build, lint, tests)
  - [ ] Mentor approval received
  - [ ] Merge to main

- [ ] **Deploy to production:**
  ```bash
  # Vercel automatically deploys on main push
  # Verify deployment in Vercel dashboard
  ```

  - [ ] Supabase Edge Function deployed to production
  - [ ] Scanner app live on https://scanner.digitaleu.me

- [ ] **Post-launch monitoring (24 hours):**
  - [ ] Check error rates in Supabase logs
    - Expected: < 1% error rate
  - [ ] Monitor user feedback for OAuth issues
  - [ ] Check Vercel function logs for timeouts
  - [ ] Verify no token-related errors in client

- [ ] **Rollback plan (if critical issues):**
  - If OAuth flow broken:
    1. Revert main to previous commit
    2. Redeploy from previous version
    3. Notify users of issue
  - Have rollback command ready:
    ```bash
    git revert HEAD --no-edit && git push origin main
    ```

---

## Environment Variables Setup

**Vercel (Production):**

```
VITE_GOOGLE_CLIENT_ID=<from Google Cloud Console>
VITE_MICROSOFT_CLIENT_ID=<from Azure AD>
VITE_SUPABASE_URL=https://fuiebtpezpoxvkuuhaqy.supabase.co
VITE_SUPABASE_ANON_KEY=<from Supabase>
```

**Supabase Edge Function (Production):**

```
GOOGLE_OAUTH_CLIENT_ID=<from Google Cloud Console>
GOOGLE_OAUTH_CLIENT_SECRET=<from Google Cloud Console>
MICROSOFT_OAUTH_CLIENT_ID=<from Azure AD>
MICROSOFT_OAUTH_CLIENT_SECRET=<from Azure AD>
```

> ⚠️ **CRITICAL:** Never commit secrets. Set via Vercel/Supabase dashboards only.

---

## Testing Checklist

### Unit Tests (optional, for future)

- [ ] Test `generateCodeVerifier()` produces 43–128 char string
- [ ] Test `generateCodeChallenge()` returns valid base64url
- [ ] Test PKCE round-trip: verifier → challenge → validation
- [ ] Test `constructGmailAuthUrl()` includes all required params
- [ ] Test `constructOutlookAuthUrl()` includes all required params

### Integration Tests (manual for now)

- [ ] ✅ Gmail OAuth flow end-to-end
- [ ] ✅ Outlook OAuth flow end-to-end
- [ ] ✅ Error handling (wrong code, expired code)
- [ ] ✅ CSRF protection (state validation)
- [ ] ✅ No tokens in browser history

### Security Tests

- [ ] ✅ No `#access_token` in URL
- [ ] ✅ No console.log statements in production build
- [ ] ✅ PKCE parameters stored in sessionStorage (ephemeral)
- [ ] ✅ Access token not persisted (only sessionStorage)
- [ ] ✅ Edge Function validates code_verifier

---

## Deployment Runbook

### Staging → Production (Day 2, afternoon)

```bash
# 1. Pull latest main
git pull origin main

# 2. Verify all changes committed
git status
# Expected: nothing to commit

# 3. Deploy Edge Function
supabase functions deploy exchange-email-code --project-ref fuiebtpezpoxvkuuhaqy

# 4. Verify function deployed
supabase functions list --project-ref fuiebtpezpoxvkuuhaqy

# 5. Monitor Supabase
# Open Supabase dashboard → Edge Functions → exchange-email-code
# Check logs in real-time as users interact

# 6. Monitor Vercel
# Open Vercel dashboard → scanner
# Check deployments & function metrics

# 7. If issues arise
# Option A: Fix and redeploy
git commit -am "Fix OAuth issue"
git push origin main

# Option B: Rollback
git revert HEAD --no-edit
git push origin main
```

---

## Communication Plan

### Before Deployment
- [ ] Notify team: "Deploying OAuth Code+PKCE flow today"
- [ ] Slack: Link to OAUTH_FLOW_MIGRATION.md

### After Deployment
- [ ] Monitor errors for 24 hours
- [ ] Slack update: "OAuth flow deployed successfully" + metrics
- [ ] Document any issues encountered

### If Issues
- [ ] Slack alert: "OAuth deployment rolled back due to [issue]"
- [ ] Create GitHub issue for postmortem

---

## Success Criteria

**Launch is successful when:**

1. ✅ Users can connect Gmail via new OAuth Code+PKCE flow
2. ✅ Users can connect Outlook via new OAuth Code+PKCE flow
3. ✅ No `#access_token` in any URLs (browser history shows only authorization code)
4. ✅ PKCE code_verifier validatedserver-side (no code interception possible)
5. ✅ Error rate < 1% in Supabase logs
6. ✅ Deployment time < 3 seconds (OAuth button → dashboard)
7. ✅ Zero security issues in deployment review
8. ✅ Mentor approval obtained

---

## Known Limitations & Future Improvements

- **Refresh tokens:** Currently not handled (tokens are short-lived). TODO for Phase 2 if long-term access needed.
- **Rate limiting:** Edge Function has no rate limiting yet. TODO if high traffic causes abuse.
- **Analytics:** No logging of OAuth events (intentional for privacy). Could add anonymized metrics later.
- **Multi-provider:** Only Gmail & Outlook supported. TODO: Add additional providers.

---

## References

- [OAUTH_FLOW_MIGRATION.md](./OAUTH_FLOW_MIGRATION.md) — Detailed OAuth specification
- [RFC 7636: PKCE](https://tools.ietf.org/html/rfc7636) — Proof Key for Public OAuth 2.0 Clients
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth 2.0 Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)

---

**Next Phase:** After successful deployment, proceed to CASA Tier 2 assessment (see CASA_TIER_2_ROADMAP.md).
