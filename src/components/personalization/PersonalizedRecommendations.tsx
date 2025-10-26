import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Recommendation {
  id: string;
  title: string;
  type: "course" | "event" | "learning_path";
  reason: string;
  category: string;
  level: string;
  duration_hours?: number;
  rating?: number;
  match_score: number;
}

interface PersonalizedRecommendationsProps {
  userId: string;
  onNavigate?: (tab: string, contentId?: string) => void;
}

export const PersonalizedRecommendations = ({
  userId,
  onNavigate,
}: PersonalizedRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      // Загружаем навыки пользователя
      const { data: skills } = await supabase
        .from("user_skills")
        .select("skill_name, skill_level")
        .eq("user_id", userId);

      // Загружаем историю активности
      const { data: activity } = await supabase
        .from("user_activity_log")
        .select("content_type, metadata")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      // Загружаем курсы для рекомендаций
      const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("rating", { ascending: false })
        .limit(10);

      // Простой алгоритм рекомендаций на основе навыков
      const recs: Recommendation[] = [];

      if (courses) {
        courses.forEach((course) => {
          let matchScore = 50; // базовый скор

          // Увеличиваем скор если категория совпадает с навыками
          if (skills?.some((s) => course.category.includes(s.skill_name))) {
            matchScore += 30;
          }

          // Увеличиваем скор для высоко оцененных курсов
          if (course.rating > 4.5) {
            matchScore += 10;
          }

          // Увеличиваем скор для недавно просмотренных категорий
          const recentCategories = activity
            ?.map((a: any) => a.metadata?.category)
            .filter(Boolean);
          if (recentCategories?.includes(course.category)) {
            matchScore += 15;
          }

          recs.push({
            id: course.id,
            title: course.title,
            type: "course",
            reason: matchScore > 70
              ? "Соответствует вашим навыкам"
              : "Популярный курс",
            category: course.category,
            level: course.level,
            duration_hours: course.duration_hours,
            rating: course.rating,
            match_score: Math.min(100, matchScore),
          });
        });
      }

      // Сортируем по match_score и берем топ 5
      recs.sort((a, b) => b.match_score - a.match_score);
      setRecommendations(recs.slice(0, 5));
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const levelLabels: Record<string, string> = {
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Недостаточно данных</h3>
            <p className="text-sm text-muted-foreground">
              Добавьте навыки и изучите курсы для персональных рекомендаций
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Рекомендуем для вас
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer"
            onClick={() => onNavigate?.("courses", rec.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {rec.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {levelLabels[rec.level]}
                  </Badge>
                  {rec.match_score >= 80 && (
                    <Badge
                      variant="default"
                      className="bg-accent/10 text-accent border-accent/20 text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {rec.match_score}% совпадение
                    </Badge>
                  )}
                </div>

                <h4 className="font-semibold line-clamp-1">{rec.title}</h4>

                <p className="text-xs text-muted-foreground">{rec.reason}</p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {rec.duration_hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.duration_hours}ч
                    </span>
                  )}
                  {rec.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {rec.rating}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.("courses", rec.id);
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate?.("courses")}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Смотреть все курсы
        </Button>
      </CardContent>
    </Card>
  );
};
