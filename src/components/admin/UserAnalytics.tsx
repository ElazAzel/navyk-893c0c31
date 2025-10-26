import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, BookOpen, Calendar, Briefcase, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEvents: 0,
    totalJobs: 0,
    totalEnrollments: 0,
    totalEventRegistrations: 0,
    totalJobApplications: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Load total counts
    const [
      { count: userCount },
      { count: courseCount },
      { count: eventCount },
      { count: jobCount },
      { count: enrollmentCount },
      { count: eventRegCount },
      { count: jobAppCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }),
      supabase.from("course_enrollments").select("*", { count: "exact", head: true }),
      supabase.from("event_registrations").select("*", { count: "exact", head: true }),
      supabase.from("job_applications").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalUsers: userCount || 0,
      totalCourses: courseCount || 0,
      totalEvents: eventCount || 0,
      totalJobs: jobCount || 0,
      totalEnrollments: enrollmentCount || 0,
      totalEventRegistrations: eventRegCount || 0,
      totalJobApplications: jobAppCount || 0,
    });

    // Load recent users
    const { data: users } = await supabase
      .from("profiles")
      .select("full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentUsers(users || []);

    // Load top users by level
    const { data: topLevels } = await supabase
      .from("leaderboard_secure")
      .select("*")
      .limit(10);

    setTopUsers(topLevels || []);
  };

  const statCards = [
    { title: "Всего пользователей", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Курсы", value: stats.totalCourses, icon: BookOpen, color: "text-green-500" },
    { title: "События", value: stats.totalEvents, icon: Calendar, color: "text-purple-500" },
    { title: "Вакансии", value: stats.totalJobs, icon: Briefcase, color: "text-orange-500" },
    { title: "Записей на курсы", value: stats.totalEnrollments, icon: TrendingUp, color: "text-cyan-500" },
    { title: "Регистраций на события", value: stats.totalEventRegistrations, icon: Calendar, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние пользователи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ пользователей по уровню</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Позиция</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Уровень</TableHead>
                    <TableHead>XP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell className="font-bold">#{user.rank}</TableCell>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.level}</TableCell>
                      <TableCell>{user.total_xp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalytics;
