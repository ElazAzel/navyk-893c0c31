-- Fix security issues - handle existing objects

-- 1. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own booking payments" ON public.booking_payments;
DROP POLICY IF EXISTS "Mentors can see payment status" ON public.booking_payments;

-- Recreate with correct permissions
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

-- 2. Update profiles RLS to protect sensitive contact information
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Users can always see their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Public profiles viewable but application must filter sensitive fields
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (profile_visibility = 'public' OR auth.uid() = id);