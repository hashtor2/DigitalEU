-- digitaleu.me — B2B-kontakthenvendelser
-- Åpen INSERT (anonym), ingen SELECT-policy → kun lesbar via service_role.

create table if not exists public.contact_leads (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  company    text,
  email      text        not null,
  phone      text,
  message    text,
  source     text        not null default 'b2b',
  created_at timestamptz not null default now()
);

alter table public.contact_leads enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_leads'
      AND policyname = 'contact_leads_insert_anon'
  ) THEN
    EXECUTE 'CREATE POLICY "contact_leads_insert_anon" ON public.contact_leads FOR INSERT WITH CHECK (true)';
  END IF;
END
$$;
