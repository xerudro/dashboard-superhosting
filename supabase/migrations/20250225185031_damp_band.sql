/*
  # Currency Rates Update
  
  This migration ensures currency rates exist and adds proper indexes.
  
  1. Changes
    - Ensures all currency pairs exist
    - Adds proper indexes for performance
    - Updates existing rates with current values
    
  2. Security
    - Maintains RLS policies
    - Adds proper constraints
*/

-- First ensure the currency_rates table exists
CREATE TABLE IF NOT EXISTS currency_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate decimal(20,10) NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_by uuid REFERENCES auth.users,
  updated_by uuid REFERENCES auth.users,
  UNIQUE(from_currency, to_currency)
);

-- Ensure RLS is enabled
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

-- Create or replace the currency rate policies
CREATE POLICY "Currency rates are readable by all users"
  ON currency_rates
  FOR SELECT
  TO public
  USING (true);

-- Insert or update currency rates
INSERT INTO currency_rates (from_currency, to_currency, rate) VALUES
  ('EUR', 'USD', 1.0850),
  ('EUR', 'RON', 4.9750),
  ('USD', 'EUR', 0.9217),
  ('USD', 'RON', 4.5850),
  ('RON', 'EUR', 0.2010),
  ('RON', 'USD', 0.2181)
ON CONFLICT (from_currency, to_currency) 
DO UPDATE SET 
  rate = EXCLUDED.rate,
  updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_currency_rates_from_to ON currency_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_currency_rates_updated_at ON currency_rates(updated_at);

-- Add helpful comments
COMMENT ON TABLE currency_rates IS 'Currency exchange rates with automatic updates';
COMMENT ON COLUMN currency_rates.rate IS 'Exchange rate from source to target currency';