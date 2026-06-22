# Deployment Execution Checklist

**Project:** DigitalEU.me - European Alternatives to Big Tech  
**Status:** All 6 phases complete, ready for production  
**Date:** 2026-06-22  
**Last Commit:** 537e743

---

## ✅ PRE-DEPLOYMENT VERIFICATION

```bash
# Verify git status
cd c:\Users\toris\Documents\DigitalEU.me
git status
# Expected: On branch main, nothing to commit, working tree clean

# Verify commits pushed
git log --oneline -7
# Expected: All 6 phase commits visible
```

**Status:** ✅ READY

---

## 🚀 DEPLOYMENT STEPS (Execute in Order)

### PHASE A: Database Migrations (Supabase)

**Action:** Deploy 2 migrations to Supabase database

```bash
# If using Supabase CLI:
supabase db push

# OR: Manual SQL in Supabase Dashboard → SQL Editor
# Execute these two files in order:
# 1. supabase/migrations/0004_newsletter_and_news_schema.sql
# 2. supabase/migrations/0005_posted_tweets_table.sql
```

**Verify:**
```sql
-- Run in Supabase SQL Editor:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show:
-- contact_leads
-- daily_news_articles
-- newsletter_subscribers
-- posted_tweets
```

**Checklist:**
- [ ] Migration 0004 executed
- [ ] Migration 0005 executed
- [ ] All 4 tables created
- [ ] No SQL errors

---

### PHASE B: Environment Variables (Supabase Dashboard)

**Action:** Set env vars for Edge Functions

**Location:** Supabase → Project → Settings → Edge Functions

**Add these variables:**

```
SUPABASE_URL = https://[YOUR_PROJECT_ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY = [Copy from Settings → API → Service Role Key]

MISTRAL_API_KEY = [Get from https://console.mistral.ai/api-keys]
TWITTER_BEARER_TOKEN = [Get from https://developer.twitter.com → @digitaleume app → Auth Settings]
TWITTER_CRON_TOKEN = [Generate: openssl rand -hex 32]

PLAUSIBLE_API_KEY = [Optional: Get from https://plausible.io/settings/integrations]
PLAUSIBLE_EMAIL_LIST_ID = [Optional: Get from Plausible email subscribers list]
```

**Checklist:**
- [ ] SUPABASE_URL set
- [ ] SUPABASE_SERVICE_ROLE_KEY set
- [ ] MISTRAL_API_KEY set
- [ ] TWITTER_BEARER_TOKEN set
- [ ] TWITTER_CRON_TOKEN set
- [ ] (Optional) PLAUSIBLE keys set

---

### PHASE C: Deploy Edge Functions (Supabase CLI)

**Action:** Deploy 6 Edge Functions

```bash
# Ensure you're logged into Supabase CLI
supabase link --project-ref [YOUR_PROJECT_ID]

# Deploy each function
supabase functions deploy newsletter-subscribe
supabase functions deploy generate-report-pdf
supabase functions deploy scrape-daily-news
supabase functions deploy summarize-news-for-twitter
supabase functions deploy post-to-twitter
supabase functions deploy twitter-daily-post

# Verify deployments
supabase functions list
```

**Expected Output:**
```
newsletter-subscribe
generate-report-pdf
scrape-daily-news
summarize-news-for-twitter
post-to-twitter
twitter-daily-post
```

**Checklist:**
- [ ] All 6 functions deployed
- [ ] No deployment errors
- [ ] Functions visible in Supabase dashboard

---

### PHASE D: Create Cron Jobs (Supabase SQL)

**Action:** Schedule 2 automated tasks

**Location:** Supabase → SQL Editor

**Copy & Execute these SQL statements:**

#### Cron Job 1: Daily News Scraper (09:30 UTC)

```sql
-- First, ensure pg_cron is available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job
SELECT cron.schedule(
  'scrape-daily-news',
  '30 9 * * *',  -- 09:30 UTC daily
  $$
  SELECT http_post(
    'https://[YOUR_PROJECT_ID].supabase.co/functions/v1/scrape-daily-news',
    '{}'::jsonb,
    'application/json',
    jsonb_build_object(
      'Authorization', 'Bearer [YOUR_TWITTER_CRON_TOKEN]'
    )
  )
  $$
);
```

