/*
  # Configure Auth Settings
  
  1. Changes
    - Set email OTP expiry to 1 hour using auth.config()
    - Clean up any expired tokens
*/

-- Use auth.config() to update settings
SELECT auth.config('mailer', jsonb_build_object(
  'site_url', current_setting('app.settings.site_url', true),
  'otp_expiry_seconds', 3600
));

-- Clean up expired tokens
DELETE FROM auth.users
WHERE confirmation_token IS NOT NULL
AND confirmation_token_sent_at < NOW() - INTERVAL '1 hour';

-- Add comment for documentation
COMMENT ON SCHEMA auth IS 'Auth schema with OTP expiry set to 1 hour';