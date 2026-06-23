-- Early-access waitlist for the automatic Gmail inbox scanner (manual-MVP).
--
-- Flyt: pending (meldt på) → paid (betalt €5 via Stripe) → active (skanner åpnet).
-- Founder driver statusovergangene manuelt fra denne tabellen inntil Stripe-
-- webhook er på plass. Skanneren gater ekte skann på status = 'active' for
-- den innloggede Gmail-adressen (Google-OAuth allowlist).
CREATE TABLE early_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'active', 'declined')),
  stripe_ref TEXT,                 -- Stripe checkout/payment-id, settes ved betaling
  granted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kun Gmail/Googlemail i beta — håndheves i DB i tillegg til klient + Edge Function.
ALTER TABLE early_access
  ADD CONSTRAINT early_access_gmail_only
  CHECK (email ~* '^[^@\s]+@(gmail|googlemail)\.com$');

-- Enable RLS
ALTER TABLE early_access ENABLE ROW LEVEL SECURITY;

-- Offentlig innsending tillatt (påmelding krever ingen auth).
-- All faktisk skriving skjer via service-role i Edge Function, men vi holder
-- policyen smal: kun INSERT, aldri lesing fra klienten.
CREATE POLICY "Allow public insert" ON early_access
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public read" ON early_access
  FOR SELECT USING (false);

-- Indekser
CREATE INDEX idx_early_access_email ON early_access(email);
CREATE INDEX idx_early_access_status ON early_access(status);
CREATE INDEX idx_early_access_created_at ON early_access(created_at DESC);
