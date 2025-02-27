/*
  # Fix Auth OTP Expiry Time

  1. Changes
    - Set email OTP expiry to 1 hour (3600 seconds)
    - Update auth.email configuration
*/

-- Update auth.email configuration to set OTP expiry to 1 hour
ALTER TABLE auth.flow_state
ALTER COLUMN expires_at
SET DEFAULT (now() + interval '1 hour');

-- Update existing auth configuration
UPDATE auth.config
SET value = jsonb_set(
  value,
  '{email,otp_expiry_seconds}',
  '3600'::jsonb
)
WHERE value ? 'email';