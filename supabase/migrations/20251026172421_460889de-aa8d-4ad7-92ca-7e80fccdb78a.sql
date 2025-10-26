-- Add Telegram and other auth methods to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE,
ADD COLUMN IF NOT EXISTS telegram_username TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS google_connected BOOLEAN DEFAULT FALSE;

-- Create verification codes table
CREATE TABLE IF NOT EXISTS public.telegram_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only (codes are sensitive)
CREATE POLICY "Service role can manage verification codes"
ON public.telegram_verification_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_telegram_verification_codes_telegram_id 
ON public.telegram_verification_codes(telegram_id);

CREATE INDEX IF NOT EXISTS idx_telegram_verification_codes_code 
ON public.telegram_verification_codes(code);

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.telegram_verification_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - interval '1 day');
END;
$$;