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
import { AccountSettings } from "@/components/AccountSettings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Telegram?: any;
  }
}

const Index = () => {
  const { user } = useAuth();
  const { profile, credits, subscription, loading, isPro } = useUserProfile();
  const { updateQuestProgress } = useGamification();
  const [activeTab, setActiveTab] = useState("home");

  const userName = profile?.full_name || "Пользователь";

  // Initialize Telegram WebApp
  useEffect(() => {
    // Check if running in Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Expand to full height
      tg.expand();
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      // Set header color
      tg.setHeaderColor('#1e1b2e');

      // Show ready
      tg.ready();
    }
  }, []);

  // Welcome message and daily login quest
  useEffect(() => {
    if (profile && updateQuestProgress) {
      toast.success(`Добро пожаловать, ${profile.full_name}!`, {
        description: "Начните свой путь к карьерному успеху",
      });
      
      // Update daily login quest
      updateQuestProgress('daily_login', 1);
    }
  }, [profile?.id]); // Only trigger on profile ID change

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
      case "coach":
        return <CoachPage />;
      case "courses":
        return <CoursesPage />;
      case "events":
        return <EventsPage />;
      case "resume":
        return <ResumePage />;
      case "jobs":
        return <JobsPage />;
      case "mentors":
        return <MentorsPage />;
      case "gamification":
        return <GamificationPage />;
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
      default:
        return <HomePage onNavigate={setActiveTab} userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header credits={credits.credits_remaining} isPro={isPro} onUpgrade={handleUpgrade} />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
