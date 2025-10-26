import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, BookOpen, Calendar, Briefcase, BarChart3, Award, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminWelcome = () => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Добро пожаловать в админ-панель!</CardTitle>
              <CardDescription className="mt-1">
                У вас есть полный доступ к управлению платформой NAVYK
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ваши возможности:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Создавать и редактировать курсы</li>
                <li>• Управлять мероприятиями</li>
                <li>• Добавлять вакансии</li>
                <li>• Просматривать аналитику</li>
                <li>• Видеть статистику пользователей</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                Защита данных:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Все действия защищены RLS политиками</li>
                <li>• Доступ только у пользователей с ролью admin</li>
                <li>• Автоматическая проверка прав на каждую операцию</li>
                <li>• Безопасное хранение данных</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-500/20 hover:border-blue-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Аналитика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Просматривайте статистику платформы, активность пользователей и тренды
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 hover:border-green-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              Курсы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Создавайте образовательные курсы, управляйте контентом и отслеживайте записи
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 hover:border-purple-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              События
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Организуйте вебинары, воркшопы, митапы и другие мероприятия
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 hover:border-orange-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-500" />
              Вакансии
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Публикуйте вакансии, помогайте пользователям найти работу
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🚀 Быстрый старт</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  1
                </div>
                Просмотрите аналитику
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Перейдите на вкладку "Аналитика" чтобы увидеть текущую статистику платформы
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2
                </div>
                Добавьте контент
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Создайте курсы и мероприятия во вкладках "Курсы" и "События"
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  3
                </div>
                Публикуйте вакансии
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Помогите пользователям найти работу через вкладку "Вакансии"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-yellow-500" />
            Назначение других администраторов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Чтобы назначить администратором другого пользователя, откройте базу данных и выполните:
          </p>
          <code className="block bg-muted p-3 rounded text-xs font-mono">
            SELECT public.make_user_admin('email@example.com');
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Замените email@example.com на email нового администратора
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWelcome;