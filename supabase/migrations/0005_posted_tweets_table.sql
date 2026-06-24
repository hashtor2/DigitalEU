-- Create posted_tweets table to track tweets sent to @digitaleume
CREATE TABLE IF NOT EXISTS posted_tweets (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  article_id text NOT NULL UNIQUE,
  twitter_id text NOT NULL UNIQUE,
  text text NOT NULL,
  posted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE posted_tweets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON posted_tweets FOR SELECT USING (true);
CREATE POLICY "Allow backend insert" ON posted_tweets FOR INSERT WITH CHECK (auth.uid() IS NULL);

CREATE INDEX idx_posted_tweets_article_id ON posted_tweets(article_id);
CREATE INDEX idx_posted_tweets_posted_at ON posted_tweets(posted_at DESC);
CREATE INDEX idx_posted_tweets_twitter_id ON posted_tweets(twitter_id);
