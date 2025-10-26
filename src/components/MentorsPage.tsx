import { Calendar, Star, Video, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const MentorsPage = () => {
  const { toast } = useToast();

  const handleContactMentor = (mentorName: string) => {
    toast({
      title: "Связь с ментором",
      description: `Открывается чат с ${mentorName}...`,
    });
  };

  const handleBookMentor = (mentorName: string, rate: string) => {
    toast({
      title: "Бронирование сессии",
      description: `Бронируется консультация с ${mentorName} (${rate}/час)`,
    });
  };

  const handleApplyMentor = () => {
    toast({
      title: "Заявка на менторство",
      description: "Ваша заявка будет рассмотрена в течение 2-3 рабочих дней",
    });
  };
  const mentors = [
    {
      id: 1,
      name: "Айгуль Нурлыбаева",
      role: "Senior Product Manager",
      company: "Kaspi.kz",
      experience: "8 лет опыта",
      rating: 4.9,
      sessions: 47,
      rate: "5,000 ₸",
      expertise: ["Product Management", "Agile", "Team Leadership"],
      available: true
    },
    {
      id: 2,
      name: "Данияр Ахметов",
      role: "Lead Frontend Developer",
      company: "Kolesa Group",
      experience: "10 лет опыта",
      rating: 5.0,
      sessions: 63,
      rate: "6,000 ₸",
      expertise: ["React", "TypeScript", "System Design"],
      available: true
    },
    {
      id: 3,
      name: "Сауле Токтарова",
      role: "UX Design Lead",
      company: "Chocofamily",
      experience: "7 лет опыта",
      rating: 4.8,
      sessions: 35,
      rate: "4,500 ₸",
      expertise: ["UX Research", "Figma", "Design Systems"],
      available: false
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4 pb-20 px-1">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Менторы</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Забронируйте консультацию с экспертами
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1 text-sm sm:text-base">Как это работает?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Выберите ментора и получите консультацию по видеосвязи. Первая сессия бесплатна для PRO.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors List */}
      <div className="space-y-3 sm:space-y-4">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-start gap-2 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-primary text-white text-base sm:text-xl font-bold shrink-0">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm sm:text-lg mb-0.5 sm:mb-1 leading-tight">{mentor.name}</CardTitle>
                      <CardDescription className="font-medium text-primary text-xs sm:text-sm">
                        {mentor.role}
                      </CardDescription>
                      <CardDescription className="text-xs sm:text-sm">
                        {mentor.company} • {mentor.experience}
                      </CardDescription>
                    </div>
                    
                    {mentor.available && (
                      <Badge variant="outline" className="text-success border-success/30 text-[10px] sm:text-xs shrink-0">
                        Доступен
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{mentor.rating}</span>
                    </span>
                    <span>•</span>
                    <span>{mentor.sessions} сессий</span>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] sm:text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-lg sm:text-2xl font-bold gradient-text">
                    {mentor.rate}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">/ час</span>
                </div>

                <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!mentor.available}
                    className="flex-1 sm:flex-initial text-xs"
                    onClick={() => handleContactMentor(mentor.name)}
                  >
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Написать</span>
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90 text-white flex-1 sm:flex-initial text-xs"
                    disabled={!mentor.available}
                    onClick={() => handleBookMentor(mentor.name, mentor.rate)}
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Забронировать</span>
                    <span className="sm:hidden">Сессия</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Become Mentor CTA */}
      <Card className="bg-gradient-accent border-0 text-white">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">Хотите стать ментором?</h3>
          <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
            Делитесь опытом и зарабатывайте
          </p>
          <Button 
            variant="secondary" 
            size="default" 
            className="font-semibold text-sm"
            onClick={handleApplyMentor}
          >
            Подать заявку
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorsPage;
