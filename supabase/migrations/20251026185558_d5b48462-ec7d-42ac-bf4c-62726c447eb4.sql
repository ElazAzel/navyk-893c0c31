-- Phase 2: Social Features Migration (Fixed)

-- Extend profiles table for public profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private', 'friends_only')),
ADD COLUMN IF NOT EXISTS show_in_leaderboard boolean DEFAULT false;

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.leaderboard CASCADE;
DROP VIEW IF EXISTS public.leaderboard_secure CASCADE;

-- Create leaderboard view (secure - only shows users who opted in)
CREATE VIEW public.leaderboard_secure AS
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

-- Create insecure leaderboard view (for compatibility - includes anonymous_id)
CREATE VIEW public.leaderboard AS
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

-- Grant access to views
GRANT SELECT ON public.leaderboard_secure TO authenticated, anon;
GRANT SELECT ON public.leaderboard TO authenticated, anon;

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('course', 'event', 'job')),
  content_id uuid NOT NULL,
  comment_text text NOT NULL,
  parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('comment', 'course', 'event')),
  content_id uuid NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_likes_content ON public.likes(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

-- Drop old profile visibility policy if exists
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create new policy for public profile viewing
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (profile_visibility = 'public' OR auth.uid() = id);

-- Trigger for updating comments updated_at
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();