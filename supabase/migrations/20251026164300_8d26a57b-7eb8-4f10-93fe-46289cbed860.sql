-- Recreate leaderboard view with SECURITY INVOKER (not DEFINER)
DROP VIEW IF EXISTS public.leaderboard;

CREATE VIEW public.leaderboard 
WITH (security_invoker = true) AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY 
    (us.achievements_count * 100 + 
     us.ai_sessions_count * 10 + 
     us.jobs_applied_count * 5 + 
     us.mentor_sessions_count * 20 + 
     us.resumes_count * 15) DESC
  ) as rank,
  CONCAT('User #', SUBSTRING(md5(us.user_id::text), 1, 8)) as anonymous_id,
  p.full_name,
  us.achievements_count,
  ul.level,
  ul.total_xp,
  (us.achievements_count * 100 + 
   us.ai_sessions_count * 10 + 
   us.jobs_applied_count * 5 + 
   us.mentor_sessions_count * 20 + 
   us.resumes_count * 15) as total_score
FROM public.user_stats us
JOIN public.user_levels ul ON us.user_id = ul.user_id
LEFT JOIN public.profiles p ON us.user_id = p.id
WHERE ul.total_xp > 0
ORDER BY total_score DESC
LIMIT 100;

-- Grant access to the view
GRANT SELECT ON public.leaderboard TO anon, authenticated;