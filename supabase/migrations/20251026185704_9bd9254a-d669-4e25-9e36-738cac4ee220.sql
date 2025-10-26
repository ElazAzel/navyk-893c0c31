-- Fix Security Definer Views issue

-- Alter leaderboard_secure view to use SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard_secure CASCADE;
CREATE VIEW public.leaderboard_secure
WITH (security_invoker = true)
AS
SELECT 
  p.full_name,
  ul.level,
  ul.total_xp,
  us.achievements_count,
  ROW_NUMBER() OVER (ORDER BY ul.total_xp DESC, ul.level DESC) as rank
FROM public.profiles p
JOIN public.user_levels ul ON p.id = ul.user_id
JOIN public.user_stats us ON p.id = us.user_id
WHERE p.show_in_leaderboard = true
ORDER BY ul.total_xp DESC, ul.level DESC
LIMIT 100;

-- Alter leaderboard view to use SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard CASCADE;
CREATE VIEW public.leaderboard
WITH (security_invoker = true)
AS
SELECT 
  p.full_name,
  ul.level,
  ul.total_xp,
  us.achievements_count,
  CASE 
    WHEN p.show_in_leaderboard = false THEN CONCAT('User#', SUBSTRING(p.id::text, 1, 8))
    ELSE NULL
  END as anonymous_id,
  ul.total_xp + (ul.level * 100) as total_score,
  ROW_NUMBER() OVER (ORDER BY ul.total_xp DESC, ul.level DESC) as rank
FROM public.profiles p
JOIN public.user_levels ul ON p.id = ul.user_id
JOIN public.user_stats us ON p.id = us.user_id
ORDER BY ul.total_xp DESC, ul.level DESC
LIMIT 100;

-- Re-grant access to views
GRANT SELECT ON public.leaderboard_secure TO authenticated, anon;
GRANT SELECT ON public.leaderboard TO authenticated, anon;