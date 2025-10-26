import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Check } from 'lucide-react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

const telegramAuthSchema = z.object({
  telegram_id: z.string()
    .regex(/^\d+$/, 'Telegram ID должен содержать только цифры')
    .transform(Number)
    .refine((n) => n > 0 && n <= 999999999999, 'Неверный формат Telegram ID'),
  telegram_username: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Username должен быть 5-32 символа')
    .optional()
    .or(z.literal('')),
  code: z.string()
    .regex(/^\d{6}$/, 'Код должен содержать ровно 6 цифр')
});

export const TelegramAuthForm = () => {
  const [step, setStep] = useState<'telegram_id' | 'code'>('telegram_id');
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{ telegram_id?: string; telegram_username?: string; code?: string }>({});
  const { requestCode, verifyCode, loading } = useTelegramAuth();
  const { toast } = useToast();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate input
    const validation = telegramAuthSchema.pick({ telegram_id: true, telegram_username: true }).safeParse({
      telegram_id: telegramId,
      telegram_username: telegramUsername || undefined,
    });

    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const result = await requestCode(validation.data.telegram_id, validation.data.telegram_username);
    if (result.success) {
      setStep('code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate code
    const codeValidation = telegramAuthSchema.pick({ code: true }).safeParse({ code });
    if (!codeValidation.success) {
      setErrors({ code: codeValidation.error.errors[0]?.message });
      return;
    }

    // Re-validate telegram_id for safety
    const idValidation = telegramAuthSchema.pick({ telegram_id: true }).safeParse({ telegram_id: telegramId });
    if (!idValidation.success) {
      toast({
        title: 'Ошибка',
        description: 'Неверный Telegram ID',
        variant: 'destructive',
      });
      return;
    }

    await verifyCode(idValidation.data.telegram_id, codeValidation.data.code, telegramUsername || undefined);
  };

  if (step === 'telegram_id') {
    return (
      <form onSubmit={handleRequestCode} className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="telegram_id" className="text-xs sm:text-sm">Telegram ID</Label>
          <Input
            id="telegram_id"
            type="text"
            placeholder="Ваш Telegram ID"
            value={telegramId}
            onChange={(e) => {
              setTelegramId(e.target.value);
              setErrors(prev => ({ ...prev, telegram_id: undefined }));
            }}
            required
            className="text-sm sm:text-base h-9 sm:h-10"
          />
          {errors.telegram_id && (
            <p className="text-xs text-destructive">{errors.telegram_id}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Узнать ID можно у бота @userinfobot
          </p>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="telegram_username" className="text-xs sm:text-sm">
            Username (опционально)
          </Label>
          <Input
            id="telegram_username"
            type="text"
            placeholder="@username"
            value={telegramUsername}
            onChange={(e) => {
              setTelegramUsername(e.target.value);
              setErrors(prev => ({ ...prev, telegram_username: undefined }));
            }}
            className="text-sm sm:text-base h-9 sm:h-10"
          />
          {errors.telegram_username && (
            <p className="text-xs text-destructive">{errors.telegram_username}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full text-sm sm:text-base h-9 sm:h-10" 
          disabled={loading}
        >
          <Send className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Получить код
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyCode} className="space-y-3 sm:space-y-4">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="code" className="text-xs sm:text-sm">Код из Telegram</Label>
        <Input
          id="code"
          type="text"
          placeholder="123456"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ''));
            setErrors(prev => ({ ...prev, code: undefined }));
          }}
          maxLength={6}
          required
          className="text-sm sm:text-base h-9 sm:h-10 text-center text-lg sm:text-xl font-mono tracking-widest"
        />
        {errors.code && (
          <p className="text-xs text-destructive">{errors.code}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          type="submit" 
          className="w-full text-sm sm:text-base h-9 sm:h-10" 
          disabled={loading}
        >
          <Check className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Подтвердить
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep('telegram_id')}
          disabled={loading}
          className="w-full text-xs sm:text-sm h-8 sm:h-9"
        >
          Изменить ID
        </Button>
      </div>
    </form>
  );
};
