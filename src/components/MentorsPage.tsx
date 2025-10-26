import { Calendar, Star, Video, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MentorsPage = () => {
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
    <div className="space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold mb-1">Менторы</h1>
        <p className="text-sm text-muted-foreground">
          Забронируйте консультацию с опытными экспертами
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Как это работает?</h3>
              <p className="text-sm text-muted-foreground">
                Выберите ментора, забронируйте удобное время и получите персональную консультацию 
                по видеосвязи. Первая сессия бесплатна для PRO пользователей.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors List */}
      <div className="space-y-4">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 bg-gradient-primary text-white text-xl font-bold">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg mb-1">{mentor.name}</CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {mentor.role}
                      </CardDescription>
                      <CardDescription className="text-sm">
                        {mentor.company} • {mentor.experience}
                      </CardDescription>
                    </div>
                    
                    {mentor.available && (
                      <Badge variant="outline" className="text-success border-success/30">
                        Доступен
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{mentor.rating}</span>
                    </span>
                    <span>•</span>
                    <span>{mentor.sessions} сессий</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold gradient-text">
                    {mentor.rate}
                  </span>
                  <span className="text-sm text-muted-foreground">/ час</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!mentor.available}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Написать
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90 text-white"
                    disabled={!mentor.available}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Забронировать
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Become Mentor CTA */}
      <Card className="bg-gradient-accent border-0 text-white">
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-bold mb-2">Хотите стать ментором?</h3>
          <p className="text-white/80 text-sm mb-4">
            Делитесь опытом и зарабатывайте, помогая другим в карьерном развитии
          </p>
          <Button variant="secondary" size="lg" className="font-semibold">
            Подать заявку
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorsPage;
