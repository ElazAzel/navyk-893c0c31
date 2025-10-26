-- Fix handle_new_user_gamification to handle duplicate keys gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user_gamification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Initialize user level (ignore if already exists)
  INSERT INTO public.user_levels (user_id, level, current_xp, total_xp)
  VALUES (NEW.id, 1, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize user streak (ignore if already exists)
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_login_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize user stats (ignore if already exists)
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;