import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Star, Users, Search, Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  instructor_avatar?: string;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
  rating: number;
  students_count: number;
  lessons_count: number;
  tags: string[];
}

const CoursesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setCourses((data || []).map(course => ({
        ...course,
        tags: (Array.isArray(course.tags) ? course.tags : []) as string[]
      })));
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: 'Необходима авторизация',
        description: 'Войдите чтобы записаться на курс',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Вы уже записаны',
            description: 'Вы уже зарегистрированы на этот курс',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Успешно! 🎉',
          description: 'Вы записались на курс',
        });
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось записаться на курс',
        variant: 'destructive',
      });
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const levelLabels: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  };

  if (loading) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка курсов...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Курсы</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Обучайся у лучших экспертов и развивай свои навыки 📚
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск курсов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Programming">Программирование</SelectItem>
                <SelectItem value="Design">Дизайн</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Mobile">Мобильная разработка</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Уровень" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="beginner">Начальный</SelectItem>
                <SelectItem value="intermediate">Средний</SelectItem>
                <SelectItem value="advanced">Продвинутый</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {levelLabels[course.level]}
                </Badge>
              </div>
              
              <CardTitle className="text-base sm:text-lg line-clamp-2">
                {course.title}
              </CardTitle>
              
              <CardDescription className="text-xs sm:text-sm line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{course.duration_hours}ч</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{course.lessons_count} уроков</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{course.students_count} студентов</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-lg sm:text-xl font-bold">
                  {course.price === 0 ? (
                    <span className="text-green-500">Бесплатно</span>
                  ) : (
                    `${course.price.toLocaleString()}₸`
                  )}
                </div>
                
                <Button 
                  onClick={() => handleEnroll(course.id)}
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                  Записаться
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-8 sm:py-12 text-center">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Курсы не найдены</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Попробуйте изменить фильтры поиска
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesPage;
