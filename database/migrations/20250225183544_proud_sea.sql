/*
  # Secure Token Cleanup Function

  1. Changes
    - Create secure cleanup function for expired tokens
    - Set explicit search path
    - Add security definer
    - Add proper comments and grants
*/

-- Create a function to handle expired tokens cleanup
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    SET search_path TO public;  -- Set the search path to the public schema
    
    -- Delete expired MFA factors older than 1 hour
    DELETE FROM auth.mfa_factors
    WHERE updated_at < NOW() - INTERVAL '1 hour'
    AND factor_type = 'otp';
    
    -- Delete expired identities older than 1 hour
    DELETE FROM auth.identities
    WHERE updated_at < NOW() - INTERVAL '1 hour'
    AND provider = 'email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add security comment
COMMENT ON FUNCTION public.cleanup_expired_tokens IS 'Cleanup function for expired OTP tokens (1 hour expiry)';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cleanup_expired_tokens TO authenticated;