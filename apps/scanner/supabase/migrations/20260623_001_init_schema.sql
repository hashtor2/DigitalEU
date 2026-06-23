-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid primary key default auth.uid(),
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Beta allowlist
create table beta_allowlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- Mailbox connections (Gmail/Outlook OAuth tokens)
create table mailbox_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('gmail', 'outlook')),
  oauth_token_encrypted text not null,
  oauth_refresh_token_encrypted text,
  scopes text not null,
  connected_at timestamp with time zone default now(),
  last_used_at timestamp with time zone,
  revoked_at timestamp with time zone,
  unique(user_id, provider)
);

-- Scans (user scan sessions)
create table scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mailbox_connection_id uuid not null references mailbox_connections(id) on delete cascade,
  scan_status text not null default 'pending' check (scan_status in ('pending', 'processing', 'complete', 'failed')),
  error_message text,
  sample_size int default 500,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  deleted_at timestamp with time zone
);

-- Scan results (detected services per scan)
create table scan_results (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid not null references scans(id) on delete cascade,
  service_id text not null,
  detected_count int default 1,
  confidence float default 0.9,
  sample_senders text[],
  detected_at timestamp with time zone default now()
);

-- Cancellation guides
create table cancellation_guides (
  id text primary key,
  service_id text not null unique,
  title text not null,
  slug text not null unique,
  description text not null,
  seo_meta_description text not null,
  canonical_url text,
  how_to_cancel_steps jsonb not null,
  hero_image_url text,
  og_image_url text,
  featured_eu_alternative text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policies
alter table profiles enable row level security;
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

alter table mailbox_connections enable row level security;
create policy "Users can view their own connections"
  on mailbox_connections for select
  using (auth.uid() = user_id);
create policy "Users can insert their own connections"
  on mailbox_connections for insert
  with check (auth.uid() = user_id);
create policy "Users can update their own connections"
  on mailbox_connections for update
  using (auth.uid() = user_id);
create policy "Users can delete their own connections"
  on mailbox_connections for delete
  using (auth.uid() = user_id);

alter table scans enable row level security;
create policy "Users can view their own scans"
  on scans for select
  using (auth.uid() = user_id);
create policy "Users can insert their own scans"
  on scans for insert
  with check (auth.uid() = user_id);

alter table scan_results enable row level security;
create policy "Users can view scan results from their scans"
  on scan_results for select
  using (exists (
    select 1 from scans
    where scans.id = scan_results.scan_id
    and scans.user_id = auth.uid()
  ));

alter table beta_allowlist enable row level security;
create policy "Anyone can view allowlist (public)"
  on beta_allowlist for select
  using (true);

alter table cancellation_guides enable row level security;
create policy "Anyone can view guides (public)"
  on cancellation_guides for select
  using (true);
