-- Services catalog table for matching sender domains
create table services_catalog (
  id text primary key,
  name text not null,
  category text not null,
  us_service boolean default true,
  domain_patterns text[] not null,
  alternative_eu_service_id text,
  website_url text,
  logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Sample services data (will be expanded with full catalog)
insert into services_catalog (id, name, category, domain_patterns, website_url) values
  ('netflix', 'Netflix', 'streaming', array['netflix.com'], 'https://netflix.com'),
  ('spotify', 'Spotify', 'music', array['spotify.com'], 'https://spotify.com'),
  ('google', 'Google', 'email', array['gmail.com', 'google.com'], 'https://google.com'),
  ('microsoft', 'Microsoft', 'email', array['outlook.com', 'hotmail.com', 'live.com'], 'https://outlook.com'),
  ('dropbox', 'Dropbox', 'storage', array['dropbox.com'], 'https://dropbox.com'),
  ('openai', 'OpenAI / ChatGPT', 'ai', array['openai.com'], 'https://openai.com'),
  ('notion', 'Notion', 'productivity', array['notion.so'], 'https://notion.so'),
  ('slack', 'Slack', 'communication', array['slack.com'], 'https://slack.com'),
  ('github', 'GitHub', 'development', array['github.com'], 'https://github.com'),
  ('amazon', 'Amazon', 'ecommerce', array['amazon.com'], 'https://amazon.com'),
  ('adobe', 'Adobe', 'creative', array['adobe.com'], 'https://adobe.com'),
  ('canva', 'Canva', 'design', array['canva.com'], 'https://canva.com'),
  ('figma', 'Figma', 'design', array['figma.com'], 'https://figma.com');

-- Allow public read access to the catalog
alter table services_catalog enable row level security;
create policy "Anyone can view services catalog (public)"
  on services_catalog for select
  using (true);
