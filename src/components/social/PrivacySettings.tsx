import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, User, Trophy, Save } from "lucide-react";
import { toast } from "sonner";

export const PrivacySettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profile_visibility: "private",
    show_in_leaderboard: false,
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_visibility, show_in_leaderboard")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings({
          profile_visibility: data.profile_visibility || "private",
          show_in_leaderboard: data.show_in_leaderboard || false,
        });
      }
    } catch (error) {
      console.error("Error loading privacy settings:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          profile_visibility: settings.profile_visibility,
          show_in_leaderboard: settings.show_in_leaderboard,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Настройки приватности сохранены");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast.error("Ошибка при сохранении настроек");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Настройки приватности
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="visibility">Видимость профиля</Label>
          <Select
            value={settings.profile_visibility}
            onValueChange={(value) =>
              setSettings({ ...settings, profile_visibility: value })
            }
          >
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  <span>Приватный</span>
                </div>
              </SelectItem>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Публичный</span>
                </div>
              </SelectItem>
              <SelectItem value="friends_only">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Только друзья</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {settings.profile_visibility === "private" && "Только вы видите ваш профиль"}
            {settings.profile_visibility === "public" && "Все пользователи видят ваш профиль"}
            {settings.profile_visibility === "friends_only" && "Только ваши друзья видят профиль"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Показывать в рейтинге
            </Label>
            <p className="text-xs text-muted-foreground">
              Ваше имя появится в таблице лидеров
            </p>
          </div>
          <Switch
            id="leaderboard"
            checked={settings.show_in_leaderboard}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, show_in_leaderboard: checked })
            }
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Сохранить изменения
        </Button>
      </CardContent>
    </Card>
  );
};
