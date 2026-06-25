-- Scanner schema: mailbox_connections, scans, scan_results, cancellation_guides
-- Uses gen_random_uuid() (built-in, no extension needed in PG 13+)
-- All creates are IF NOT EXISTS for safe re-application.

create table if not exists profiles (
  id uuid primary key default auth.uid(),
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists beta_allowlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default now()
);

create table if not exists mailbox_connections (
  id uuid primary key default gen_random_uuid(),
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

create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mailbox_connection_id uuid not null references mailbox_connections(id) on delete cascade,
  scan_status text not null default 'pending' check (scan_status in ('pending', 'processing', 'complete', 'failed')),
  error_message text,
  sample_size int default 500,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  deleted_at timestamp with time zone
);

create table if not exists scan_results (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references scans(id) on delete cascade,
  service_id text not null,
  detected_count int default 1,
  confidence float default 0.9,
  sample_senders text[],
  detected_at timestamp with time zone default now()
);

create table if not exists cancellation_guides (
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

-- RLS (safe to run multiple times)
alter table profiles enable row level security;
alter table mailbox_connections enable row level security;
alter table scans enable row level security;
alter table scan_results enable row level security;
alter table beta_allowlist enable row level security;
alter table cancellation_guides enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='mailbox_connections' and policyname='Users can view their own connections') then
    create policy "Users can view their own connections" on mailbox_connections for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='mailbox_connections' and policyname='Users can insert their own connections') then
    create policy "Users can insert their own connections" on mailbox_connections for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='mailbox_connections' and policyname='Users can update their own connections') then
    create policy "Users can update their own connections" on mailbox_connections for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='mailbox_connections' and policyname='Users can delete their own connections') then
    create policy "Users can delete their own connections" on mailbox_connections for delete using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='scans' and policyname='Users can view their own scans') then
    create policy "Users can view their own scans" on scans for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='scans' and policyname='Users can insert their own scans') then
    create policy "Users can insert their own scans" on scans for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='scan_results' and policyname='Users can view scan results from their scans') then
    create policy "Users can view scan results from their scans" on scan_results for select using (exists (select 1 from scans where scans.id = scan_results.scan_id and scans.user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where tablename='beta_allowlist' and policyname='Anyone can view allowlist (public)') then
    create policy "Anyone can view allowlist (public)" on beta_allowlist for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='cancellation_guides' and policyname='Anyone can view guides (public)') then
    create policy "Anyone can view guides (public)" on cancellation_guides for select using (true);
  end if;
end $$;
