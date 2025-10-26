import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Briefcase, Clock } from "lucide-react";
import { useQuickStats } from "@/hooks/useQuickStats";
import { useAuth } from "@/contexts/AuthContext";

export const QuickStatsCard = () => {
  const { user } = useAuth();
  const { stats, loading } = useQuickStats(user?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: BookOpen,
      label: "Курсов завершено",
      value: stats.coursesCompleted,
      total: stats.coursesEnrolled,
    },
    {
      icon: Clock,
      label: "Часов обучения",
      value: stats.totalHoursLearned,
    },
    {
      icon: Calendar,
      label: "Событий посещено",
      value: stats.eventsAttended,
    },
    {
      icon: Briefcase,
      label: "Откликов на вакансии",
      value: stats.jobsApplied,
    },
  ];

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="text-lg">Ваша активность</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {item.value}
                    {item.total && (
                      <span className="text-sm text-muted-foreground ml-1">
                        / {item.total}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