#### Cron Job 2: X.com Daily Post (09:00 UTC)

```sql
SELECT cron.schedule(
  'twitter-daily-post',
  '0 9 * * *',  -- 09:00 UTC daily
  $$
  SELECT http_post(
    'https://[YOUR_PROJECT_ID].supabase.co/functions/v1/twitter-daily-post',
    '{}'::jsonb,
    'application/json',
    jsonb_build_object(
      'Authorization', 'Bearer [YOUR_TWITTER_CRON_TOKEN]'
    )
  )
  $$
);

-- Verify jobs created
SELECT jobid, jobname, schedule, command FROM cron.job;
```

**Checklist:**
- [ ] pg_cron extension created
- [ ] scrape-daily-news job scheduled
- [ ] twitter-daily-post job scheduled
- [ ] Both jobs visible in cron.job table

---

### PHASE E: Web App Deployment (Vercel)

**Action:** Deploy web app to production

**Status:** ✅ ALREADY DONE (auto-deployed on git push)

```bash
# Verify Vercel deployment
# Check Vercel dashboard for digitaleu.me project
# Should show: Latest deployment successful

# Or check live
curl -I https://www.digitaleu.me
# Expected: HTTP/1.1 200 OK
```

**Frontend Env Vars** (should already be set in Vercel):
```
VITE_SUPABASE_URL = https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY = [Copy from Supabase → Settings → API → anon key]
```

**Checklist:**
- [ ] Web app deployed to Vercel
- [ ] VITE env vars set in Vercel dashboard
- [ ] https://www.digitaleu.me loads
- [ ] Newsletter signup works
- [ ] Dark/light theme toggle works

---

## 🧪 POST-DEPLOYMENT VERIFICATION

### Manual API Tests

```bash
# Test 1: Newsletter Subscribe
curl -X POST https://[YOUR_PROJECT_ID].supabase.co/functions/v1/newsletter-subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test-deploy@example.com","name":"Test Deploy"}' 
# Expected: 200 OK, success message

# Test 2: News Scraper (trigger manually)
curl -X POST https://[YOUR_PROJECT_ID].supabase.co/functions/v1/scrape-daily-news \
  -H "Authorization: Bearer [YOUR_TWITTER_CRON_TOKEN]"
# Expected: 200 OK, {inserted: N, skipped: M, errors: 0}

# Test 3: Mistral Summarizer
curl -X POST https://[YOUR_PROJECT_ID].supabase.co/functions/v1/summarize-news-for-twitter \
  -H "Authorization: Bearer [YOUR_TWITTER_CRON_TOKEN]"
# Expected: 200 OK, {success: true, article: {...}}

# Test 4: Twitter Poster (don't actually post yet!)
# Just verify function exists:
curl -X OPTIONS https://[YOUR_PROJECT_ID].supabase.co/functions/v1/post-to-twitter
# Expected: 200 OK with CORS headers
```

**Checklist:**
- [ ] Newsletter endpoint responds
- [ ] News scraper fetches articles
- [ ] Mistral summarizer works
- [ ] Twitter functions deployed

### Website Verification

Visit https://www.digitaleu.me and verify:

**Home Page (/)**
- [ ] Logo and hero text loads
- [ ] Social links visible (X, Reddit, Substack, Bluesky, Mastodon)
- [ ] Newsletter signup in footer works
- [ ] Theme toggle works (sun/moon icon)

**Email Scanner Page (/emailscanner)**
- [ ] Page loads
- [ ] Paywall/gate functional

**Guides Page (/guides)**
- [ ] Daily news articles visible
- [ ] Source filter tabs work (All, TechCrunch, Euractiv, Politico)
- [ ] Newsletter signup below articles works

**Dashboard Page (/dashboard)**
- [ ] Service selector works
- [ ] "Download CSV" button visible
- [ ] "Download PDF" button visible
- [ ] Download triggers newsletter gate

