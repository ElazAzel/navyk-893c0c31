import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Check } from 'lucide-react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

export const TelegramAuthForm = () => {
  const [step, setStep] = useState<'telegram_id' | 'code'>('telegram_id');
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [code, setCode] = useState('');
  const { requestCode, verifyCode, loading } = useTelegramAuth();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(telegramId);
    if (isNaN(id)) {
      return;
    }

    const result = await requestCode(id, telegramUsername || undefined);
    if (result.success) {
      setStep('code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(telegramId);
    if (isNaN(id)) {
      return;
    }

    await verifyCode(id, code, telegramUsername || undefined);
  };

  if (step === 'telegram_id') {
    return (
      <form onSubmit={handleRequestCode} className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="telegram_id" className="text-xs sm:text-sm">Telegram ID</Label>
          <Input
            id="telegram_id"
            type="number"
            placeholder="Ваш Telegram ID"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            required
            className="text-sm sm:text-base h-9 sm:h-10"
          />
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
            onChange={(e) => setTelegramUsername(e.target.value)}
            className="text-sm sm:text-base h-9 sm:h-10"
          />
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
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
          className="text-sm sm:text-base h-9 sm:h-10 text-center text-lg sm:text-xl font-mono tracking-widest"
        />
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
