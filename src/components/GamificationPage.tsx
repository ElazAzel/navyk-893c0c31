import { useState, useEffect } from "react";
import { Trophy, Target, Flame, Crown, Medal, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamification } from "@/hooks/useGamification";
import { LevelBadge } from "./gamification/LevelBadge";
import { AchievementsGrid } from "./gamification/AchievementsGrid";
import { DailyQuestsPanel } from "./gamification/DailyQuestsPanel";
import { StreakCounter } from "./gamification/StreakCounter";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
  rank: number;
  full_name: string;
  level: number;
  total_xp: number;
  achievements_count: number;
}

const LeaderboardContent = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_secure')
        .select('*')
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Топ-10 пользователей</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className="font-medium text-sm">{entry.full_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    Уровень {entry.level}
                  </Badge>
                  <span>{entry.total_xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{entry.achievements_count}</span>
            </div>
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Рейтинг пока пуст</p>
            <p className="text-sm mt-1">Станьте первым!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
          <LeaderboardContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
