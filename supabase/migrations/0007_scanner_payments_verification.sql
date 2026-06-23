-- Scanner payments & email verification infrastructure
-- Handles €5 Stripe payments + email verification tokens for scanner access

-- =============================================================================
-- email_verifications: Temporary tokens for verifying email addresses
-- Used during scanner signup (both Stripe payment & Proton affiliate paths)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own verification tokens (for polling)
CREATE POLICY "email_verif_select_own" ON public.email_verifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_email_verifications_token ON public.email_verifications(token);
CREATE INDEX idx_email_verifications_user_id ON public.email_verifications(user_id);
CREATE INDEX idx_email_verifications_expires_at ON public.email_verifications(expires_at);

-- =============================================================================
-- scanner_payments: Stripe transaction log for €5 scanner purchases
-- Records each payment attempt for audit trail & refund handling
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.scanner_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_session_id TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 500,  -- €5 = 500 cents
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  refund_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.scanner_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment history
CREATE POLICY "scanner_payments_select_own" ON public.scanner_payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert (via Stripe webhook)
-- No user-facing update/insert policy — all changes via service_role

CREATE INDEX idx_scanner_payments_user_id ON public.scanner_payments(user_id);
CREATE INDEX idx_scanner_payments_stripe_intent ON public.scanner_payments(stripe_payment_intent_id);
CREATE INDEX idx_scanner_payments_status ON public.scanner_payments(status);

-- =============================================================================
-- scanner_scans: Results from inbox scans (persisted to user account)
-- Stores sovereignty reports, detected services, and scan metadata
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.scanner_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_id TEXT NOT NULL UNIQUE,  -- Lovable scanner result ID
  email TEXT NOT NULL,
  total_accounts_detected INTEGER NOT NULL DEFAULT 0,
  european_alternatives_available INTEGER NOT NULL DEFAULT 0,
  sovereignty_grade TEXT,  -- 'A', 'B', 'C', 'D'
  sovereignty_score INTEGER,  -- 0-100
  email_count INTEGER NOT NULL DEFAULT 0,  -- Messages sampled
  results JSONB NOT NULL DEFAULT '{}',  -- Full detected services list
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.scanner_scans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own scans
CREATE POLICY "scanner_scans_select_own" ON public.scanner_scans
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_scanner_scans_user_id ON public.scanner_scans(user_id);
CREATE INDEX idx_scanner_scans_created_at ON public.scanner_scans(created_at DESC);

-- =============================================================================
-- Extend auth.users with scanner metadata (via postgres.tables)
-- NOTE: In Supabase, auth.users is managed by Supabase Auth directly.
-- To track gmail_verified status, we use a separate table (below) rather
-- than adding columns to auth.users.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_scanner_metadata (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_verified BOOLEAN NOT NULL DEFAULT FALSE,
  gmail_address TEXT UNIQUE,  -- Verified Gmail address
  scanner_access_type TEXT CHECK (scanner_access_type IN ('free_proton', 'paid_stripe', NULL)),
  verified_at TIMESTAMPTZ,
  access_granted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_scanner_metadata ENABLE ROW LEVEL SECURITY;

-- Users can see & update their own metadata
CREATE POLICY "scanner_metadata_select_own" ON public.user_scanner_metadata
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "scanner_metadata_update_own" ON public.user_scanner_metadata
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_scanner_metadata_gmail ON public.user_scanner_metadata(gmail_address);
CREATE INDEX idx_user_scanner_metadata_verified ON public.user_scanner_metadata(gmail_verified);
