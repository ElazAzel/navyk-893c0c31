-- Fix search_path for cleanup function
DROP FUNCTION IF EXISTS public.cleanup_expired_verification_codes();

CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.telegram_verification_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - interval '1 day');
END;
$$;