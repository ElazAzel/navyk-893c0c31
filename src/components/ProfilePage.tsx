import { User, CreditCard, Crown, Settings, Zap, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ProfilePageProps {
  userName: string;
  credits: number;
  isPro: boolean;
  onUpgrade: () => void;
  profile: any;
}

const ProfilePage = ({ userName, credits, isPro, onUpgrade, profile }: ProfilePageProps) => {
  return (
    <div className="space-y-4 pb-20">
      {/* Profile Header */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 bg-gradient-primary text-white text-2xl font-bold">
              <AvatarFallback className="bg-gradient-primary text-white">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{userName}</h2>
                {isPro && (
                  <Badge className="bg-gradient-accent border-0 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {profile?.email || 'email@example.com'}
                {profile?.location && ` • ${profile.location}`}
              </p>
              
              {!isPro && (
                <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{credits} AI кредитов</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto text-xs"
                    onClick={onUpgrade}
                  >
                    Пополнить
                  </Button>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold mb-1">24</div>
            <div className="text-xs text-muted-foreground">AI сессий</div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-success" />
            <div className="text-xl font-bold mb-1">3</div>
            <div className="text-xs text-muted-foreground">Резюме</div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
            <div className="text-xl font-bold mb-1">85%</div>
            <div className="text-xs text-muted-foreground">Прогресс</div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade to PRO */}
      {!isPro && (
        <Card className="bg-gradient-primary border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6" />
              <CardTitle className="text-2xl">Upgrade to PRO</CardTitle>
            </div>
            <CardDescription className="text-white/80">
              Получите безлимитный доступ ко всем функциям NAVYK
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Безлимитные AI консультации</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Приоритетная поддержка</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Расширенная аналитика</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Бесплатная первая сессия с ментором</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-bold">4,990₸</span>
              <span className="text-white/70">/месяц</span>
            </div>

            <Button 
              onClick={onUpgrade}
              variant="secondary" 
              size="lg" 
              className="w-full font-semibold"
            >
              Перейти на PRO
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Career Progress */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Карьерный прогресс</CardTitle>
          <CardDescription>Ваш путь к успеху</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Профиль заполнен</span>
              <span className="font-semibold">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Навыки развиты</span>
              <span className="font-semibold">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Резюме готово</span>
              <span className="font-semibold">90%</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <User className="h-4 w-4 mr-3" />
            Редактировать профиль
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="h-4 w-4 mr-3" />
            История транзакций
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-3" />
            Настройки
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
