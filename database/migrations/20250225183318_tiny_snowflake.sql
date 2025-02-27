/*
  # Fix Function Search Paths

  1. Changes
    - Update log_currency_rate_change function with explicit search path
    - Update update_updated_at_column function with explicit search path
    - Update update_auth_settings_updated_at function with explicit search path
*/

-- Update log_currency_rate_change function with explicit search path
CREATE OR REPLACE FUNCTION public.log_currency_rate_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Set search path explicitly to public schema
  SET search_path TO public;
  
  IF OLD.rate != NEW.rate THEN
    INSERT INTO currency_rate_history (
      rate_id,
      old_rate,
      new_rate,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.rate,
      NEW.rate,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Update update_updated_at_column function with explicit search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set search path explicitly to public schema
  SET search_path TO public;
  
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Update update_auth_settings_updated_at function with explicit search path
CREATE OR REPLACE FUNCTION public.update_auth_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set search path explicitly to public schema
  SET search_path TO public;
  
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Add security comments
COMMENT ON FUNCTION public.log_currency_rate_change IS 'Logs currency rate changes with secure search path';
COMMENT ON FUNCTION public.update_updated_at_column IS 'Updates timestamp columns with secure search path';
COMMENT ON FUNCTION public.update_auth_settings_updated_at IS 'Updates auth settings timestamp with secure search path';