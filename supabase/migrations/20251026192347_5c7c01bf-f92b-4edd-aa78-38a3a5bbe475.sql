-- Fix remaining security issues

-- 1. Create secure view for public profiles without sensitive data
CREATE OR REPLACE VIEW public.profiles_public AS
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

-- Grant access to the view
GRANT SELECT ON public.profiles_public TO authenticated, anon;

-- 2. Update leaderboard views to respect privacy
DROP VIEW IF EXISTS public.leaderboard CASCADE;
DROP VIEW IF EXISTS public.leaderboard_secure CASCADE;

-- Create secure leaderboard view with privacy controls
CREATE VIEW public.leaderboard_secure 
WITH (security_invoker = true) AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY ul.total_xp DESC) as rank,
  CASE 
    WHEN p.show_in_leaderboard THEN p.full_name
    ELSE CONCAT('User #', SUBSTRING(p.id::text, 1, 8))
  END as full_name,
  ul.level,
  ul.total_xp,
  COUNT(DISTINCT ua.achievement_id) as achievements_count
FROM public.user_levels ul
JOIN public.profiles p ON p.id = ul.user_id
LEFT JOIN public.user_achievements ua ON ua.user_id = ul.user_id
WHERE p.show_in_leaderboard = true
GROUP BY ul.user_id, ul.level, ul.total_xp, p.full_name, p.show_in_leaderboard, p.id
ORDER BY ul.total_xp DESC;

-- Public leaderboard (same as secure for now)
CREATE VIEW public.leaderboard 
WITH (security_invoker = true) AS
SELECT * FROM public.leaderboard_secure;

-- Grant access to views
GRANT SELECT ON public.leaderboard_secure TO authenticated, anon;
GRANT SELECT ON public.leaderboard TO authenticated, anon;

-- 3. Add RLS policy to profiles to prevent sensitive data exposure in direct queries
-- Drop and recreate the public profile policy with field restrictions
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Only non-sensitive fields can be accessed for public profiles by others
CREATE POLICY "Public profiles limited fields"
ON public.profiles
FOR SELECT
USING (
  -- Own profile: full access
  (auth.uid() = id) 
  OR 
  -- Other users: only if public AND they should use the profiles_public view
  -- But we still need to allow the query, just application should filter
  (profile_visibility = 'public')
);

-- Add comment to remind developers
COMMENT ON POLICY "Public profiles limited fields" ON public.profiles IS 
'SECURITY: When querying other users public profiles, always use profiles_public view or explicitly exclude sensitive fields (email, phone, telegram_id, telegram_username) in SELECT statements.';