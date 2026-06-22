-- Create posted_tweets table to track tweets sent to @digitaleume
CREATE TABLE IF NOT EXISTS posted_tweets (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  article_id text NOT NULL UNIQUE,
  twitter_id text NOT NULL UNIQUE,
  text text NOT NULL,
  posted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Foreign key to daily_news_articles
  CONSTRAINT fk_article FOREIGN KEY (article_id)
    REFERENCES daily_news_articles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE posted_tweets ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read (public tweets)
CREATE POLICY "Allow public read"
  ON posted_tweets
  FOR SELECT
  USING (true);

-- Policy: Only backend can insert
CREATE POLICY "Allow backend insert"
  ON posted_tweets
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL); -- Only service role can insert

-- Index on article_id for quick lookups
CREATE INDEX idx_posted_tweets_article_id
  ON posted_tweets(article_id);

-- Index on posted_at for sorting
CREATE INDEX idx_posted_tweets_posted_at
  ON posted_tweets(posted_at DESC);

-- Index on twitter_id for deduplication
CREATE INDEX idx_posted_tweets_twitter_id
  ON posted_tweets(twitter_id);
