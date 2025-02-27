/*
  # Configure Auth OTP Expiry Time

  1. Changes
    - Set email OTP expiry to 1 hour (3600 seconds)
    - Update auth settings through proper configuration
*/

-- Update auth settings to set OTP expiry to 1 hour
UPDATE auth.config
SET value = jsonb_set(
  COALESCE(value, '{}'::jsonb),
  '{auth, email, otp_ttl}',
  '3600'::jsonb,
  true
);

-- Ensure any existing OTP tokens expire in 1 hour
UPDATE auth.users
SET confirmation_token_sent_at = NULL
WHERE confirmation_token_sent_at < NOW() - INTERVAL '1 hour';

-- Add a comment to document the change
COMMENT ON TABLE auth.config IS 'Auth configuration including OTP expiry set to 1 hour';