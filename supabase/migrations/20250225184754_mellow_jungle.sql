-- Drop all existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS public.update_currency_rate_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.log_currency_rate_change CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_tokens CASCADE;
DROP FUNCTION IF EXISTS public.has_role CASCADE;
DROP FUNCTION IF EXISTS public.has_permission CASCADE;

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    SET search_path TO public;
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update_currency_rate_updated_at function
CREATE OR REPLACE FUNCTION public.update_currency_rate_updated_at()
RETURNS trigger AS $$
BEGIN
    SET search_path TO public;
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create log_currency_rate_change function
CREATE OR REPLACE FUNCTION public.log_currency_rate_change()
RETURNS trigger AS $$
BEGIN
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

-- Create cleanup_expired_tokens function
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    SET search_path TO public;
    DELETE FROM auth.mfa_factors
    WHERE updated_at < NOW() - INTERVAL '1 hour'
    AND factor_type = 'otp';
    
    DELETE FROM auth.identities
    WHERE updated_at < NOW() - INTERVAL '1 hour'
    AND provider = 'email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean AS $$
BEGIN
    SET search_path TO public;
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = has_role.user_id
        AND r.name = has_role.role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create has_permission function
CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, permission_name text)
RETURNS boolean AS $$
BEGIN
    SET search_path TO public;
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_id = ur.role_id
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = has_permission.user_id
        AND p.name = has_permission.permission_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add security comments
COMMENT ON FUNCTION public.update_updated_at_column IS 'Updates timestamp columns with secure search path';
COMMENT ON FUNCTION public.update_currency_rate_updated_at IS 'Updates currency rate timestamps with secure search path';
COMMENT ON FUNCTION public.log_currency_rate_change IS 'Logs currency rate changes with secure search path';
COMMENT ON FUNCTION public.cleanup_expired_tokens IS 'Cleanup function for expired OTP tokens (1 hour expiry)';
COMMENT ON FUNCTION public.has_role IS 'Checks if a user has a specific role';
COMMENT ON FUNCTION public.has_permission IS 'Checks if a user has a specific permission';

-- Recreate triggers
CREATE TRIGGER update_currency_rate_timestamp
    BEFORE UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_currency_rate_updated_at();

CREATE TRIGGER log_currency_rate_change
    AFTER UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION public.log_currency_rate_change();