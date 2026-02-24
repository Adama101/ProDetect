-- Allow anyone to sign up: ensure one profile per user and allow client to create/update profile
-- (Trigger may already create a row; client upsert handles both cases.)

-- One profile per user (required for upsert); skip if already exists (e.g. re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Allow users to insert their own profile (so sign-up works with RLS)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
