import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  full_name: string | null;
  level: number | null;
  total_xp: number | null;
  achievements_count: number | null;
  rank: number | null;
}

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaderboard_secure")
        .select("*")
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-secondary";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Таблица лидеров
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Таблица лидеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Все время</TabsTrigger>
              <TabsTrigger value="month">Этот месяц</TabsTrigger>
              <TabsTrigger value="week">Эта неделя</TabsTrigger>
            </TabsList>

            <TabsContent value={timeFilter} className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Пока нет данных</h3>
                  <p className="text-sm text-muted-foreground">
                    Станьте первым в таблице лидеров!
                  </p>
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                      entry.rank && entry.rank <= 3 ? getRankBadge(entry.rank) : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {entry.rank && getRankIcon(entry.rank)}
                    </div>

                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {entry.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h4 className={`font-semibold ${entry.rank && entry.rank <= 3 ? "text-white" : ""}`}>
                        {entry.full_name || "Анонимный пользователь"}
                      </h4>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className={entry.rank && entry.rank <= 3 ? "bg-white/20 text-white border-white/30" : ""}>
                          Уровень {entry.level || 1}
                        </Badge>
                        <span className={`flex items-center gap-1 ${entry.rank && entry.rank <= 3 ? "text-white/90" : "text-muted-foreground"}`}>
                          <TrendingUp className="h-3 w-3" />
                          {entry.total_xp || 0} XP
                        </span>
                        <span className={`flex items-center gap-1 ${entry.rank && entry.rank <= 3 ? "text-white/90" : "text-muted-foreground"}`}>
                          <Award className="h-3 w-3" />
                          {entry.achievements_count || 0} достижений
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
