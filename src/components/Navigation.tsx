import { useState } from "react";
import { Home, MessageSquare, FileText, Briefcase, Users, User, LogOut, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navItems = [
    { id: "home", icon: Home, label: "Главная" },
    { id: "coach", icon: MessageSquare, label: "AI Coach" },
    { id: "resume", icon: FileText, label: "Резюме" },
    { id: "jobs", icon: Briefcase, label: "Вакансии" },
    { id: "mentors", icon: Users, label: "Менторы" },
    { id: "gamification", icon: Trophy, label: "Награды" },
    { id: "profile", icon: User, label: "Профиль" },
  ];

  const handleLogout = async () => {
    await signOut();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-base px-1",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-base",
                  isActive && "scale-110"
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-base text-destructive hover:text-destructive/80 px-1"
          >
            <LogOut className="h-5 w-5 transition-base" />
            <span className="text-[10px] font-medium">Выход</span>
          </button>
        </div>
      </nav>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Выйти из системы?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти из своего аккаунта?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Выйти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navigation;
