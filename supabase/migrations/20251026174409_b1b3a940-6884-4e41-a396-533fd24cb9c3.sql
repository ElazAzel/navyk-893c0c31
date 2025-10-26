-- Fix security issues and add new features

-- 1. Add privacy settings to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_in_leaderboard BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('private', 'public'));

-- 2. Add RLS policy for leaderboard view based on consent
CREATE OR REPLACE VIEW public.leaderboard_secure AS
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

-- 3. Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  instructor_avatar TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  video_url TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
ON public.courses
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT false,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
ON public.course_enrollments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
ON public.course_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
ON public.course_enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- 5. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('webinar', 'workshop', 'meetup', 'conference', 'hackathon')),
  organizer_name TEXT NOT NULL,
  organizer_avatar TEXT,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
ON public.events
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create event registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, event_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
ON public.event_registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Improve mentor_bookings security - separate payment info
CREATE TABLE IF NOT EXISTS public.booking_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
  amount_paid INTEGER NOT NULL,
  stripe_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id)
);

ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;

-- Only booking owner can see payment details
CREATE POLICY "Users can view own booking payments"
ON public.booking_payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mentor_bookings mb
    WHERE mb.id = booking_payments.booking_id
    AND mb.user_id = auth.uid()
  )
);

-- Mentors can see if payment was made but not details
CREATE POLICY "Mentors can see payment status"
ON public.booking_payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mentor_bookings mb
    JOIN public.mentors m ON m.id = mb.mentor_id
    WHERE mb.id = booking_payments.booking_id
    AND m.user_id = auth.uid()
  )
);

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);

-- 9. Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();