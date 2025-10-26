import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Clock, Bookmark, ExternalLink, Star, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { RatingDialog } from "@/components/RatingDialog";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  requirements: string[];
  tags: string[];
  posted_at: string;
  external_url?: string;
}

const JobsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [applications, setApplications] = useState<any[]>([]);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { isBookmarked, toggleBookmark } = useBookmarks(user?.id);

  useEffect(() => {
    loadJobs();
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (error) throw error;
      setJobs(
        (data || []).map((job) => ({
          ...job,
          requirements: (Array.isArray(job.requirements)
            ? job.requirements
            : []) as string[],
          tags: (Array.isArray(job.tags) ? job.tags : []) as string[],
        }))
      );
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const hasApplied = (jobId: string) => {
    return applications.some((a) => a.job_id === jobId);
  };

  const handleApply = async (jobId: string, jobTitle: string) => {
    if (!user) {
      toast({
        title: "Необходима авторизация",
        description: "Войдите чтобы откликнуться на вакансию",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("job_applications").insert({
        user_id: user.id,
        job_id: jobId,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Вы уже откликнулись",
            description: "Ваш отклик уже был отправлен на эту вакансию",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Заявка отправлена! 🎉",
          description: `Ваш отклик на вакансию "${jobTitle}" успешно отправлен`,
        });
        loadApplications();
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отклик",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filters.type || job.job_type === filters.type;
    const matchesLocation =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypeLabels: Record<string, string> = {
    full_time: "Полная занятость",
    part_time: "Частичная занятость",
    internship: "Стажировка",
    contract: "Контракт",
    remote: "Удаленная работа",
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      full_time: "bg-blue-500/10 text-blue-500",
      part_time: "bg-purple-500/10 text-purple-500",
      internship: "bg-green-500/10 text-green-500",
      contract: "bg-orange-500/10 text-orange-500",
      remote: "bg-cyan-500/10 text-cyan-500",
    };
    return colors[type] || "bg-gray-500/10 text-gray-500";
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()}₸`;
    if (min) return `От ${min.toLocaleString()}₸`;
    if (max) return `До ${max.toLocaleString()}₸`;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-sm sm:text-base">
        Загрузка вакансий...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Вакансии</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Найди работу мечты или стажировку 💼
        </p>
      </div>

      {/* Search & Filters */}
      <SearchAndFilter
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        placeholder="Поиск вакансий..."
        filterOptions={[
          {
            label: "Тип занятости",
            key: "type",
            options: [
              { value: "full_time", label: "Полная занятость" },
              { value: "part_time", label: "Частичная занятость" },
              { value: "internship", label: "Стажировка" },
              { value: "contract", label: "Контракт" },
              { value: "remote", label: "Удаленная работа" },
            ],
          },
          {
            label: "Город",
            key: "location",
            options: [
              { value: "Алматы", label: "Алматы" },
              { value: "Астана", label: "Астана" },
              { value: "Шымкент", label: "Шымкент" },
              { value: "Караганда", label: "Караганда" },
            ],
          },
        ]}
      />

      {/* Jobs List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredJobs.map((job) => {
          const applied = hasApplied(job.id);
          const salary = formatSalary(job.salary_min, job.salary_max);

          return (
            <Card
              key={job.id}
              className="border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      <div className="bg-gradient-primary p-2 sm:p-3 rounded-lg sm:rounded-xl text-white font-bold text-base sm:text-xl shrink-0">
                        {job.company[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="font-medium text-xs sm:text-sm">
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {new Date(job.posted_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge
                        className={`${getJobTypeColor(job.job_type)} text-xs`}
                      >
                        {jobTypeLabels[job.job_type]}
                      </Badge>
                      {salary && (
                        <Badge
                          variant="outline"
                          className="text-success border-success/30 text-xs"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          {salary}
                        </Badge>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {job.tags.slice(0, 5).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] sm:text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark("job", job.id);
                    }}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked("job", job.id)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-2">
                    {applied && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setRatingDialogOpen(true);
                        }}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Оценить
                      </Button>
                    )}
                    {job.external_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <a
                          href={job.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Сайт
                        </a>
                      </Button>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleApply(job.id, job.title)}
                    disabled={applied}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                    {applied ? "Отклик отправлен" : "Откликнуться"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-8 sm:py-12 text-center">
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Вакансии не найдены
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Попробуйте изменить фильтры поиска
            </p>
          </CardContent>
        </Card>
      )}

      {selectedJob && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          contentType="job"
          contentId={selectedJob.id}
          title={selectedJob.title}
        />
      )}
    </div>
  );
};

export default JobsPage;
