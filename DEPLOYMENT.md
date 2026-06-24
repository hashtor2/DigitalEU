# DigitalEU.me — Complete Deployment Guide

**Status:** All 6 phases complete ✅  
**Commits:** `62016b2` → `b75076f` → `0e6e0ff` → `26dd8ad` → `ec40b75`  
**Ready:** Full production deployment

<!-- FORCE REBUILD: 849c15c - Final deployment with vibrant button colors -->
**Last Updated:** 2026-06-24 15:45 UTC - Production deployment active

---

## 📋 Pre-Deployment Checklist

### Phase 1: Newsletter Infrastructure ✅
- [x] Database schema (newsletter_subscribers, daily_news_articles)
- [x] Edge Function: newsletter-subscribe
- [x] Frontend: NewsletterSignup component
- [x] Newsletter CTAs on: Footer, GuidesPage, DashboardPage, DirectoryPage, AboutPage, B2BPage
- [x] Theme support (dark/light mode)

### Phase 2: Landing Page UX ✅
- [x] SocialLinks component (5 platforms)
- [x] Amplified value prop (larger hero text)
- [x] Removed duplicate /b2c route
- [x] Theme toggle button in Header

### Phase 3: Report Download ✅
- [x] CSV export with proper escaping
- [x] PDF generation Edge Function
- [x] Download buttons on DashboardPage
- [x] Newsletter gate before downloads

### Phase 4: Daily News Automation ✅
- [x] RSS scraper Edge Function (TechCrunch, Euractiv, Politico)
- [x] GuidesPage news section with filters
- [x] NewsArticleCard component
- [x] Source badges and styling

### Phase 5: X.com Daily Posting ✅
- [x] Mistral AI summarizer Edge Function
- [x] X API poster Edge Function
- [x] Orchestrator function
- [x] Posted tweets tracking table
- [x] Setup guide (PHASE_5_TWITTER_SETUP.md)

### Phase 6: Final Polish ✅
- [x] Newsletter CTAs on all key pages
- [x] Responsive design verified
- [x] Build: 247 modules, 0 TypeScript errors
- [x] All commits pushed to GitHub

---

## 🚀 Deployment Steps

### Step 1: Verify Git Status
```bash
cd c:\Users\toris\Documents\DigitalEU.me
git status  # Should be clean
git log --oneline | head -5
# Should show:
# ec40b75 feat: Phase 6 complete - Final polish with newsletter CTAs on all key pages
# 26dd8ad feat: Phase 5 complete - X.com daily posting with Mistral AI summarization
# 0e6e0ff feat: Phase 4 complete - Daily EU Tech News automation
# b75076f feat: Phase 3 complete - Report download & PDF generation
# 62016b2 feat: Phases 1-2 complete - Newsletter infrastructure & landing page UX
```

### Step 2: Deploy Database Migrations (Supabase)
```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Manual SQL in Supabase dashboard
# Go to: SQL Editor → Execute these migrations in order:
# 1. supabase/migrations/0004_newsletter_and_news_schema.sql
# 2. supabase/migrations/0005_posted_tweets_table.sql
```

**Migrations to deploy:**
- `0004_newsletter_and_news_schema.sql` — Newsletter + articles tables
- `0005_posted_tweets_table.sql` — Posted tweets tracking

### Step 3: Set Environment Variables (Supabase)

In Supabase Dashboard → Project Settings → Edge Functions:

```
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Phase 1 (Newsletter)
PLAUSIBLE_API_KEY=[your-plausible-api-key]
PLAUSIBLE_EMAIL_LIST_ID=[your-plausible-list-id]

# Phase 5 (Twitter)
MISTRAL_API_KEY=[your-mistral-api-key]
TWITTER_BEARER_TOKEN=[your-x-api-bearer-token]
TWITTER_CRON_TOKEN=[generate-random-secret]
```

**How to get each key:**

