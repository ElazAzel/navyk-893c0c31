import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Sparkles } from 'lucide-react';
import logo from "@/assets/logo.svg";
import { TelegramAuthForm } from '@/components/TelegramAuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Redirect if already logged in (use effect to avoid conditional hook calls)
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  if (user) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.fullName
    );
    
    if (!error) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse" />
              <img src={logo} alt="NAVYK" className="relative h-20 w-20" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">NAVYK</h1>
            <p className="text-muted-foreground mt-2">
              AI карьерный помощник для начинающих специалистов
            </p>
          </div>
        </div>

        <Card className="border-2 shadow-lg card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Войти в систему
            </CardTitle>
            <CardDescription>
              Начните свой карьерный путь с NAVYK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="telegram" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                <TabsTrigger value="telegram" className="text-xs sm:text-sm">Telegram</TabsTrigger>
                <TabsTrigger value="signin" className="text-xs sm:text-sm">Email</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs sm:text-sm">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="telegram" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Быстрый вход через Telegram. Получите код в боте и войдите за секунды.
                  </p>
                </div>
                <TelegramAuthForm />
              </TabsContent>

              <TabsContent value="signin" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signin-email" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signin-password" className="text-xs sm:text-sm">Пароль</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm sm:text-base h-9 sm:h-10"
                    disabled={loading}
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-name" className="text-xs sm:text-sm">Полное имя</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Иван Иванов"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                      disabled={loading}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-email" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-password" className="text-xs sm:text-sm">Пароль</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                      disabled={loading}
                      minLength={6}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Минимум 6 символов
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm sm:text-base h-9 sm:h-10"
                    disabled={loading}
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Регистрируясь, вы соглашаетесь с нашими условиями использования
        </p>
      </div>
    </div>
  );
};

export default Auth;
