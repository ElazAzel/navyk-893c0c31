import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BookOpen, Calendar, Briefcase, Users, BarChart3, UserCog } from "lucide-react";
import CourseManagement from "./CourseManagement";
import EventManagement from "./EventManagement";
import JobManagement from "./JobManagement";
import UserAnalytics from "./UserAnalytics";
import AdminWelcome from "./AdminWelcome";
import RoleManagement from "./RoleManagement";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-muted-foreground">Управление контентом и аналитика</p>
        </div>
      </div>

      <Tabs defaultValue="welcome" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="welcome" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Главная</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Роли</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Аналитика</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Курсы</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">События</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Вакансии</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="welcome">
          <AdminWelcome />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <UserAnalytics />
        </TabsContent>

        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>

        <TabsContent value="events">
          <EventManagement />
        </TabsContent>

        <TabsContent value="jobs">
          <JobManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
