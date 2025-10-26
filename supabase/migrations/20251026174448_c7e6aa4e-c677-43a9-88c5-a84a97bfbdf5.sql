-- Fix security definer view issue
DROP VIEW IF EXISTS public.leaderboard_secure;

-- Create view without security definer
CREATE VIEW public.leaderboard_secure AS
SELECT 
  CASE 
    WHEN p.show_in_leaderboard THEN p.full_name
    ELSE 'Анонимный пользователь'
  END as full_name,
  ul.level,
  ul.total_xp,
  us.achievements_count,
  ROW_NUMBER() OVER (ORDER BY ul.total_xp DESC) as rank
FROM public.user_levels ul
JOIN public.profiles p ON p.id = ul.user_id
JOIN public.user_stats us ON us.user_id = ul.user_id
WHERE p.show_in_leaderboard = true
ORDER BY ul.total_xp DESC;