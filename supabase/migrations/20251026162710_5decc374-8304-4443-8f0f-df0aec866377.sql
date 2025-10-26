-- Fix critical security issue: Restrict profile visibility
-- Drop the insecure public policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);