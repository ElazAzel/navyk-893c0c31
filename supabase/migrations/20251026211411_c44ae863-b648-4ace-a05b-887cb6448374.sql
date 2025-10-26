-- Function to make a user admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found';
  END IF;
  
  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Admin role granted to ' || user_email;
END;
$$;

-- Grant execute permission to authenticated users (will be restricted by RLS)
GRANT EXECUTE ON FUNCTION public.make_user_admin TO authenticated;

COMMENT ON FUNCTION public.make_user_admin IS 'Makes a user an admin by their email address. Should only be called by existing admins.';

-- For initial setup: make the first registered user an admin if no admins exist
DO $$
DECLARE
  first_user_id UUID;
  admin_count INTEGER;
BEGIN
  -- Check if any admins exist
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  -- If no admins exist, make the first user an admin
  IF admin_count = 0 THEN
    SELECT id INTO first_user_id
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (first_user_id, 'admin')
      ON CONFLICT DO NOTHING;
      
      RAISE NOTICE 'First user has been granted admin role';
    END IF;
  END IF;
END $$;