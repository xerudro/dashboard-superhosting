/*
  # Create Superadmin Account

  1. Creates the superadmin user if it doesn't exist
  2. Assigns superadmin role and permissions
  3. Creates profile for the superadmin
*/

-- Create the superadmin user if it doesn't exist
DO $$
DECLARE
  v_user_id uuid;
  v_superadmin_role_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'admin@superhosting.vip';

  -- If user doesn't exist, create it
  IF v_user_id IS NULL THEN
    -- Insert user into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@superhosting.vip',
      crypt('A1g*#GuTc1XNheafpv@R', gen_salt('bf')),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "superadmin", "name": "Super Admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO v_user_id;

    -- Get superadmin role id
    SELECT id INTO v_superadmin_role_id
    FROM roles
    WHERE name = 'superadmin';

    -- Assign superadmin role
    INSERT INTO user_roles (user_id, role_id)
    VALUES (v_user_id, v_superadmin_role_id);

    -- Create profile
    INSERT INTO profiles (id, name, created_at, updated_at)
    VALUES (v_user_id, 'Super Admin', NOW(), NOW());
  END IF;
END;
$$ LANGUAGE plpgsql;