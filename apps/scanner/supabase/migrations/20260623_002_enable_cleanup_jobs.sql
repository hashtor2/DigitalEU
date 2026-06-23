-- Enable pg_cron extension
create extension if not exists "pg_cron" with schema extensions;

-- Schedule a job to soft-delete scans older than 30 days
select cron.schedule(
  'delete-old-scans-30-days',
  '0 2 * * *', -- 2 AM UTC daily
  'update scans set deleted_at = now() where deleted_at is null and created_at < now() - interval ''30 days'''
);

-- Hard-delete soft-deleted scans older than 90 days (if needed)
select cron.schedule(
  'hard-delete-old-scans-90-days',
  '0 3 * * *', -- 3 AM UTC daily
  'delete from scans where deleted_at is not null and deleted_at < now() - interval ''90 days'''
);
