-- Create table for AI request rate limiting
CREATE TABLE IF NOT EXISTS public.ai_request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS on ai_request_log
ALTER TABLE public.ai_request_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own request logs
CREATE POLICY "Users can view own AI request logs"
ON public.ai_request_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_ai_request_log_user_time 
ON public.ai_request_log(user_id, created_at DESC);

-- Create table for tracking telegram auth rate limits
CREATE TABLE IF NOT EXISTS public.telegram_rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('request_code', 'verify_code')),
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT false
);

-- Create index for rate limit queries
CREATE INDEX IF NOT EXISTS idx_telegram_rate_limit_lookup
ON public.telegram_rate_limit(telegram_id, action, created_at DESC);

-- Add failed_attempts column to telegram_verification_codes
ALTER TABLE public.telegram_verification_codes 
ADD COLUMN IF NOT EXISTS failed_attempts INTEGER NOT NULL DEFAULT 0;

-- Function to cleanup old rate limit logs (keep last 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ai_request_log 
  WHERE created_at < now() - interval '24 hours';
  
  DELETE FROM public.telegram_rate_limit 
  WHERE created_at < now() - interval '24 hours';
END;
$$;