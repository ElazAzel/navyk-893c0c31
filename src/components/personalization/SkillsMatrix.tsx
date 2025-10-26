import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Skill {
  id: string;
  skill_name: string;
  skill_level: string;
  progress: number;
  endorsed_by: string[];
  last_practiced?: string;
}

interface SkillsMatrixProps {
  userId: string;
}

export const SkillsMatrix = ({ userId }: SkillsMatrixProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "beginner",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, [userId]);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("user_skills")
        .select("*")
        .eq("user_id", userId)
        .order("progress", { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name) {
      toast({
        title: "Введите название навыка",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("user_skills").insert({
        user_id: userId,
        skill_name: newSkill.name,
        skill_level: newSkill.level,
        progress: 0,
      });

      if (error) throw error;

      toast({
        title: "Навык добавлен!",
        description: "Начните практиковаться для роста уровня",
      });

      setAddDialogOpen(false);
      setNewSkill({ name: "", level: "beginner" });
      loadSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить навык",
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from("user_skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;

      toast({
        title: "Навык удален",
      });
      loadSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить навык",
        variant: "destructive",
      });
    }
  };

  const updateProgress = async (skillId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from("user_skills")
        .update({
          progress: newProgress,
          last_practiced: new Date().toISOString(),
        })
        .eq("id", skillId);

      if (error) throw error;
      loadSkills();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const skillLevelLabels: Record<string, string> = {
    beginner: "Новичок",
    intermediate: "Средний",
    advanced: "Продвинутый",
    expert: "Эксперт",
  };

  const skillLevelColors: Record<string, string> = {
    beginner: "bg-blue-500/10 text-blue-500",
    intermediate: "bg-purple-500/10 text-purple-500",
    advanced: "bg-orange-500/10 text-orange-500",
    expert: "bg-green-500/10 text-green-500",
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Загрузка навыков...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Матрица навыков
          </CardTitle>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить навык</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название навыка</Label>
                  <Input
                    placeholder="Например: React, Python, Design"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Уровень</Label>
                  <Select
                    value={newSkill.level}
                    onValueChange={(value) =>
                      setNewSkill({ ...newSkill, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Новичок</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                      <SelectItem value="expert">Эксперт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addSkill} className="w-full">
                  Добавить навык
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Нет навыков</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте навыки для отслеживания прогресса
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-lg border bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{skill.skill_name}</h4>
                      <Badge
                        className={`${
                          skillLevelColors[skill.skill_level]
                        } text-xs`}
                      >
                        {skillLevelLabels[skill.skill_level]}
                      </Badge>
                    </div>
                    {skill.endorsed_by && skill.endorsed_by.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Подтверждений: {skill.endorsed_by.length}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-semibold">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateProgress(
                          skill.id,
                          Math.min(100, skill.progress + 10)
                        )
                      }
                      disabled={skill.progress >= 100}
                      className="text-xs"
                    >
                      +10%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateProgress(
                          skill.id,
                          Math.min(100, skill.progress + 25)
                        )
                      }
                      disabled={skill.progress >= 100}
                      className="text-xs"
                    >
                      +25%
                    </Button>
                  </div>
                </div>

                {skill.last_practiced && (
                  <p className="text-xs text-muted-foreground">
                    Последняя практика:{" "}
                    {new Date(skill.last_practiced).toLocaleDateString("ru-RU")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
