-- Gamification System for NAVYK

-- User levels and XP
CREATE TABLE public.user_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  credits_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Daily quests
CREATE TABLE public.daily_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  credits_reward INTEGER NOT NULL DEFAULT 0,
  required_count INTEGER NOT NULL DEFAULT 1,
  quest_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User daily progress
CREATE TABLE public.user_daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.daily_quests(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, quest_id, quest_date)
);

-- Login streaks
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats for leaderboard
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  ai_sessions_count INTEGER NOT NULL DEFAULT 0,
  resumes_count INTEGER NOT NULL DEFAULT 0,
  jobs_applied_count INTEGER NOT NULL DEFAULT 0,
  mentor_sessions_count INTEGER NOT NULL DEFAULT 0,
  achievements_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own level" ON public.user_levels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own level" ON public.user_levels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view daily quests" ON public.daily_quests
  FOR SELECT USING (true);

CREATE POLICY "Users can view own progress" ON public.user_daily_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" ON public.user_daily_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_daily_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streak" ON public.user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON public.user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view stats for leaderboard" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_user_levels_updated_at
  BEFORE UPDATE ON public.user_levels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_daily_progress_updated_at
  BEFORE UPDATE ON public.user_daily_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user gamification setup
CREATE OR REPLACE FUNCTION public.handle_new_user_gamification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Initialize user level
  INSERT INTO public.user_levels (user_id, level, current_xp, total_xp)
  VALUES (NEW.id, 1, 0, 0);
  
  -- Initialize user streak
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_login_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE);
  
  -- Initialize user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user gamification
CREATE TRIGGER on_user_created_gamification
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_gamification();

-- Indexes
CREATE INDEX idx_user_levels_user_id ON public.user_levels(user_id);
CREATE INDEX idx_user_levels_level ON public.user_levels(level);
CREATE INDEX idx_user_levels_total_xp ON public.user_levels(total_xp DESC);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_daily_progress_user_id ON public.user_daily_progress(user_id);
CREATE INDEX idx_user_daily_progress_date ON public.user_daily_progress(quest_date);
CREATE INDEX idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX idx_user_stats_total_xp ON public.user_stats(user_id);

-- Insert default achievements
INSERT INTO public.achievements (code, name, description, category, icon, xp_reward, credits_reward) VALUES
  ('first_step', 'Первый шаг', 'Создайте первое резюме', 'career', '📝', 100, 2),
  ('active_search', 'Активный поиск', 'Откликнитесь на 10 вакансий', 'career', '🎯', 200, 5),
  ('chat_master', 'Мастер общения', 'Проведите 50 AI сессий', 'learning', '💬', 300, 10),
  ('networker', 'Сетевик', 'Забронируйте 5 сессий с менторами', 'social', '🤝', 250, 5),
  ('student', 'Ученик', 'Пройдите 10 AI консультаций', 'learning', '📚', 150, 3),
  ('early_bird', 'Ранняя пташка', 'Заходите 7 дней подряд', 'special', '🌅', 200, 5),
  ('marathoner', 'Марафонец', 'Используйте платформу 30 дней', 'special', '🏃', 500, 15),
  ('first_resume', 'Первое резюме', 'Создайте свое первое резюме', 'career', '✨', 50, 1),
  ('resume_expert', 'Эксперт резюме', 'Создайте 5 резюме', 'career', '📄', 250, 5),
  ('job_hunter', 'Охотник за работой', 'Откликнитесь на первую вакансию', 'career', '🎪', 50, 1);

-- Insert default daily quests
INSERT INTO public.daily_quests (code, name, description, xp_reward, credits_reward, required_count, quest_type) VALUES
  ('daily_chat', 'Пообщайтесь с AI Coach', 'Проведите хотя бы одну сессию с AI', 20, 1, 1, 'ai_session'),
  ('daily_resume', 'Обновите резюме', 'Внесите изменения в своё резюме', 30, 1, 1, 'resume_update'),
  ('daily_jobs', 'Поиск вакансий', 'Откликнитесь на 3 вакансии', 50, 2, 3, 'job_apply'),
  ('daily_login', 'Ежедневный вход', 'Войдите в приложение', 10, 0, 1, 'login');