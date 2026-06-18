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
create policy "vault_select_own"
  on public.user_vault for select
  using (auth.uid() = user_id);

create policy "vault_insert_own"
  on public.user_vault for insert
  with check (auth.uid() = user_id);

create policy "vault_update_own"
  on public.user_vault for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "vault_delete_own"
  on public.user_vault for delete
  using (auth.uid() = user_id);

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

create policy "entitlements_select_own"
  on public.entitlements for select
  using (auth.uid() = user_id);
