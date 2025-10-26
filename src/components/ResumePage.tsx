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
    <div className="space-y-3 sm:space-y-4 pb-20 px-1">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">Мои резюме</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Создавайте резюме
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90 text-white shrink-0 text-sm"
          size="sm"
          onClick={handleCreateResume}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Создать</span>
        </Button>
      </div>

      {/* Create New Resume Card */}
      <Card 
        className="border-2 border-dashed border-primary/30 bg-gradient-card hover:border-primary/50 transition-base cursor-pointer"
        onClick={handleCreateResume}
      >
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 text-center py-8 sm:py-12">
          <div className="bg-gradient-primary inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Создать новое резюме</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            AI поможет вам составить профессиональное резюме
          </p>
          <Button variant="outline" size="default" className="text-sm" onClick={(e) => {
            e.stopPropagation();
            handleCreateResume();
          }}>
            Начать с нуля
          </Button>
        </CardContent>
      </Card>

      {/* Existing Resumes */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1">Ваши резюме</h2>
        
        {resumes.map((resume) => (
          <Card key={resume.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                    <CardTitle className="text-sm sm:text-lg">{resume.title}</CardTitle>
                    <Badge 
                      variant={resume.status === "active" ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs"
                    >
                      {resume.status === "active" ? "Активно" : "Черновик"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Обновлено {resume.updatedAt}
                  </CardDescription>
                </div>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => handleViewResume(resume.title)}
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => handleDownloadResume(resume.title)}
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Заполнено</span>
                  <span className="font-semibold">{resume.completeness}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 sm:h-2 overflow-hidden">
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
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="text-primary">💡</span>
            Советы
          </h3>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li>• Используйте конкретные цифры</li>
            <li>• Адаптируйте под вакансию</li>
            <li>• Проверяйте грамматику</li>
            <li>• Выделяйте ключевые навыки</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePage;
