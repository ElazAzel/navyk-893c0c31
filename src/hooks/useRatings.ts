import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ContentType = "course" | "event" | "job";

export const useRatings = (contentType: ContentType, contentId: string) => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRatings();
  }, [contentType, contentId]);

  const loadRatings = async () => {
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("content_type", contentType)
        .eq("content_id", contentId);

      if (error) throw error;

      setRatings(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userRatingData = data?.find(r => r.user_id === user.id);
        setUserRating(userRatingData || null);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: number, review?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Войдите, чтобы оставить отзыв",
          variant: "destructive",
        });
        return;
      }

      if (userRating) {
        const { error } = await supabase
          .from("ratings")
          .update({ rating, review, updated_at: new Date().toISOString() })
          .eq("id", userRating.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ratings")
          .insert([{
            user_id: user.id,
            content_type: contentType,
            content_id: contentId,
            rating,
            review,
          }]);

        if (error) throw error;
      }

      toast({
        title: "Отзыв сохранен",
        description: "Спасибо за вашу оценку!",
      });

      await loadRatings();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить отзыв",
        variant: "destructive",
      });
    }
  };

  return { ratings, averageRating, userRating, loading, submitRating };
};
