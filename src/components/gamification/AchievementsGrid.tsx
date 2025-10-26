import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  xp_reward: number;
  credits_reward: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'career': return 'from-blue-500 to-cyan-500';
    case 'learning': return 'from-purple-500 to-pink-500';
    case 'social': return 'from-green-500 to-emerald-500';
    case 'special': return 'from-orange-500 to-red-500';
    default: return 'from-gray-500 to-slate-500';
  }
};

const getCategoryName = (category: string) => {
  switch (category) {
    case 'career': return 'Карьера';
    case 'learning': return 'Обучение';
    case 'social': return 'Социальное';
    case 'special': return 'Особое';
    default: return 'Другое';
  }
};

export const AchievementsGrid = ({ achievements }: AchievementsGridProps) => {
  const categories = [...new Set(achievements.map(a => a.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{getCategoryName(category)}</h3>
              <Badge variant="secondary">
                {unlockedCount}/{categoryAchievements.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryAchievements.map(achievement => (
                <Card 
                  key={achievement.id}
                  className={`transition-base ${
                    achievement.unlocked 
                      ? 'border-primary/50 bg-gradient-card' 
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center space-y-2">
                      <div className={`relative mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center text-2xl`}>
                        {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <span className="text-primary font-semibold">+{achievement.xp_reward} XP</span>
                        {achievement.credits_reward > 0 && (
                          <span className="text-accent font-semibold">+{achievement.credits_reward} 💎</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
