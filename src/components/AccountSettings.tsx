import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, Chrome, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProfileData {
  email?: string;
  phone?: string;
  telegram_id?: number;
  telegram_username?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  google_connected?: boolean;
}

export const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, phone, telegram_id, telegram_username, email_verified, phone_verified, google_connected')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error: any) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email: emailInput });
      
      if (error) throw error;

      toast({
        title: 'Email отправлен',
        description: 'Проверьте почту для подтверждения',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const connectPhone = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ phone: phoneInput });
      
      if (error) throw error;

      toast({
        title: 'SMS отправлен',
        description: 'Проверьте телефон для подтверждения',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const connectGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Настройки аккаунта</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Управляйте способами входа в аккаунт
        </p>
      </div>

      {profile.telegram_id && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-primary">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2s-.18-.04-.26-.02c-.11.02-1.81 1.15-5.11 3.38-.48.33-.92.49-1.31.48-.43-.01-1.26-.24-1.87-.44-.75-.24-1.35-.37-1.3-.78.03-.21.36-.43.98-.65 3.84-1.67 6.4-2.77 7.69-3.31 3.66-1.52 4.42-1.78 4.91-1.79.11 0 .35.03.51.17.13.11.17.26.19.37-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              Telegram
              <Check className="ml-auto h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              ID: {profile.telegram_id}
              {profile.telegram_username && ` (@${profile.telegram_username})`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            Email
            {profile.email_verified && (
              <Check className="ml-auto h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            )}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {profile.email || 'Не подключен'}
          </CardDescription>
        </CardHeader>
        {!profile.email && (
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email адрес</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
            <Button onClick={connectEmail} className="w-full text-sm sm:text-base h-9 sm:h-10">
              Подключить Email
            </Button>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            Телефон
            {profile.phone_verified && (
              <Check className="ml-auto h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            )}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {profile.phone || 'Не подключен'}
          </CardDescription>
        </CardHeader>
        {!profile.phone && (
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
            <Button onClick={connectPhone} className="w-full text-sm sm:text-base h-9 sm:h-10">
              Подключить телефон
            </Button>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Chrome className="h-4 w-4 sm:h-5 sm:w-5" />
            Google
            {profile.google_connected && (
              <Check className="ml-auto h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            )}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {profile.google_connected ? 'Подключен' : 'Не подключен'}
          </CardDescription>
        </CardHeader>
        {!profile.google_connected && (
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <Separator className="mb-3 sm:mb-4" />
            <Button onClick={connectGoogle} className="w-full text-sm sm:text-base h-9 sm:h-10">
              Подключить Google
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