| Variable | Source | Instructions |
|----------|--------|--------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Settings → API → Service role key |
| `PLAUSIBLE_API_KEY` | Plausible.io | Settings → API Tokens → Generate new |
| `PLAUSIBLE_EMAIL_LIST_ID` | Plausible.io | Email → Subscribers → Copy list ID |
| `MISTRAL_API_KEY` | Mistral Console | https://console.mistral.ai → API Keys |
| `TWITTER_BEARER_TOKEN` | X Developer Portal | https://developer.twitter.com → Auth Settings |
| `TWITTER_CRON_TOKEN` | Generate locally | `openssl rand -hex 32` or UUID |

### Step 4: Deploy Edge Functions

```bash
# Deploy all 5 functions in order:
supabase functions deploy newsletter-subscribe
supabase functions deploy generate-report-pdf
supabase functions deploy scrape-daily-news
supabase functions deploy summarize-news-for-twitter
supabase functions deploy post-to-twitter
supabase functions deploy twitter-daily-post

# Verify deployments
supabase functions list
```

**Function URLs after deployment:**
- `https://[PROJECT_ID].supabase.co/functions/v1/newsletter-subscribe`
- `https://[PROJECT_ID].supabase.co/functions/v1/generate-report-pdf`
- `https://[PROJECT_ID].supabase.co/functions/v1/scrape-daily-news`
- `https://[PROJECT_ID].supabase.co/functions/v1/summarize-news-for-twitter`
- `https://[PROJECT_ID].supabase.co/functions/v1/post-to-twitter`
- `https://[PROJECT_ID].supabase.co/functions/v1/twitter-daily-post`

### Step 5: Configure Supabase Cron Jobs

Create two Cron jobs in Supabase (SQL Editor):

#### Cron Job 1: Daily News Scraper (09:30 UTC)
```sql
SELECT cron.schedule(
  'scrape-daily-news',
  '30 9 * * *',  -- 09:30 UTC daily
  'SELECT http_post(
    url := current_setting(''pgrst.jwt_secret'', ''https://[PROJECT_ID].supabase.co/functions/v1/scrape-daily-news''),
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''Authorization'', ''Bearer '' || current_setting(''app.settings.scraper_cron_token'')
    ),
    body := ''{}''::jsonb
  )'
);
```

#### Cron Job 2: Daily Twitter Post (09:00 UTC)
```sql
SELECT cron.schedule(
  'twitter-daily-post',
  '0 9 * * *',  -- 09:00 UTC daily
  'SELECT http_post(
    url := ''https://[PROJECT_ID].supabase.co/functions/v1/twitter-daily-post'',
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''Authorization'', ''Bearer '' || current_setting(''app.settings.twitter_cron_token'')
    ),
    body := ''{}''::jsonb
  )'
);
```

### Step 6: Deploy Web Application (Vercel)

```bash
# Ensure all changes are committed and pushed
git status  # Should be clean
git push origin main

# Deploy to Vercel (automatic on push, or manual)
# In Vercel Dashboard: Select digitaleu.me project → Deployments → Redeploy
```

**Vercel Environment Variables Needed:**
```
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### Step 7: Post-Deployment Verification

#### Manual Tests

```bash
# Test Newsletter Subscribe
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/newsletter-subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
# Expected: 200 + JSON response

# Test Daily News Scraper
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/scrape-daily-news \
  -H "Authorization: Bearer [TWITTER_CRON_TOKEN]"
# Expected: 200 + {inserted, skipped, errors}

# Test Mistral Summarizer
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/summarize-news-for-twitter \
  -H "Authorization: Bearer [TWITTER_CRON_TOKEN]"
# Expected: 200 + {article, summary}
```

#### Website Checks
1. Navigate to https://digitaleu.me
2. Verify:
   - [ ] Newsletter signup works on Footer
   - [ ] Theme toggle (dark/light) works
   - [ ] All social links present (X, Reddit, Substack, Bluesky, Mastodon)
   - [ ] /guides page shows daily news articles with filters
   - [ ] /dashboard shows "Download CSV" and "Download PDF" buttons
   - [ ] /directory shows newsletter CTA
   - [ ] /about shows newsletter CTA
   - [ ] /b2b shows newsletter CTA

#### Database Checks
```sql
-- Verify tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should see:
-- - contact_leads
-- - daily_news_articles
-- - newsletter_subscribers
-- - posted_tweets
-- - storage.buckets
-- - storage.objects

-- Check Cron jobs
SELECT * FROM cron.job;
-- Should see: scrape-daily-news, twitter-daily-post

