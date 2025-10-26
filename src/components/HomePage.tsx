import { Brain, FileText, Briefcase, Users, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Добро пожаловать</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Привет, {userName}! 👋
          </h1>
          <p className="text-white/80 mb-6 max-w-md">
            Давайте построим вашу карьеру вместе. Выберите инструмент и начните свой путь к успеху.
          </p>
          <Button 
            onClick={() => onNavigate("coach")}
            variant="secondary"
            size="lg"
            className="font-semibold"
          >
            <Brain className="mr-2 h-5 w-5" />
            Поговорить с AI Coach
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold gradient-text mb-1">24</div>
            <div className="text-xs text-muted-foreground">Диалогов с AI</div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">3</div>
            <div className="text-xs text-muted-foreground">Резюме создано</div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-2xl font-bold text-accent">85%</span>
            </div>
            <div className="text-xs text-muted-foreground">Прогресс</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold px-1">Инструменты карьеры</h2>
        
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id}
              className="overflow-hidden border-border/50 hover:shadow-md transition-base cursor-pointer"
              onClick={() => onNavigate(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-2xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="sm" className="font-medium">
                    {feature.action} →
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-accent border-0 text-white">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Готовы к карьерному росту?</h3>
          <p className="text-white/80 text-sm mb-4">
            Получите безлимитный доступ ко всем функциям с PRO подпиской
          </p>
          <Button 
            variant="secondary"
            size="lg"
            className="font-semibold"
            onClick={() => onNavigate("profile")}
          >
            Узнать больше о PRO
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
