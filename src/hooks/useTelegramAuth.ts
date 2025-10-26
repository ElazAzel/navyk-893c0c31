import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTelegramAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const requestCode = async (telegramId: number, telegramUsername?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('telegram-auth?action=request_code', {
        body: { telegram_id: telegramId, telegram_username: telegramUsername },
      });

      if (error) throw error;

      toast({
        title: 'Код отправлен',
        description: 'Проверьте Telegram для получения кода верификации',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отправить код',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (telegramId: number, code: string, telegramUsername?: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('telegram-auth?action=verify_code', {
        body: { telegram_id: telegramId, code, telegram_username: telegramUsername },
      });

      if (error) throw error;

      if (data?.session_url) {
        // Open the magic link in the same window to authenticate
        window.location.href = data.session_url;
      }

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Неверный или истекший код',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { requestCode, verifyCode, loading };
};
