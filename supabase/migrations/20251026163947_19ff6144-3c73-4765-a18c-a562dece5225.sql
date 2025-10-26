-- Attach gamification trigger to auth.users
CREATE TRIGGER on_auth_user_created_gamification
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_gamification();

-- Initialize gamification data for existing users who don't have it yet
INSERT INTO public.user_levels (user_id, level, current_xp, total_xp)
SELECT id, 1, 0, 0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_levels)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_login_date)
SELECT id, 1, 1, CURRENT_DATE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_streaks)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_stats (user_id)
SELECT id
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_stats)
ON CONFLICT (user_id) DO NOTHING;