import { useState } from "react";
import BookmarksPage from "@/components/BookmarksPage";
import { LeaderboardPage } from "@/components/social/LeaderboardPage";
import GamificationPage from "@/components/GamificationPage";
import { cn } from "@/lib/utils";

interface SocialIndexProps {
  initial?: string;
}

const SocialIndex = ({ initial = "bookmarks" }: SocialIndexProps) => {
  const [subTab, setSubTab] = useState<string>(initial);

  const renderSub = () => {
    switch (subTab) {
      case "bookmarks":
        return <BookmarksPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "gamification":
        return <GamificationPage />;
      default:
        return <BookmarksPage />;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSubTab("bookmarks")}
          className={cn("px-3 py-1 rounded-md", subTab === "bookmarks" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Закладки
        </button>
        <button
          onClick={() => setSubTab("leaderboard")}
          className={cn("px-3 py-1 rounded-md", subTab === "leaderboard" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Рейтинг
        </button>
        <button
          onClick={() => setSubTab("gamification")}
          className={cn("px-3 py-1 rounded-md", subTab === "gamification" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Геймификация
        </button>
      </div>

      <div>{renderSub()}</div>
    </div>
  );
};

export default SocialIndex;
