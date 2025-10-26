import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Trash2, CheckCircle2, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Goal {
  id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_date?: string;
  status: string;
  progress: number;
  created_at: string;
}

interface GoalsTrackerProps {
  userId: string;
}

export const GoalsTracker = ({ userId }: GoalsTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: "skill",
    title: "",
    description: "",
    target_date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title) {
      toast({
        title: "Введите название цели",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("user_goals").insert({
        user_id: userId,
        goal_type: newGoal.type,
        title: newGoal.title,
        description: newGoal.description,
        target_date: newGoal.target_date || null,
        status: "in_progress",
        progress: 0,
      });

      if (error) throw error;

      toast({
        title: "Цель добавлена!",
        description: "Начните работать над её достижением",
      });

      setAddDialogOpen(false);
      setNewGoal({ type: "skill", title: "", description: "", target_date: "" });
      loadGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить цель",
        variant: "destructive",
      });
    }
  };

  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    try {
      const updates: any = { progress: newProgress };
      if (newProgress >= 100) {
        updates.status = "completed";
      }

      const { error } = await supabase
        .from("user_goals")
        .update(updates)
        .eq("id", goalId);

      if (error) throw error;

      if (newProgress >= 100) {
        toast({
          title: "Поздравляем! 🎉",
          description: "Цель достигнута!",
        });
      }

      loadGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Цель удалена",
      });
      loadGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить цель",
        variant: "destructive",
      });
    }
  };

  const goalTypeLabels: Record<string, string> = {
    career: "Карьера",
    skill: "Навык",
    course: "Курс",
    certification: "Сертификация",
  };

  const statusLabels: Record<string, string> = {
    not_started: "Не начато",
    in_progress: "В процессе",
    completed: "Завершено",
    abandoned: "Отменено",
  };

  const statusColors: Record<string, string> = {
    not_started: "bg-gray-500/10 text-gray-500",
    in_progress: "bg-blue-500/10 text-blue-500",
    completed: "bg-green-500/10 text-green-500",
    abandoned: "bg-red-500/10 text-red-500",
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Загрузка целей...
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter((g) => g.status === "in_progress");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Мои цели
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Активных: {activeGoals.length} • Завершено: {completedGoals.length}
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая цель</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Тип цели</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career">Карьера</SelectItem>
                      <SelectItem value="skill">Навык</SelectItem>
                      <SelectItem value="course">Курс</SelectItem>
                      <SelectItem value="certification">Сертификация</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Название</Label>
                  <Input
                    placeholder="Например: Изучить React"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    placeholder="Детали цели..."
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Целевая дата</Label>
                  <Input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target_date: e.target.value })
                    }
                  />
                </div>
                <Button onClick={addGoal} className="w-full">
                  Создать цель
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Нет целей</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Поставьте цели для достижения карьерного успеха
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-lg border bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[goal.status]} text-xs`}
                      >
                        {statusLabels[goal.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {goalTypeLabels[goal.goal_type]}
                      </Badge>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {goal.description}
                      </p>
                    )}
                    {goal.target_date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        До:{" "}
                        {new Date(goal.target_date).toLocaleDateString("ru-RU")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {goal.status !== "completed" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            Math.min(100, goal.progress + 25)
                          )
                        }
                        disabled={goal.progress >= 100}
                        className="text-xs"
                      >
                        +25%
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateGoalProgress(goal.id, 100)}
                        disabled={goal.progress >= 100}
                        className="text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Завершить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
