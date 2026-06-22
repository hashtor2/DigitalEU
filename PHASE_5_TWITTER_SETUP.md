# Phase 5: X.com Daily Posting Configuration

## Overview
Automated daily tweet posting to @digitaleume account using Mistral AI for summarization and X API v2 for posting.

## Architecture

### Functions
1. **`summarize-news-for-twitter`** - Fetches latest article and generates summary
2. **`post-to-twitter`** - Posts tweet to X API and records in database
3. **`twitter-daily-post`** - Orchestrator (chains the above two)

### Database
- **`posted_tweets`** - Tracks all tweets posted (for deduplication and history)
- Uses `daily_news_articles` table created in Phase 4

## Setup Instructions

### 1. Environment Variables (Supabase)
Set these in your Supabase project settings → Edge Functions:

```bash
MISTRAL_API_KEY=<your-mistral-api-key>
TWITTER_BEARER_TOKEN=<your-x-api-bearer-token>
TWITTER_CRON_TOKEN=<generate-random-secret>
```

### 2. Get API Keys

#### Mistral API
1. Sign up at https://console.mistral.ai
2. Create API key in account settings
3. Copy and paste into MISTRAL_API_KEY

#### X (Twitter) API
1. Apply for X API access at https://developer.twitter.com
2. Create an App for @digitaleume account
3. Generate Bearer Token in Auth settings
4. Copy into TWITTER_BEARER_TOKEN

#### Generate TWITTER_CRON_TOKEN
```bash
# Generate a random token (keep this secret)
openssl rand -hex 32
# or on Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

### 3. Deploy Migration
```bash
supabase db push 0005_posted_tweets_table.sql
```
This creates the `posted_tweets` table and RLS policies.

### 4. Deploy Edge Functions
```bash
supabase functions deploy summarize-news-for-twitter
supabase functions deploy post-to-twitter
supabase functions deploy twitter-daily-post
```

### 5. Create Supabase Cron Job
In your Supabase Dashboard:
1. Go to Database → Cron Jobs (in SQL Editor, run):

```sql
-- Create cron job for daily tweet posting at 09:00 UTC
SELECT cron.schedule(
  'daily-twitter-post',
  '0 9 * * *',  -- 09:00 UTC daily
  'SELECT http_post(
    url := concat(
      current_setting(''app.settings.supabase_url''),
      ''/functions/v1/twitter-daily-post''
    ),
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''Authorization'', ''Bearer '' || current_setting(''app.settings.twitter_cron_token'')
    ),
    body := ''{}''::jsonb
  )'
);
```

**OR** use the Supabase Cron UI if available in your dashboard.

## Manual Testing

### Test Summarizer
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/summarize-news-for-twitter \
  -H "Authorization: Bearer $TWITTER_CRON_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Poster
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/post-to-twitter \
  -H "Authorization: Bearer $TWITTER_CRON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "article": {
      "articleId": "article-123",
      "title": "EU Launches New Data Privacy Framework",
      "url": "https://example.com/article",
      "summary": "European Union announces stricter data privacy regulations..."
    }
  }'
```

### Test Orchestrator (Daily Job)
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/twitter-daily-post \
  -H "Authorization: Bearer $TWITTER_CRON_TOKEN" \
  -H "Content-Type: application/json"
```

## Tweet Format

Example tweet generated:
```
EU officials announce new digital sovereignty framework to reduce Big Tech dependence. 
Companies must comply by Q4 2026.

https://example.com/article

#EU #Tech #Privacy
```

Character limit: 280 (Twitter limit)
Summary is kept to ~200 chars to leave room for URL and hashtags.

## Monitoring

### View Posted Tweets
```sql
SELECT * FROM posted_tweets
ORDER BY posted_at DESC
LIMIT 20;
```

### View Cron Job Status
```sql
SELECT * FROM cron.job
WHERE jobname = 'daily-twitter-post';
```

## Troubleshooting

### No tweets posting
1. Check Supabase Cron job status
2. Verify API keys are correct
3. Check X API rate limits (300 tweets/15 minutes)
4. Look at Edge Function logs in Supabase dashboard

### Mistral API errors
- Verify MISTRAL_API_KEY is correct
- Check Mistral account has credits
- Rate limit: 100 requests/minute (shouldn't hit this)

### Twitter API errors
- Verify TWITTER_BEARER_TOKEN is valid
- Check @digitaleume account permissions
- Verify X API access level (Academic, Elevated, or Pro required)
- Check rate limits: 450 tweets/15 minutes (shouldn't hit this)

## Architecture Flow

```
09:00 UTC (Daily)
    ↓
Supabase Cron triggers
    ↓
POST /functions/v1/twitter-daily-post
    ↓
Orchestrator chains:
    ├─ Fetch latest article from daily_news_articles
    ├─ Call Mistral API to summarize
    ├─ Generate tweet text
    ├─ POST to X API v2
    └─ Record tweet in posted_tweets table
    ↓
Tweet posted to @digitaleume
    ↓
Users see new tweet in feed
```

## Phase 5 Status
✅ Code complete - All functions created
⏳ Configuration pending - Set environment variables
⏳ Deployment pending - Deploy functions and migration
⏳ Activation pending - Create Supabase Cron job

**Next Steps:**
1. Get API keys (Mistral, X)
2. Set environment variables
3. Run `supabase db push` for migration
4. Deploy functions: `supabase functions deploy [function-name]`
5. Create Cron job in Supabase dashboard
6. Test manually, then wait for first automated run at 09:00 UTC
