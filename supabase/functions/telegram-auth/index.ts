import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestCodeBody {
  telegram_id: number;
  telegram_username?: string;
}

interface VerifyCodeBody {
  telegram_id: number;
  code: string;
  telegram_username?: string;
}

// Validation functions
function validateTelegramId(telegram_id: any): boolean {
  return typeof telegram_id === 'number' && 
         telegram_id > 0 && 
         telegram_id <= 999999999999 && 
         Number.isInteger(telegram_id);
}

function validateCode(code: any): boolean {
  return typeof code === 'string' && /^\d{6}$/.test(code);
}

function validateUsername(username: any): boolean {
  if (!username) return true; // Optional field
  return typeof username === 'string' && /^@?[a-zA-Z0-9_]{5,32}$/.test(username);
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Telegram API error:', error);
    throw new Error('Failed to send Telegram message');
  }
}

async function checkRateLimit(
  supabase: any,
  telegram_id: number,
  action: 'request_code' | 'verify_code',
  ip_address: string | null
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = action === 'request_code' ? 3 : 5;
  
  const windowStart = new Date(Date.now() - windowMs).toISOString();
  
  const { data, error } = await supabase
    .from('telegram_rate_limit')
    .select('created_at')
    .eq('telegram_id', telegram_id)
    .eq('action', action)
    .gte('created_at', windowStart)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Fail open
  }
  
  if (data && data.length >= maxRequests) {
    const oldestRequest = new Date(data[data.length - 1].created_at).getTime();
    const retryAfter = Math.ceil((oldestRequest + windowMs - Date.now()) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Log this attempt
  await supabase.from('telegram_rate_limit').insert({
    telegram_id,
    action,
    ip_address,
    success: true
  });
  
  return { allowed: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'request_code') {
      const body: RequestCodeBody = await req.json();
      const { telegram_id, telegram_username } = body;

      // Validate inputs
      if (!validateTelegramId(telegram_id)) {
        return new Response(
          JSON.stringify({ error: 'Invalid telegram_id format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (telegram_username && !validateUsername(telegram_username)) {
        return new Response(
          JSON.stringify({ error: 'Invalid telegram_username format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check rate limit
      const rateLimitCheck = await checkRateLimit(supabase, telegram_id, 'request_code', ip_address);
      if (!rateLimitCheck.allowed) {
        return new Response(
          JSON.stringify({ 
            error: `Слишком много попыток. Подождите ${rateLimitCheck.retryAfter} секунд` 
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': rateLimitCheck.retryAfter!.toString()
            } 
          }
        );
      }

      // Generate 6-digit code
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clean up old codes
      await supabase.rpc('cleanup_expired_verification_codes');

      // Save code to database
      const { error: insertError } = await supabase
        .from('telegram_verification_codes')
        .insert({
          telegram_id,
          code,
          expires_at: expiresAt.toISOString(),
          failed_attempts: 0
        });

      if (insertError) {
        console.error('Error saving verification code:', insertError);
        throw new Error('Failed to generate verification code');
      }

      // Send code via Telegram
      const message = `🔐 <b>Код верификации NAVYK</b>\n\nВаш код: <code>${code}</code>\n\nКод действителен 10 минут.`;
      await sendTelegramMessage(telegram_id, message);

      return new Response(
        JSON.stringify({ success: true, message: 'Code sent to Telegram' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify_code') {
      const body: VerifyCodeBody = await req.json();
      const { telegram_id, code, telegram_username } = body;

      // Validate inputs
      if (!validateTelegramId(telegram_id)) {
        return new Response(
          JSON.stringify({ error: 'Invalid telegram_id format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!validateCode(code)) {
        return new Response(
          JSON.stringify({ error: 'Invalid code format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (telegram_username && !validateUsername(telegram_username)) {
        return new Response(
          JSON.stringify({ error: 'Invalid telegram_username format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check rate limit
      const rateLimitCheck = await checkRateLimit(supabase, telegram_id, 'verify_code', ip_address);
      if (!rateLimitCheck.allowed) {
        return new Response(
          JSON.stringify({ 
            error: `Слишком много попыток. Подождите ${rateLimitCheck.retryAfter} секунд` 
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': rateLimitCheck.retryAfter!.toString()
            } 
          }
        );
      }

      // Verify code
      const { data: codeData, error: codeError } = await supabase
        .from('telegram_verification_codes')
        .select('*')
        .eq('telegram_id', telegram_id)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (codeError || !codeData) {
        // Track failed attempt
        await supabase
          .from('telegram_rate_limit')
          .insert({
            telegram_id,
            action: 'verify_code',
            ip_address,
            success: false
          });
        
        throw new Error('Invalid or expired code');
      }

      // Check failed attempts
      if (codeData.failed_attempts >= 5) {
        await supabase
          .from('telegram_verification_codes')
          .update({ used: true })
          .eq('id', codeData.id);
        
        return new Response(
          JSON.stringify({ error: 'Слишком много неверных попыток. Запросите новый код' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark code as used
      await supabase
        .from('telegram_verification_codes')
        .update({ used: true })
        .eq('id', codeData.id);

      // Check if user with this telegram_id exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('telegram_id', telegram_id)
        .single();

      if (existingProfile) {
        // User exists, create session
        const { data: sessionData, error: sessionError } = await supabase.auth.admin.getUserById(
          existingProfile.id
        );

        if (sessionError || !sessionData.user) {
          throw new Error('Failed to authenticate user');
        }

        // Create session token
        const { data: session, error: tokenError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: sessionData.user.email!,
        });

        if (tokenError || !session) {
          throw new Error('Failed to create session');
        }

        return new Response(
          JSON.stringify({
            success: true,
            user_id: existingProfile.id,
            session_url: session.properties.action_link,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // New user - generate random password and create user
        const randomPassword = crypto.randomUUID();
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: `tg${telegram_id}@navyk.app`,
          password: randomPassword,
          email_confirm: true,
          user_metadata: {
            telegram_id,
            telegram_username,
            full_name: telegram_username || `Пользователь ${telegram_id}`,
            is_telegram_user: true,
          },
        });

        if (authError || !authData.user) {
          console.error('Error creating user:', authError);
          return new Response(
            JSON.stringify({ error: 'Не удалось создать пользователя. Попробуйте снова.' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Wait a bit for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update profile with Telegram data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            telegram_id,
            telegram_username,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Create session
        const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: authData.user.email!,
        });

        if (sessionError || !session) {
          console.error('Error creating session:', sessionError);
          return new Response(
            JSON.stringify({ error: 'Не удалось создать сессию' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            user_id: authData.user.id,
            session_url: session.properties.action_link,
            is_new_user: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    throw new Error('Invalid action parameter');
  } catch (error: any) {
    console.error('Error in telegram-auth:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});