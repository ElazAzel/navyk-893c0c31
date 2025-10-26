import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Video, Search, Ticket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  organizer_name: string;
  location?: string;
  is_online: boolean;
  start_date: string;
  end_date: string;
  max_participants?: number;
  current_participants: number;
  price: number;
  tags: string[];
}

const EventsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents((data || []).map(event => ({
        ...event,
        tags: (Array.isArray(event.tags) ? event.tags : []) as string[]
      })));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: 'Необходима авторизация',
        description: 'Войдите чтобы зарегистрироваться на мероприятие',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: eventId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Вы уже зарегистрированы',
            description: 'Вы уже записались на это мероприятие',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Успешно! 🎉',
          description: 'Вы зарегистрированы на мероприятие',
        });
        loadEvents(); // Refresh to update participant count
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось зарегистрироваться',
        variant: 'destructive',
      });
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const eventTypeLabels: Record<string, string> = {
    webinar: 'Вебинар',
    workshop: 'Воркшоп',
    meetup: 'Митап',
    conference: 'Конференция',
    hackathon: 'Хакатон'
  };

  const eventTypeColors: Record<string, string> = {
    webinar: 'bg-blue-500/10 text-blue-500',
    workshop: 'bg-purple-500/10 text-purple-500',
    meetup: 'bg-green-500/10 text-green-500',
    conference: 'bg-orange-500/10 text-orange-500',
    hackathon: 'bg-red-500/10 text-red-500'
  };

  if (loading) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка мероприятий...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Мероприятия</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Участвуй в событиях, знакомься с профессионалами 🎯
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск мероприятий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
              <SelectValue placeholder="Тип мероприятия" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="webinar">Вебинары</SelectItem>
              <SelectItem value="workshop">Воркшопы</SelectItem>
              <SelectItem value="meetup">Митапы</SelectItem>
              <SelectItem value="conference">Конференции</SelectItem>
              <SelectItem value="hackathon">Хакатоны</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredEvents.map((event) => {
          const isFull = event.max_participants && event.current_participants >= event.max_participants;
          
          return (
            <Card key={event.id} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`${eventTypeColors[event.event_type]} text-xs`}>
                    {eventTypeLabels[event.event_type]}
                  </Badge>
                  {event.is_online && (
                    <Badge variant="outline" className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Онлайн
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-base sm:text-lg">
                  {event.title}
                </CardTitle>
                
                <CardDescription className="text-xs sm:text-sm">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>
                      {format(new Date(event.start_date), 'd MMMM, HH:mm', { locale: ru })}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.max_participants && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>
                        {event.current_participants} / {event.max_participants} участников
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg sm:text-xl font-bold">
                    {event.price === 0 ? (
                      <span className="text-green-500">Бесплатно</span>
                    ) : (
                      `${event.price.toLocaleString()}₸`
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handleRegister(event.id)}
                    disabled={isFull}
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Ticket className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                    {isFull ? 'Мест нет' : 'Регистрация'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-8 sm:py-12 text-center">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Мероприятия не найдены</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Попробуйте изменить фильтры поиска
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsPage;
