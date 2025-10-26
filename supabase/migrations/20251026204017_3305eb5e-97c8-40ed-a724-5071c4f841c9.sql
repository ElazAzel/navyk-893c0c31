-- Fix security definer views and enhance profile protection

-- 1. Recreate profiles_public view with security_invoker
DROP VIEW IF EXISTS public.profiles_public CASCADE;

CREATE VIEW public.profiles_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  full_name,
  avatar_url,
  location,
  bio,
  profile_visibility,
  show_in_leaderboard,
  created_at
FROM public.profiles
WHERE profile_visibility = 'public';

-- Grant access
GRANT SELECT ON public.profiles_public TO authenticated, anon;

-- 2. Add helper function to safely get public profile
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  location text,
  bio text,
  profile_visibility text,
  show_in_leaderboard boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    full_name,
    avatar_url,
    location,
    bio,
    profile_visibility,
    show_in_leaderboard,
    created_at
  FROM public.profiles
  WHERE id = profile_id 
    AND profile_visibility = 'public';
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;

COMMENT ON FUNCTION public.get_public_profile IS 
'Safely retrieves public profile data without exposing sensitive fields like email, phone, or telegram credentials.';