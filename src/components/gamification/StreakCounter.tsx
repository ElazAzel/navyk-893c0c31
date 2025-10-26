import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCounter = ({ currentStreak, longestStreak }: StreakCounterProps) => {
  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-orange-500/10 to-red-500/10">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-gradient-accent flex items-center justify-center">
              <Flame className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">дней подряд</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Рекорд: {longestStreak} {longestStreak === 1 ? 'день' : longestStreak < 5 ? 'дня' : 'дней'}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-accent">Серия!</div>
            <div className="text-xs text-muted-foreground">Не пропускайте</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
