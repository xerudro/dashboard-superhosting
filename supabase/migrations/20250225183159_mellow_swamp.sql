/*
  # Update Auth Settings
  
  1. Changes
    - Create custom auth settings table for tracking OTP configuration
    - Add initial configuration for 15-minute OTP expiry
*/

-- Create a table to store custom auth settings if it doesn't exist
CREATE TABLE IF NOT EXISTS auth_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
CREATE POLICY "Allow read access to authenticated users"
  ON auth_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert or update email provider settings
INSERT INTO auth_settings (provider, settings)
VALUES (
  'email',
  jsonb_build_object(
    'otp_expiry', '15 minutes',
    'otp_enabled', true
  )
)
ON CONFLICT (provider) 
DO UPDATE SET 
  settings = jsonb_build_object(
    'otp_expiry', '15 minutes',
    'otp_enabled', true
  ),
  updated_at = CURRENT_TIMESTAMP;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_auth_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auth_settings_timestamp
  BEFORE UPDATE ON auth_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_auth_settings_updated_at();

-- Add helpful comment
COMMENT ON TABLE auth_settings IS 'Custom auth settings including OTP configuration';