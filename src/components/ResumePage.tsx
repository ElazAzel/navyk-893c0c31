import { FileText, Plus, Download, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const ResumePage = () => {
  const { toast } = useToast();
  
  const handleCreateResume = () => {
    toast({
      title: "Создание резюме",
      description: "Функция в разработке. Скоро вы сможете создавать резюме с помощью AI",
    });
  };

  const handleViewResume = (title: string) => {
    toast({
      title: "Просмотр резюме",
      description: `Открывается резюме "${title}"...`,
    });
  };

  const handleDownloadResume = (title: string) => {
    toast({
      title: "Загрузка резюме",
      description: `Резюме "${title}" готово к скачиванию`,
    });
  };
  const resumes = [
    {
      id: 1,
      title: "Software Developer",
      updatedAt: "2 дня назад",
      completeness: 90,
      status: "active"
    },
    {
      id: 2,
      title: "Junior Product Manager",
      updatedAt: "1 неделю назад",
      completeness: 75,
      status: "draft"
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Мои резюме</h1>
          <p className="text-sm text-muted-foreground">
            Создавайте и управляйте своими резюме
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90 text-white"
          onClick={handleCreateResume}
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать
        </Button>
      </div>

      {/* Create New Resume Card */}
      <Card 
        className="border-2 border-dashed border-primary/30 bg-gradient-card hover:border-primary/50 transition-base cursor-pointer"
        onClick={handleCreateResume}
      >
        <CardContent className="pt-6 text-center py-12">
          <div className="bg-gradient-primary inline-flex p-4 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Создать новое резюме</h3>
          <p className="text-sm text-muted-foreground mb-4">
            AI поможет вам составить профессиональное резюме за несколько минут
          </p>
          <Button variant="outline" size="lg" onClick={(e) => {
            e.stopPropagation();
            handleCreateResume();
          }}>
            Начать с нуля
          </Button>
        </CardContent>
      </Card>

      {/* Existing Resumes */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold px-1">Ваши резюме</h2>
        
        {resumes.map((resume) => (
          <Card key={resume.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{resume.title}</CardTitle>
                    <Badge 
                      variant={resume.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {resume.status === "active" ? "Активно" : "Черновик"}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Обновлено {resume.updatedAt}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewResume(resume.title)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadResume(resume.title)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Заполнено</span>
                  <span className="font-semibold">{resume.completeness}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-primary h-full transition-all"
                    style={{ width: `${resume.completeness}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-primary">💡</span>
            Советы по резюме
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Используйте конкретные цифры и достижения</li>
            <li>• Адаптируйте резюме под каждую вакансию</li>
            <li>• Проверяйте грамматику и опечатки</li>
            <li>• Выделяйте ключевые навыки и технологии</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePage;
