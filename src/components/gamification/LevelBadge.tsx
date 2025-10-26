import { Crown, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface LevelBadgeProps {
  level: number;
  currentXP: number;
  totalXP: number;
  getXPForLevel: (level: number) => number;
}

const getLevelIcon = (level: number) => {
  if (level >= 31) return "👑";
  if (level >= 21) return "🏆";
  if (level >= 11) return "🌳";
  if (level >= 6) return "🌿";
  return "🌱";
};

const getLevelTitle = (level: number) => {
  if (level >= 31) return "Мастер";
  if (level >= 21) return "Профессионал";
  if (level >= 11) return "Эксперт";
  if (level >= 6) return "Специалист";
  return "Новичок";
};

export const LevelBadge = ({ level, currentXP, totalXP, getXPForLevel }: LevelBadgeProps) => {
  const xpForNextLevel = getXPForLevel(level);
  const progressPercent = (currentXP / xpForNextLevel) * 100;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-card">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-3xl">
              {getLevelIcon(level)}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center border-2 border-background">
              {level}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{getLevelTitle(level)}</h3>
              <Crown className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {currentXP} / {xpForNextLevel} XP
                </span>
                <span className="font-semibold text-primary flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {totalXP} общий XP
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
