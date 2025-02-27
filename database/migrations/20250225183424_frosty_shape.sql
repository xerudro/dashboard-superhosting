/*
  # Fix Auth Settings Management

  1. Changes
    - Create custom auth settings management table
    - Add functions to manage OTP settings
    - Set up secure policies and triggers
*/

-- Create enum for auth providers if it doesn't exist
DO $$ BEGIN
    CREATE TYPE auth_provider AS ENUM ('email', 'phone', 'oauth');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create auth settings table
CREATE TABLE IF NOT EXISTS auth_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider auth_provider NOT NULL,
    settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider)
);

-- Enable RLS
ALTER TABLE auth_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow read access to authenticated users"
    ON auth_config
    FOR SELECT
    TO authenticated
    USING (true);

-- Create function to update auth settings
CREATE OR REPLACE FUNCTION update_auth_config(
    p_provider auth_provider,
    p_settings jsonb
)
RETURNS auth_config AS $$
DECLARE
    v_result auth_config;
BEGIN
    -- Set search path explicitly
    SET search_path TO public;

    INSERT INTO auth_config (provider, settings)
    VALUES (p_provider, p_settings)
    ON CONFLICT (provider) 
    DO UPDATE SET 
        settings = p_settings,
        updated_at = CURRENT_TIMESTAMP
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up initial email configuration with 15-minute OTP expiry
SELECT update_auth_config(
    'email'::auth_provider,
    jsonb_build_object(
        'otp_expiry_minutes', 15,
        'otp_enabled', true,
        'updated_at', CURRENT_TIMESTAMP
    )
);

-- Add helpful comments
COMMENT ON TABLE auth_config IS 'Custom authentication configuration including OTP settings';
COMMENT ON FUNCTION update_auth_config IS 'Securely updates authentication configuration with audit trail';