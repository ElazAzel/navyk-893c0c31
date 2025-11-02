import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useGamification } from "@/hooks/useGamification";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import CoachPage from "@/components/CoachPage";
import ResumePage from "@/components/ResumePage";
import JobsPage from "@/components/JobsPage";
import MentorsPage from "@/components/MentorsPage";
import ProfilePage from "@/components/ProfilePage";
import GamificationPage from "@/components/GamificationPage";
import CoursesPage from "@/components/CoursesPage";
import EventsPage from "@/components/EventsPage";
import BookmarksPage from "@/components/BookmarksPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import { AccountSettings } from "@/components/AccountSettings";
import { LeaderboardPage } from "@/components/social/LeaderboardPage";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminRole } from "@/hooks/useAdminRole";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LearningIndex from "@/components/groups/LearningIndex";
import SocialIndex from "@/components/groups/SocialIndex";
import AdminIndex from "@/components/groups/AdminIndex";
import JobsIndex from "@/components/groups/JobsIndex";

declare global {
  interface Window {
    Telegram?: any;
  }
}

const Index = () => {
  const { user } = useAuth();
  const { profile, credits, subscription, loading, isPro } = useUserProfile();
  const { updateQuestProgress } = useGamification();
  const { isAdmin } = useAdminRole();
  const [activeTab, setActiveTab] = useState("home");

  const userName = profile?.full_name || "Пользователь";

  // Initialize Telegram WebApp
  useEffect(() => {
    // Check if running in Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Expand to full height (guarded)
      try {
        if (typeof tg.expand === 'function') tg.expand();
      } catch (e) {
        // Ignore: some older WebApp environments may not support expand
      }

      // Decide whether to call some newer WebApp methods by checking reported version
      const versionString = (tg.initDataUnsafe && tg.initDataUnsafe.web_app_version) || (tg.initData && tg.initData.web_app_version) || (typeof tg.version === 'string' ? tg.version : undefined);
      const parseMajor = (v?: string) => {
        if (!v) return undefined;
        const m = v.split('.')[0];
        const n = Number(m);
        return Number.isFinite(n) ? n : undefined;
      };
      const major = parseMajor(versionString);

      // enableClosingConfirmation and setHeaderColor were not supported in older 6.0 runtimes
      const shouldUseNewAppearanceFeatures = typeof major === 'number' ? major >= 7 : false;

      if (shouldUseNewAppearanceFeatures) {
        try {
          if (typeof tg.enableClosingConfirmation === 'function') {
            tg.enableClosingConfirmation();
          }
        } catch (e) {
          // Ignore if not supported by the runtime version
        }

        try {
          if (typeof tg.setHeaderColor === 'function') {
            tg.setHeaderColor('#1e1b2e');
          }
        } catch (e) {
          // Ignore if not supported by the runtime version
        }
      }

      // Show ready (guarded)
      try {
        if (typeof tg.ready === 'function') tg.ready();
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Welcome message and daily login quest - only once on mount
  useEffect(() => {
    let hasShownWelcome = false;
    
    if (profile && updateQuestProgress && !hasShownWelcome) {
      hasShownWelcome = true;
      
      toast.success(`Добро пожаловать, ${profile.full_name}!`, {
        description: "Начните свой путь к карьерному успеху",
      });
      
      // Update daily login quest
      updateQuestProgress('daily_login', 1);
    }
  }, []); // Only on mount, not on profile change

  const handleUpgrade = () => {
    toast.info("Функция оплаты в разработке", {
      description: "Скоро вы сможете оформить PRO подписку",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} userName={userName} />;
      case "learning":
        return <LearningIndex />;
      case "events":
        return <EventsPage />;
      case "jobs":
        return <JobsIndex />;
      case "resume":
        return <ResumePage />;
      case "mentors":
        return <MentorsPage />;
      case "social":
        return <SocialIndex />;
      case "analytics":
        return <AnalyticsPage />;
      case "gamification":
        return <GamificationPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "profile":
        return (
          <ProfilePage
            userName={userName}
            credits={credits.credits_remaining}
            isPro={isPro}
            onUpgrade={handleUpgrade}
            profile={profile}
            onNavigate={setActiveTab}
          />
        );
      case "settings":
        return <AccountSettings />;
      case "admin":
        return isAdmin ? <AdminIndex /> : <HomePage onNavigate={setActiveTab} userName={userName} />;
      default:
        return <HomePage onNavigate={setActiveTab} userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <Header credits={credits.credits_remaining} isPro={isPro} onUpgrade={handleUpgrade} />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
