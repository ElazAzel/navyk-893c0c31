import { Briefcase, MapPin, Clock, Bookmark, ExternalLink, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const JobsPage = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const jobs = [
    {
      id: 1,
      title: "Junior Frontend Developer",
      company: "Kaspi.kz",
      location: "Алматы, Казахстан",
      type: "Стажировка",
      salary: "150,000 - 250,000 ₸",
      postedAt: "2 дня назад",
      tags: ["React", "TypeScript", "CSS"],
      match: 95
    },
    {
      id: 2,
      title: "Product Manager Intern",
      company: "Chocofamily",
      location: "Алматы, Казахстан",
      type: "Стажировка",
      salary: "200,000 - 300,000 ₸",
      postedAt: "3 дня назад",
      tags: ["Product", "Analytics", "Agile"],
      match: 87
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Halyk Bank",
      location: "Астана, Казахстан",
      type: "Полная занятость",
      salary: "300,000 - 450,000 ₸",
      postedAt: "5 дней назад",
      tags: ["Figma", "Design", "Prototyping"],
      match: 82
    }
  ];

  const handleApply = (jobId: number, jobTitle: string) => {
    toast({
      title: "Заявка отправлена!",
      description: `Ваш отклик на вакансию "${jobTitle}" успешно отправлен работодателю`,
    });
  };

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast({
        title: "Удалено из сохраненных",
        description: "Вакансия удалена из избранного",
      });
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast({
        title: "Добавлено в избранное",
        description: "Вакансия сохранена в избранное",
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-20 px-1">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Вакансии и стажировки</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Найдено {jobs.length} подходящих вакансий
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        <Input 
          placeholder="Поиск по вакансиям..."
          className="pl-9 sm:pl-10 text-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <Badge variant="default" className="cursor-pointer whitespace-nowrap text-xs">
          Все
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap text-xs">
          Стажировки
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap text-xs">
          Удаленно
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap text-xs">
          IT
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap text-xs">
          Менеджмент
        </Badge>
      </div>

      {/* Jobs List */}
      <div className="space-y-2 sm:space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <div className="bg-gradient-primary p-2 sm:p-3 rounded-lg sm:rounded-xl text-white font-bold text-base sm:text-xl shrink-0">
                      {job.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-lg mb-0.5 sm:mb-1 leading-tight">{job.title}</CardTitle>
                      <CardDescription className="font-medium text-xs sm:text-sm">
                        {job.company}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.postedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                    <Badge variant="outline" className="text-success border-success/30 text-xs">
                      {job.salary}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => handleSaveJob(job.id)}
                >
                  <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0 p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Совпадение</div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                    <div className="w-16 sm:w-24 bg-secondary rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-primary h-full rounded-full transition-all"
                        style={{ width: `${job.match}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-primary">{job.match}%</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 text-white text-xs sm:text-sm w-full sm:w-auto"
                  onClick={() => handleApply(job.id, job.title)}
                >
                  Откликнуться
                  <ExternalLink className="ml-1.5 sm:ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Button variant="outline" className="w-full text-sm">
        Загрузить еще
      </Button>
    </div>
  );
};

export default JobsPage;
