import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  BookOpen,
  Calendar,
  Briefcase,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BookmarksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const { data: bookmarksData, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setBookmarks(bookmarksData || []);

      // Load related content
      const courseIds = bookmarksData
        ?.filter((b) => b.content_type === "course")
        .map((b) => b.content_id) || [];
      const eventIds = bookmarksData
        ?.filter((b) => b.content_type === "event")
        .map((b) => b.content_id) || [];
      const jobIds = bookmarksData
        ?.filter((b) => b.content_type === "job")
        .map((b) => b.content_id) || [];

      if (courseIds.length > 0) {
        const { data: coursesData } = await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds);
        setCourses(coursesData || []);
      }

      if (eventIds.length > 0) {
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .in("id", eventIds);
        setEvents(eventsData || []);
      }

      if (jobIds.length > 0) {
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .in("id", jobIds);
        setJobs(jobsData || []);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить закладки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const removeBookmark = async (contentType: string, contentId: string) => {
    try {
      const bookmark = bookmarks.find(
        (b) => b.content_type === contentType && b.content_id === contentId
      );
      
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) throw error;

      toast({
        title: "Удалено",
        description: "Закладка удалена",
      });

      loadBookmarks();
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить закладку",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user, loadBookmarks]);

  if (loading) {
    return (
      <div className="text-center py-8 text-sm sm:text-base">
        Загрузка закладок...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Закладки</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Сохраненные курсы, события и вакансии 🔖
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            Все ({bookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-xs sm:text-sm">
            Курсы ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs sm:text-sm">
            События ({events.length})
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs sm:text-sm">
            Вакансии ({jobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 sm:space-y-4">
          {bookmarks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Нет закладок</h3>
                <p className="text-sm text-muted-foreground">
                  Сохраняйте интересные материалы для быстрого доступа
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {courses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Курсы
                  </h3>
                  {courses.map((course) => (
                    <Card key={course.id} className="border-border/50">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">
                              {course.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {course.instructor_name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeBookmark("course", course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {events.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    События
                  </h3>
                  {events.map((event) => (
                    <Card key={event.id} className="border-border/50">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">
                              {event.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {event.organizer_name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeBookmark("event", event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {jobs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Вакансии
                  </h3>
                  {jobs.map((job) => (
                    <Card key={job.id} className="border-border/50">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">
                              {job.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {job.company} • {job.location}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeBookmark("job", job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-3">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Нет сохраненных курсов
                </h3>
                <p className="text-sm text-muted-foreground">
                  Сохраняйте интересные курсы для изучения позже
                </p>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="border-border/50">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mb-1">
                        {course.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mb-2">
                        {course.instructor_name} • {course.duration_hours} часов
                      </p>
                      <p className="text-sm font-semibold text-accent">
                        {course.price === 0
                          ? "Бесплатно"
                          : `${course.price.toLocaleString()}₸`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeBookmark("course", course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-3">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Нет сохраненных событий
                </h3>
                <p className="text-sm text-muted-foreground">
                  Сохраняйте интересные события чтобы не пропустить
                </p>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="border-border/50">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.event_type}
                        </Badge>
                        {event.is_online && (
                          <Badge variant="outline" className="text-xs">
                            Онлайн
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base mb-1">
                        {event.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mb-2">
                        {event.organizer_name} •{" "}
                        {new Date(event.start_date).toLocaleDateString("ru-RU")}
                      </p>
                      <p className="text-sm font-semibold text-accent">
                        {event.price === 0
                          ? "Бесплатно"
                          : `${event.price.toLocaleString()}₸`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeBookmark("event", event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-3">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Нет сохраненных вакансий
                </h3>
                <p className="text-sm text-muted-foreground">
                  Сохраняйте интересные вакансии для подачи заявок позже
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="border-border/50">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.job_type}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mb-1">
                        {job.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mb-2">
                        {job.company} • {job.location}
                      </p>
                      {(job.salary_min || job.salary_max) && (
                        <p className="text-sm font-semibold text-accent">
                          {job.salary_min && job.salary_max
                            ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}₸`
                            : job.salary_min
                            ? `От ${job.salary_min.toLocaleString()}₸`
                            : `До ${job.salary_max.toLocaleString()}₸`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {job.external_url && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a
                            href={job.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeBookmark("job", job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookmarksPage;
