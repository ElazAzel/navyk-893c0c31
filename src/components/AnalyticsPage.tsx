import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsMatrix } from "@/components/personalization/SkillsMatrix";
import { GoalsTracker } from "@/components/personalization/GoalsTracker";
import { QuickStatsCard } from "@/components/QuickStatsCard";
import { TrendingUp, Target, Award } from "lucide-react";

const AnalyticsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8 text-sm sm:text-base">
        Войдите для доступа к аналитике
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Аналитика</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Отслеживайте свой прогресс и достигайте целей 📊
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStatsCard />

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="skills" className="text-xs sm:text-sm">
            <Award className="h-4 w-4 mr-1.5" />
            Навыки
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-xs sm:text-sm">
            <Target className="h-4 w-4 mr-1.5" />
            Цели
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <SkillsMatrix userId={user.id} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <GoalsTracker userId={user.id} />
        </TabsContent>
      </Tabs>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Ваш прогресс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
              <div>
                <p className="text-sm text-muted-foreground">Время обучения (этот месяц)</p>
                <p className="text-2xl font-bold">12 часов</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">+25%</p>
                <p className="text-xs text-success">от прошлого месяца</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
              <div>
                <p className="text-sm text-muted-foreground">Завершено курсов</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">+2</p>
                <p className="text-xs text-success">в этом месяце</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
              <div>
                <p className="text-sm text-muted-foreground">Средний прогресс по курсам</p>
                <p className="text-2xl font-bold">67%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Хорошо!</p>
                <p className="text-xs text-accent">Продолжайте</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
