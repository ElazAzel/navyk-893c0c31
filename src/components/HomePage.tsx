import { Brain, FileText, Briefcase, Users, Sparkles, Trophy, BookOpen, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickStatsCard } from "@/components/QuickStatsCard";

interface HomePageProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

const HomePage = ({ onNavigate, userName }: HomePageProps) => {
  const features = [
    {
      id: "coach",
      icon: Brain,
      title: "AI Career Coach",
      description: "Персональный AI-наставник для вашей карьеры",
      gradient: "from-primary to-blue-500",
      action: "Начать чат"
    },
    {
      id: "courses",
      icon: BookOpen,
      title: "Курсы",
      description: "Обучайся у лучших экспертов индустрии",
      gradient: "from-indigo-500 to-purple-500",
      action: "Смотреть курсы"
    },
    {
      id: "events",
      icon: Calendar,
      title: "Мероприятия",
      description: "Участвуй в митапах, воркшопах и хакатонах",
      gradient: "from-pink-500 to-rose-500",
      action: "Найти событие"
    },
    {
      id: "resume",
      icon: FileText,
      title: "Resume Builder",
      description: "Создайте профессиональное резюме за минуты",
      gradient: "from-accent to-orange-500",
      action: "Создать резюме"
    },
    {
      id: "jobs",
      icon: Briefcase,
      title: "Job Finder",
      description: "Найдите стажировки и вакансии, подходящие вам",
      gradient: "from-success to-emerald-500",
      action: "Искать вакансии"
    },
    {
      id: "mentors",
      icon: Users,
      title: "Mentorship",
      description: "Забронируйте встречу с опытными экспертами",
      gradient: "from-purple-500 to-pink-500",
      action: "Найти ментора"
    },
    {
      id: "gamification",
      icon: Trophy,
      title: "Геймификация",
      description: "Получайте награды и достигайте новых уровней",
      gradient: "from-yellow-500 to-orange-500",
      action: "Смотреть награды"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 px-1">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-primary p-4 sm:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium opacity-90">Добро пожаловать</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Привет, {userName}! 👋
          </h1>
          <p className="text-white/80 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
            Выберите инструмент и начните путь к успеху.
          </p>
          <Button 
            onClick={() => onNavigate("coach")}
            variant="secondary"
            size="default"
            className="font-semibold text-sm sm:text-base"
          >
            <Brain className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            AI Coach
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Quick Stats */}
      <QuickStatsCard />

      {/* Feature Cards */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-bold px-1">Инструменты</h2>
        
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id}
              className="overflow-hidden border-border/50 hover:shadow-md transition-base cursor-pointer"
              onClick={() => onNavigate(feature.id)}
            >
              <CardHeader className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className={`bg-gradient-to-br ${feature.gradient} p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="sm" className="font-medium text-xs sm:text-sm shrink-0">
                    {feature.action} →
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 sm:space-y-2 p-3 pt-0 sm:p-6 sm:pt-0">
                <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-accent border-0 text-white">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 text-center">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Готовы к карьерному росту?</h3>
          <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
            Получите безлимитный доступ ко всем функциям с PRO подпиской
          </p>
          <Button 
            variant="secondary"
            size="default"
            className="font-semibold text-sm sm:text-base"
            onClick={() => onNavigate("profile")}
          >
            Узнать о PRO
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
