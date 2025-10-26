import { useState } from "react";
import { Trophy, Target, Flame, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamification } from "@/hooks/useGamification";
import { LevelBadge } from "./gamification/LevelBadge";
import { AchievementsGrid } from "./gamification/AchievementsGrid";
import { DailyQuestsPanel } from "./gamification/DailyQuestsPanel";
import { StreakCounter } from "./gamification/StreakCounter";
import { Loader2 } from "lucide-react";

const GamificationPage = () => {
  const { 
    userLevel, 
    achievements, 
    dailyQuests, 
    streak, 
    loading,
    getXPForLevel 
  } = useGamification();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4 pb-20">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Геймификация</h1>
        <p className="text-muted-foreground">
          Развивайтесь, получайте награды и достигайте новых уровней
        </p>
      </div>

      <LevelBadge 
        level={userLevel.level}
        currentXP={userLevel.current_xp}
        totalXP={userLevel.total_xp}
        getXPForLevel={getXPForLevel}
      />

      <StreakCounter 
        currentStreak={streak.current_streak}
        longestStreak={streak.longest_streak}
      />

      <Tabs defaultValue="quests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quests" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Задания</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Достижения</span>
            <span className="text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
              {unlockedAchievements}
            </span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Рейтинг</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quests" className="space-y-4 mt-4">
          <DailyQuestsPanel quests={dailyQuests} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-semibold">
              Разблокировано {unlockedAchievements} из {achievements.length} достижений
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Продолжайте развиваться и открывайте новые награды!
            </p>
          </div>
          <AchievementsGrid achievements={achievements} />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 mt-4">
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">👑</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Рейтинг скоро появится!</h3>
              <p className="text-muted-foreground">
                Соревнуйтесь с другими пользователями и занимайте топовые места
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
