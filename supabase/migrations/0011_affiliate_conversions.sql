-- Create affiliate_conversions table
create table if not exists public.affiliate_conversions (
  id uuid default gen_random_uuid() primary key,
  subid text not null unique,
  partner_id text not null,
  status text not null default 'approved',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Only allow public reading by subid (for polling), no inserts from client
alter table public.affiliate_conversions enable row level security;

create policy "Allow public to read by subid"
  on public.affiliate_conversions for select
  using (true);
