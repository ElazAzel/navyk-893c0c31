-- Drop and recreate leaderboard_secure view with SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard_secure;

CREATE VIEW public.leaderboard_secure
WITH (security_invoker=true)
AS
SELECT
    CASE
        WHEN p.show_in_leaderboard THEN p.full_name
        ELSE 'Анонимный пользователь'::text
    END AS full_name,
    ul.level,
    ul.total_xp,
    us.achievements_count,
    row_number() OVER (ORDER BY ul.total_xp DESC) AS rank
FROM user_levels ul
JOIN profiles p ON p.id = ul.user_id
JOIN user_stats us ON us.user_id = ul.user_id
WHERE p.show_in_leaderboard = true
ORDER BY ul.total_xp DESC;