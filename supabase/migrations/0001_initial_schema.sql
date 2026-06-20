-- digitaleu.me — initialt skjema (Profilmodus)
-- Sikkerhetsprinsipper: zero-knowledge lagring + Row Level Security på alt.
-- Se docs/SECURITY.md §4 og §8.

-- =============================================================================
-- user_vault: ÉN kryptert blob per bruker.
-- Inneholder all brukerens migreringsfremgang, KRYPTERT klientside (AES-GCM).
-- Serveren ser kun chiffertekst og kan aldri dekryptere (zero-knowledge).
-- =============================================================================
create table if not exists public.user_vault (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  ciphertext  text not null,                 -- base64 "envelope" fra crypto.ts
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

alter table public.user_vault enable row level security;

-- En bruker kan kun se og endre SIN EGEN rad.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_vault'
      AND policyname = 'vault_select_own'
  ) THEN
    EXECUTE 'CREATE POLICY "vault_select_own" ON public.user_vault FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_vault'
      AND policyname = 'vault_insert_own'
  ) THEN
    EXECUTE 'CREATE POLICY "vault_insert_own" ON public.user_vault FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_vault'
      AND policyname = 'vault_update_own'
  ) THEN
    EXECUTE 'CREATE POLICY "vault_update_own" ON public.user_vault FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_vault'
      AND policyname = 'vault_delete_own'
  ) THEN
    EXECUTE 'CREATE POLICY "vault_delete_own" ON public.user_vault FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END
$$;

-- Hold updated_at oppdatert automatisk.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists user_vault_set_updated_at on public.user_vault;
create trigger user_vault_set_updated_at
  before update on public.user_vault
  for each row execute function public.set_updated_at();

-- =============================================================================
-- entitlements: tilgangsstatus (betalt eller via affiliate).
-- IKKE kryptert — vi må kunne verifisere tilgang server-side. Men dette er
-- ikke privat innhold. Brukeren kan LESE sin egen rad; skriving skjer KUN
-- server-side med service_role (etter Stripe-webhook / affiliate-verifisering),
-- aldri fra klienten. Derfor finnes ingen insert/update-policy for vanlige
-- brukere — RLS blokkerer dem implisitt.
-- =============================================================================
create table if not exists public.entitlements (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  access_type      text not null check (access_type in ('paid', 'affiliate')),
  stripe_session_id text,
  partner_id       text,
  created_at       timestamptz not null default now()
);

alter table public.entitlements enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'entitlements'
      AND policyname = 'entitlements_select_own'
  ) THEN
    EXECUTE 'CREATE POLICY "entitlements_select_own" ON public.entitlements FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END
$$;
