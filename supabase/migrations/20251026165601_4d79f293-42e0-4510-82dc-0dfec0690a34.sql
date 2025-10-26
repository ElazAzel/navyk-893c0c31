-- CRITICAL: Prevent users from creating their own credits/subscriptions/stats
-- These should only be created by system triggers

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can insert own credits" ON public.ai_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.ai_credits;
DROP POLICY IF EXISTS "Users can view own credits" ON public.ai_credits;

DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

DROP POLICY IF EXISTS "Users can insert own level" ON public.user_levels;
DROP POLICY IF EXISTS "Users can update own level" ON public.user_levels;
DROP POLICY IF EXISTS "Users can view own level" ON public.user_levels;

DROP POLICY IF EXISTS "Users can insert own streak" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update own streak" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can view own streak" ON public.user_streaks;

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;

-- Create READ-ONLY policies for critical tables
CREATE POLICY "Users can view own credits" ON public.ai_credits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own level" ON public.user_levels
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streak" ON public.user_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create secure functions for controlled updates
CREATE OR REPLACE FUNCTION public.add_xp_to_user(
  _user_id uuid,
  _xp_amount integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_xp integer;
  _current_level integer;
  _new_xp integer;
  _new_level integer;
BEGIN
  SELECT current_xp, level INTO _current_xp, _current_level
  FROM user_levels
  WHERE user_id = _user_id;
  
  _new_xp := _current_xp + _xp_amount;
  _new_level := _current_level;
  
  WHILE _new_xp >= (_new_level * 100) LOOP
    _new_xp := _new_xp - (_new_level * 100);
    _new_level := _new_level + 1;
  END LOOP;
  
  UPDATE user_levels
  SET 
    current_xp = _new_xp,
    level = _new_level,
    total_xp = total_xp + _xp_amount
  WHERE user_id = _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.deduct_credits(
  _user_id uuid,
  _amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_credits integer;
BEGIN
  SELECT credits_remaining INTO _current_credits
  FROM ai_credits
  WHERE user_id = _user_id;
  
  IF _current_credits < _amount THEN
    RETURN false;
  END IF;
  
  UPDATE ai_credits
  SET credits_remaining = credits_remaining - _amount
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_credits(
  _user_id uuid,
  _amount integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE ai_credits
  SET 
    credits_remaining = credits_remaining + _amount,
    credits_total = credits_total + _amount
  WHERE user_id = _user_id;
END;
$$;