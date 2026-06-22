-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public insert policy (no auth required for signup)
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- No select/update/delete for public (backend-only)
CREATE POLICY "No public read" ON newsletter_subscribers
  FOR SELECT USING (false);

-- Daily news articles table
CREATE TABLE daily_news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('TechCrunch', 'Euractiv', 'Politico')),
  description TEXT,
  image_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_news_articles ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read" ON daily_news_articles
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);
CREATE INDEX idx_daily_news_articles_source ON daily_news_articles(source);
CREATE INDEX idx_daily_news_articles_scraped_at ON daily_news_articles(scraped_at DESC);
CREATE INDEX idx_daily_news_articles_featured ON daily_news_articles(featured);
