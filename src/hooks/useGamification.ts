import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserLevel {
  level: number;
  current_xp: number;
  total_xp: number;
}

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

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_login_date: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState<UserLevel>({ level: 1, current_xp: 0, total_xp: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [streak, setStreak] = useState<UserStreak>({ current_streak: 0, longest_streak: 0, last_login_date: '' });
  const [loading, setLoading] = useState(true);

  const getXPForLevel = (level: number) => {
    return level * 100; // 100 XP per level
  };

  const getLevelFromXP = (totalXP: number) => {
    return Math.floor(totalXP / 100) + 1;
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchGamificationData = async () => {
      try {
        // Fetch user level
        const { data: levelData } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (levelData) {
          setUserLevel({
            level: levelData.level,
            current_xp: levelData.current_xp,
            total_xp: levelData.total_xp,
          });
        }

        // Fetch all achievements with user progress
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .order('category', { ascending: true });

        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', user.id);

        if (achievementsData) {
          const enrichedAchievements = achievementsData.map(achievement => ({
            ...achievement,
            unlocked: userAchievements?.some(ua => ua.achievement_id === achievement.id),
            unlocked_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at,
          }));
          setAchievements(enrichedAchievements);
        }

        // Fetch daily quests with progress
        const { data: questsData } = await supabase
          .from('daily_quests')
          .select('*');

        const { data: progressData } = await supabase
          .from('user_daily_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('quest_date', new Date().toISOString().split('T')[0]);

        if (questsData) {
          const enrichedQuests = questsData.map(quest => ({
            ...quest,
            progress: progressData?.find(p => p.quest_id === quest.id)?.progress || 0,
            completed: progressData?.find(p => p.quest_id === quest.id)?.completed || false,
          }));
          setDailyQuests(enrichedQuests);
        }

        // Fetch streak
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (streakData) {
          setStreak({
            current_streak: streakData.current_streak,
            longest_streak: streakData.longest_streak,
            last_login_date: streakData.last_login_date,
          });
        }

      } catch (error: any) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();

    // Real-time subscription for level updates
    const levelChannel = supabase
      .channel('user_levels_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_levels',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setUserLevel({
            level: payload.new.level,
            current_xp: payload.new.current_xp,
            total_xp: payload.new.total_xp,
          });
        }
      )
      .subscribe();

    return () => {
      levelChannel.unsubscribe();
    };
  }, [user]);

  const addXP = async (xp: number, source: string) => {
    if (!user) return;

    try {
      const previousLevel = userLevel.level;
      
      // Use secure database function to add XP
      const { error } = await supabase.rpc('add_xp_to_user', {
        _user_id: user.id,
        _xp_amount: xp
      });

      if (error) throw error;

      // Fetch updated level data
      const { data: updatedLevel } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (updatedLevel) {
        const newLevel = updatedLevel.level;
        
        // Show level up notification
        if (newLevel > previousLevel) {
          toast({
            title: "🎉 Новый уровень!",
            description: `Вы достигли ${newLevel} уровня! Получено ${xp} XP от ${source}`,
          });
        } else {
          toast({
            title: `+${xp} XP`,
            description: source,
          });
        }
      }
    } catch (error: any) {
      console.error('Error adding XP:', error);
    }
  };

  const unlockAchievement = async (achievementCode: string) => {
    if (!user) return;

    try {
      const achievement = achievements.find(a => a.code === achievementCode);
      if (!achievement || achievement.unlocked) return;

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
        });

      if (error) {
        if (error.code === '23505') return; // Already unlocked
        throw error;
      }

      // Add XP reward
      if (achievement.xp_reward > 0) {
        await addXP(achievement.xp_reward, achievement.name);
      }

      // Add credits reward using secure function
      if (achievement.credits_reward > 0) {
        await supabase.rpc('add_credits', {
          _user_id: user.id,
          _amount: achievement.credits_reward
        });
      }

      toast({
        title: `🏆 Достижение разблокировано!`,
        description: `${achievement.icon} ${achievement.name}`,
      });

      // Refresh achievements
      const { data } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      const enrichedAchievements = achievements.map(ach => ({
        ...ach,
        unlocked: data?.some(ua => ua.achievement_id === ach.id),
        unlocked_at: data?.find(ua => ua.achievement_id === ach.id)?.unlocked_at,
      }));
      setAchievements(enrichedAchievements);
    } catch (error: any) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const updateQuestProgress = async (questCode: string, increment: number = 1) => {
    if (!user) return;

    try {
      const quest = dailyQuests.find(q => q.code === questCode);
      if (!quest || quest.completed) return;

      const today = new Date().toISOString().split('T')[0];
      const newProgress = Math.min((quest.progress || 0) + increment, quest.required_count);
      const completed = newProgress >= quest.required_count;

      const { error } = await supabase
        .from('user_daily_progress')
        .upsert({
          user_id: user.id,
          quest_id: quest.id,
          progress: newProgress,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          quest_date: today,
        }, {
          onConflict: 'user_id,quest_id,quest_date',
        });

      if (error) throw error;

      if (completed && !quest.completed) {
        // Add rewards
        if (quest.xp_reward > 0) {
          await addXP(quest.xp_reward, `Задание: ${quest.name}`);
        }

        if (quest.credits_reward > 0) {
          await supabase.rpc('add_credits', {
            _user_id: user.id,
            _amount: quest.credits_reward
          });
        }

        toast({
          title: "✅ Задание выполнено!",
          description: `${quest.name} - +${quest.xp_reward} XP`,
        });
      }

      // Update local state
      setDailyQuests(quests => 
        quests.map(q => 
          q.id === quest.id 
            ? { ...q, progress: newProgress, completed }
            : q
        )
      );
    } catch (error: any) {
      console.error('Error updating quest progress:', error);
    }
  };

  return {
    userLevel,
    achievements,
    dailyQuests,
    streak,
    loading,
    addXP,
    unlockAchievement,
    updateQuestProgress,
    getXPForLevel,
  };
};
