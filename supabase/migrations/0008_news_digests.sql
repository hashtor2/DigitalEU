-- Daily AI-generated news digest (one row per day)
CREATE TABLE news_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  digest_text TEXT NOT NULL,
  stories JSONB NOT NULL DEFAULT '[]',
  telegram_posted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE news_digests ENABLE ROW LEVEL SECURITY;

-- Public read — website fetches this
CREATE POLICY "Allow public read" ON news_digests
  FOR SELECT USING (true);

-- Only service role can insert (news_agent.py runs with service key)
CREATE POLICY "Service role insert" ON news_digests
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_news_digests_date ON news_digests(digest_date DESC);
