import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  contentType: "comment" | "course" | "event";
  contentId: string;
  initialLikes?: number;
}

export const LikeButton = ({ contentType, contentId, initialLikes = 0 }: LikeButtonProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
    loadLikesCount();
  }, [user, contentType, contentId]);

  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      setLiked(!!data);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const loadLikesCount = async () => {
    try {
      const { count, error } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("content_type", contentType)
        .eq("content_id", contentId);

      if (error) throw error;
      setLikesCount(count || 0);
    } catch (error) {
      console.error("Error loading likes count:", error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error("Войдите, чтобы поставить лайк");
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("content_type", contentType)
          .eq("content_id", contentId);

        if (error) throw error;
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase.from("likes").insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
        });

        if (error) throw error;
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Ошибка при обновлении лайка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={loading}
      className="gap-2"
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
      />
      <span>{likesCount}</span>
    </Button>
  );
};
