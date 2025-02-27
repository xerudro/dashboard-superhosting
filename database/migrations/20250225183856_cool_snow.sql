/*
  # Update Currency Rate Functions

  1. Changes
    - Drop and recreate currency rate functions with proper security settings
    - Set explicit search paths
    - Add security definer
    - Update function comments
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS public.update_currency_rate_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.log_currency_rate_change CASCADE;

-- Recreate update_currency_rate_updated_at with proper security
CREATE OR REPLACE FUNCTION public.update_currency_rate_updated_at()
RETURNS trigger AS $$
BEGIN
    -- Set search path explicitly for security
    SET search_path TO public;
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate log_currency_rate_change with proper security
CREATE OR REPLACE FUNCTION public.log_currency_rate_change()
RETURNS trigger AS $$
BEGIN
    -- Set search path explicitly for security
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
CREATE TRIGGER update_currency_rate_timestamp
    BEFORE UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_currency_rate_updated_at();

CREATE TRIGGER log_currency_rate_change
    AFTER UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION public.log_currency_rate_change();

-- Add security comments
COMMENT ON FUNCTION public.update_currency_rate_updated_at IS 'Updates currency rate timestamps with secure search path';
COMMENT ON FUNCTION public.log_currency_rate_change IS 'Logs currency rate changes with secure search path';