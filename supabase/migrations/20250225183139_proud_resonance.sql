/*
  # Update OTP Expiry Settings
  
  1. Changes
    - Set OTP expiry to 15 minutes for email provider
    - Add documentation comment
*/

-- Update OTP expiry settings for email provider
UPDATE auth.settings
SET otp_expiry = '15 minutes'
WHERE provider = 'email';

-- Add comment for documentation
COMMENT ON TABLE auth.settings IS 'Auth settings including OTP expiry of 15 minutes for email provider';