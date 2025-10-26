import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Video, Ticket, Bookmark, Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useBookmarks } from '@/hooks/useBookmarks';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { RatingDialog } from '@/components/RatingDialog';
import { useGamification } from '@/hooks/useGamification';

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
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const { isBookmarked, toggleBookmark } = useBookmarks(user?.id);
  const { updateQuestProgress } = useGamification();

  useEffect(() => {
    loadEvents();
    if (user) {
      loadRegistrations();
    }
  }, [user]);

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

  const loadRegistrations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.event_id === eventId);
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
        
        // Award XP for registering
        await updateQuestProgress('register_event', 1);
        
        await loadEvents();
        await loadRegistrations();
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
    const matchesType = !filters.type || event.event_type === filters.type;
    const matchesFormat = !filters.format || 
      (filters.format === 'online' && event.is_online) ||
      (filters.format === 'offline' && !event.is_online);
    
    return matchesSearch && matchesType && matchesFormat;
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
      <SearchAndFilter
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        placeholder="Поиск мероприятий..."
        filterOptions={[
          {
            label: "Тип",
            key: "type",
            options: [
              { value: "webinar", label: "Вебинары" },
              { value: "workshop", label: "Воркшопы" },
              { value: "meetup", label: "Митапы" },
              { value: "conference", label: "Конференции" },
              { value: "hackathon", label: "Хакатоны" },
            ],
          },
          {
            label: "Формат",
            key: "format",
            options: [
              { value: "online", label: "Онлайн" },
              { value: "offline", label: "Оффлайн" },
            ],
          },
        ]}
      />

      {/* Events List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredEvents.map((event) => {
          const isFull = event.max_participants && event.current_participants >= event.max_participants;
          const registered = isRegistered(event.id);
          
          return (
            <Card key={event.id} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex gap-2 flex-wrap">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark('event', event.id);
                    }}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked('event', event.id)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
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

                <div className="flex items-center justify-between pt-2 gap-2">
                  <div className="text-lg sm:text-xl font-bold">
                    {event.price === 0 ? (
                      <span className="text-green-500">Бесплатно</span>
                    ) : (
                      `${event.price.toLocaleString()}₸`
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {registered && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setRatingDialogOpen(true);
                        }}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Оценить
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleRegister(event.id)}
                      disabled={isFull || registered}
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Ticket className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                      {isFull ? 'Мест нет' : registered ? 'Зарегистрирован' : 'Регистрация'}
                    </Button>
                  </div>
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

      {selectedEvent && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          contentType="event"
          contentId={selectedEvent.id}
          title={selectedEvent.title}
        />
      )}
    </div>
  );
};

export default EventsPage;
