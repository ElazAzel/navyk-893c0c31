import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import CoachPage from "@/components/CoachPage";
import ResumePage from "@/components/ResumePage";
import JobsPage from "@/components/JobsPage";
import MentorsPage from "@/components/MentorsPage";
import ProfilePage from "@/components/ProfilePage";
import { toast } from "sonner";

declare global {
  interface Window {
    Telegram?: any;
  }
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [credits, setCredits] = useState(10);
  const [isPro, setIsPro] = useState(false);
  const [userName, setUserName] = useState("Айдар");

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
      
      // Get user data from Telegram
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserName(user.first_name || "Пользователь");
      }

      // Show ready
      tg.ready();
    }

    // Welcome message
    toast.success(`Добро пожаловать в NAVYK, ${userName}!`, {
      description: "Начните свой путь к карьерному успеху",
    });
  }, []);

  const handleUpgrade = () => {
    toast.info("Функция оплаты в разработке", {
      description: "Скоро вы сможете оформить PRO подписку",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} userName={userName} />;
      case "coach":
        return <CoachPage />;
      case "resume":
        return <ResumePage />;
      case "jobs":
        return <JobsPage />;
      case "mentors":
        return <MentorsPage />;
      case "profile":
        return (
          <ProfilePage
            userName={userName}
            credits={credits}
            isPro={isPro}
            onUpgrade={handleUpgrade}
          />
        );
      default:
        return <HomePage onNavigate={setActiveTab} userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header credits={credits} isPro={isPro} onUpgrade={handleUpgrade} />
      
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
