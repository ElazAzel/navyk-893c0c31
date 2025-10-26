-- Enable RLS on telegram_rate_limit table
ALTER TABLE public.telegram_rate_limit ENABLE ROW LEVEL SECURITY;

-- This table is only accessed by edge functions using service role
-- Add policy for service role access
CREATE POLICY "Service role can manage telegram rate limits"
ON public.telegram_rate_limit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);