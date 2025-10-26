import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ContentType = "course" | "event" | "job";

export const useBookmarks = (userId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadBookmarks();
    }
  }, [userId]);

  const loadBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (contentType: ContentType, contentId: string) => {
    return bookmarks.some(
      (b) => b.content_type === contentType && b.content_id === contentId
    );
  };

  const toggleBookmark = async (contentType: ContentType, contentId: string) => {
    if (!userId) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите, чтобы сохранять материалы",
        variant: "destructive",
      });
      return;
    }

    const bookmarked = isBookmarked(contentType, contentId);

    try {
      if (bookmarked) {
        const bookmark = bookmarks.find(
          (b) => b.content_type === contentType && b.content_id === contentId
        );
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", bookmark.id);

        if (error) throw error;

        setBookmarks(bookmarks.filter((b) => b.id !== bookmark.id));
        toast({
          title: "Удалено из закладок",
        });
      } else {
        const { data, error } = await supabase
          .from("bookmarks")
          .insert([{ user_id: userId, content_type: contentType, content_id: contentId }])
          .select()
          .single();

        if (error) throw error;

        setBookmarks([...bookmarks, data]);
        toast({
          title: "Добавлено в закладки",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить закладки",
        variant: "destructive",
      });
    }
  };

  return { bookmarks, loading, isBookmarked, toggleBookmark };
};
