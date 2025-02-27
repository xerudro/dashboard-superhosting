-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;

-- Recreate function with correct return type and security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    SET search_path TO public;  -- Set the search path to the public schema
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Update the updated_at column
    RETURN NEW;  -- Return the modified row
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Add security comment
COMMENT ON FUNCTION public.update_updated_at_column IS 'Updates timestamp columns with secure search path and invoker security';