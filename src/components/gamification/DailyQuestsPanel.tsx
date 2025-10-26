import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyQuest {
  id: string;
  code: string;
  name: string;
  description: string;
  xp_reward: number;
  credits_reward: number;
  required_count: number;
  quest_type: string;
  progress?: number;
  completed?: boolean;
}

interface DailyQuestsPanelProps {
  quests: DailyQuest[];
}

export const DailyQuestsPanel = ({ quests }: DailyQuestsPanelProps) => {
  const completedCount = quests.filter(q => q.completed).length;

  return (
    <Card className="border-primary/20 bg-gradient-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Ежедневные задания</CardTitle>
            <CardDescription>
              Выполнено {completedCount} из {quests.length}
            </CardDescription>
          </div>
          <div className="text-4xl animate-bounce">🎯</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quests.map(quest => {
          const progress = quest.progress || 0;
          const progressPercent = (progress / quest.required_count) * 100;

          return (
            <div 
              key={quest.id}
              className={`p-3 rounded-lg border transition-base ${
                quest.completed 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {quest.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm">{quest.name}</h4>
                    <p className="text-xs text-muted-foreground">{quest.description}</p>
                  </div>
                  
                  {!quest.completed && quest.required_count > 1 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Прогресс</span>
                        <span>{progress}/{quest.required_count}</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-primary font-semibold">+{quest.xp_reward} XP</span>
                    {quest.credits_reward > 0 && (
                      <span className="text-accent font-semibold">+{quest.credits_reward} 💎</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {completedCount === quests.length && (
          <div className="text-center py-4 space-y-2">
            <div className="text-4xl">🎉</div>
            <p className="text-sm font-semibold text-success">
              Все задания выполнены!
            </p>
            <p className="text-xs text-muted-foreground">
              Возвращайтесь завтра за новыми заданиями
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