**Directory Page (/directory)**
- [ ] 100+ services load
- [ ] Search works
- [ ] Category filter works
- [ ] Newsletter CTA visible at bottom

**About Page (/about)**
- [ ] About content loads
- [ ] Newsletter CTA visible

**B2B Page (/b2b)**
- [ ] B2B services load
- [ ] Contact form functional
- [ ] Newsletter CTA visible

**Checklist:**
- [ ] All pages load without errors
- [ ] Newsletter signups work on every page
- [ ] Theme toggle works globally
- [ ] No 404 errors
- [ ] No console errors (F12 → Console)

### Database Verification

```sql
-- Check in Supabase SQL Editor:

-- Newsletter subscribers (after test signup)
SELECT COUNT(*) as subscriber_count FROM newsletter_subscribers;
-- Expected: > 0

-- Daily news articles (after scraper runs)
SELECT COUNT(*) as article_count FROM daily_news_articles;
-- Expected: 20-50 articles

-- Posted tweets (will be empty until 09:00 UTC)
SELECT COUNT(*) as tweet_count FROM posted_tweets;
-- Expected: 0 (until first cron job runs)

-- View cron job status
SELECT jobid, jobname, last_run_success, last_run_time FROM cron.job_run_details 
ORDER BY last_run_time DESC LIMIT 5;
```

**Checklist:**
- [ ] Tables have data
- [ ] Cron jobs logged in job_run_details
- [ ] No error status in cron jobs

---

## 📊 DEPLOYMENT STATUS

| Component | Status | Verified |
|-----------|--------|----------|
| Git commits | ✅ Ready | Pushed to main |
| Database migrations | ⏳ Pending | Execute SQL |
| Environment variables | ⏳ Pending | Set in Supabase UI |
| Edge Functions | ⏳ Pending | Deploy with CLI |
| Cron jobs | ⏳ Pending | Execute SQL |
| Web app | ✅ Deployed | Vercel live |
| DNS | ✅ Active | digitaleu.me live |

---

## 🔄 FIRST-TIME SETUP TIMING

Once all steps above are complete:

1. **First scraper run:** 09:30 UTC tomorrow
   - Fetches latest news from TechCrunch, Euractiv, Politico
   - Stores in `daily_news_articles` table
   - Visible on /guides page

2. **First tweet post:** 09:00 UTC tomorrow
   - Fetches latest article
   - Mistral AI summarizes (20-30 seconds)
   - Posts to @digitaleume account
   - Records in `posted_tweets` table

3. **First newsletter batch:** When you trigger from admin panel
   - All subscribers notified
   - Syncs to Plausible email list (optional)

---

## ⚠️ TROUBLESHOOTING

### If deployments fail...

**Edge Function errors?**
```bash
# Check logs in Supabase dashboard
# Or fetch function logs locally:
supabase functions list --json
supabase functions get-logs [function-name]
```

**Cron jobs not running?**
```sql
-- Check cron extension status
SELECT * FROM cron.job WHERE jobname = 'twitter-daily-post';
SELECT * FROM cron.job_run_details WHERE jobid = [JOB_ID] 
ORDER BY start_time DESC LIMIT 10;
```

**Web app showing old version?**
```bash
# Clear Vercel cache
# Vercel Dashboard → Settings → Git → Purge → Redeploy
# Or: git push origin main --force-with-lease
```

**Newsletter not syncing to Plausible?**
- Function logs will show error
- Doesn't block signup (best-effort non-blocking)
- Can set Plausible vars later

---

## ✅ DEPLOYMENT COMPLETE

Once all steps above are done, you're live in production with:

✅ Newsletter infrastructure (Phase 1)  
✅ Landing page UX (Phase 2)  
✅ Report downloads CSV/PDF (Phase 3)  
✅ Daily news automation (Phase 4)  
✅ X.com daily posting (Phase 5)  
✅ Full website polish (Phase 6)  

**Total:** 6/6 phases deployed to production

---

**Next steps:** Monitor logs, track subscriber growth, watch for first automated tweet at 09:00 UTC.
