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
    <div className="space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold mb-1">Вакансии и стажировки</h1>
        <p className="text-sm text-muted-foreground">
          Найдено {jobs.length} подходящих вакансий
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Поиск по вакансиям..."
          className="pl-10"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="cursor-pointer whitespace-nowrap">
          Все
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
          Стажировки
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
          Удаленно
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
          IT
        </Badge>
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
          Менеджмент
        </Badge>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-base border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-gradient-primary p-3 rounded-xl text-white font-bold text-xl">
                      {job.company[0]}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                      <CardDescription className="font-medium">
                        {job.company}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.postedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline" className="text-success border-success/30">
                      {job.salary}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => handleSaveJob(job.id)}
                >
                  <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Совпадение</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-full rounded-full transition-all"
                        style={{ width: `${job.match}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary">{job.match}%</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 text-white"
                  onClick={() => handleApply(job.id, job.title)}
                >
                  Откликнуться
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Button variant="outline" className="w-full">
        Загрузить еще
      </Button>
    </div>
  );
};

export default JobsPage;
