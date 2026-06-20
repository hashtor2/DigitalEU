-- Trigger to automatically create a user_vault entry for new users.
-- This solves the RLS issue where a new user can't insert their own vault
-- because the policy requires a row to exist already.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert a new row into public.user_vault for the new user
  insert into public.user_vault (user_id, ciphertext)
  values (new.id, ''); -- Start with an empty ciphertext
  return new;
end;
$$;

-- Drop the trigger if it already exists to ensure a clean setup
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger to fire after a new user is inserted into auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Grant usage on the function to the necessary role
grant execute on function public.handle_new_user() to postgres, anon, authenticated, service_role;
