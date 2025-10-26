-- Create table for AI chat sessions if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'ai_chat_sessions'
  ) THEN
    CREATE TABLE public.ai_chat_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      coach_id text NOT NULL,
      messages jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );

    ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own chat sessions" ON public.ai_chat_sessions
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can create own chat sessions" ON public.ai_chat_sessions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own chat sessions" ON public.ai_chat_sessions
      FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE TRIGGER update_ai_chat_sessions_updated_at
      BEFORE UPDATE ON public.ai_chat_sessions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;