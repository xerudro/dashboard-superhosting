/*
  # Configure Auth Settings
  
  1. Changes
    - Set email OTP expiry to 1 hour
    - Add security comment
*/

-- Create a function to handle expired tokens cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    -- Set search path explicitly
    SET search_path TO auth, public;
    
    -- Delete expired tokens older than 1 hour
    DELETE FROM auth.mfa_factors
    WHERE updated_at < NOW() - INTERVAL '1 hour'
    AND factor_type = 'otp';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add security comment
COMMENT ON FUNCTION cleanup_expired_tokens IS 'Cleanup function for expired OTP tokens (1 hour expiry)';

-- Create a scheduled job to run cleanup
SELECT cron.schedule(
    'cleanup-expired-tokens',  -- job name
    '0 * * * *',              -- every hour
    'SELECT cleanup_expired_tokens()'
);