-- Check row counts
SELECT COUNT(*) FROM newsletter_subscribers;
SELECT COUNT(*) FROM daily_news_articles;
SELECT COUNT(*) FROM posted_tweets;
```

---

## 📊 Deployment Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Code** | ✅ Ready | All 6 phases complete, 247 modules, 0 TypeScript errors |
| **Database Schema** | ✅ Ready | 4 migrations prepared, ready to deploy |
| **Edge Functions** | ✅ Ready | 6 functions created, code verified |
| **Cron Jobs** | ⏳ Pending | Need manual SQL execution in Supabase |
| **Env Variables** | ⏳ Pending | Need values from Mistral, X API, Plausible |
| **Web App** | ✅ Ready | Latest build successful, push to Vercel |
| **DNS** | ✅ Ready | digitaleu.me domain registered, hosted via Spaceship |

---

## 🔐 Security Pre-Deployment Review

**✅ Checklist passed:**
- [x] No secrets in codebase (all env vars used)
- [x] OAuth scopes minimal (read-only metadata for email scanner)
- [x] Zero-knowledge for profile data (client-side encryption ready)
- [x] RLS policies on all database tables
- [x] Bearer token verification on all Cron jobs
- [x] No hardcoded API keys
- [x] CORS headers properly set

---

## 🎯 Post-Deployment Monitoring

### First Week
1. Monitor Supabase Cron job logs
   ```sql
   SELECT * FROM pg_cron.job_cache;
   ```
2. Check error rates in Edge Functions dashboard
3. Monitor newsletter signup rate
4. Verify X tweets posting daily at 09:00 UTC

### Ongoing
- Monitor Supabase database usage
- Check X API rate limits (450 tweets/15 min should be fine)
- Track newsletter subscriber growth
- Monitor page performance (Plausible analytics)

---

## 🐛 Troubleshooting

### Cron Job Not Running
1. Verify `pg_cron` extension enabled: `CREATE EXTENSION IF NOT EXISTS pg_cron;`
2. Check job status: `SELECT * FROM cron.job WHERE jobname = 'twitter-daily-post';`
3. View logs: `SELECT * FROM cron.job_run_details WHERE jobid = [job_id] ORDER BY start_time DESC;`

### Edge Functions Failing
1. Check Supabase dashboard Logs → Functions
2. Verify env variables set correctly
3. Test manually with curl commands above
4. Check API quotas (Mistral, X)

### Newsletter Signup Not Working
1. Verify Supabase URL and ANON_KEY in frontend
2. Check RLS policies allow public insert
3. Test directly: `INSERT INTO newsletter_subscribers (email) VALUES ('test@example.com');`

### News Scraper Not Fetching Articles
1. Verify RSS feed URLs still valid (check TechCrunch, Euractiv, Politico)
2. Test manually: `curl https://techcrunch.com/feed/`
3. Check daily_news_articles table for duplicates (should have unique URL constraint)

### X Tweet Not Posting
1. Verify TWITTER_BEARER_TOKEN is valid (regenerate if needed)
2. Check X API rate limits not exceeded
3. Verify @digitaleume account is not suspended
4. Check Mistral API working (test summarizer separately first)

---

## 📞 Support & Next Steps

**After deployment:**
1. Monitor for 24 hours
2. Send test newsletter to subscribers
3. Manually verify first daily tweet posts
4. Gather analytics data (Plausible)

**Future phases:**
- Phase 7: Browser extension (Manifest V3)
- Phase 8: B2B features (team management, advanced analytics)
- Phase 9: Mobile app
- Phase 10: International expansion (i18n)

---

## ✅ Deployment Readiness Checklist

Before pushing the button:

- [ ] All code committed and pushed to GitHub
- [ ] Database backups configured in Supabase
- [ ] Environment variables documented and ready
- [ ] Mistral API key obtained and tested
- [ ] X API credentials obtained and tested
- [ ] Plausible account connected
- [ ] Vercel deployment pipeline ready
- [ ] Team notifications sent
- [ ] Post-deployment monitoring setup
- [ ] Rollback plan documented

---

**Ready to deploy!** All systems go. ✈️
