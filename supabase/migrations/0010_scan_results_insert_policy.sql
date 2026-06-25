-- Allow authenticated users to insert scan_results for their own scans
-- and update scan status on their own scan rows.

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'scan_results' and policyname = 'Users can insert scan results for their scans'
  ) then
    create policy "Users can insert scan results for their scans"
      on scan_results for insert
      with check (
        exists (
          select 1 from scans
          where scans.id = scan_results.scan_id
            and scans.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'scans' and policyname = 'Users can update their own scans'
  ) then
    create policy "Users can update their own scans"
      on scans for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
