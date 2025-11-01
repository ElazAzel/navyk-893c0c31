import React, { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import CourseManagement from "@/components/admin/CourseManagement";
import EventManagement from "@/components/admin/EventManagement";
import JobManagement from "@/components/admin/JobManagement";
import RoleManagement from "@/components/admin/RoleManagement";
import { cn } from "@/lib/utils";

const AdminIndex: React.FC = () => {
  const [sub, setSub] = useState<string>("dashboard");

  const renderSub = () => {
    switch (sub) {
      case "dashboard":
        return <AdminDashboard />;
      case "courses":
        return <CourseManagement />;
      case "events":
        return <EventManagement />;
      case "jobs":
        return <JobManagement />;
      case "roles":
        return <RoleManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setSub("dashboard")} className={cn("px-3 py-1 rounded-md", sub === "dashboard" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          Дашборд
        </button>
        <button onClick={() => setSub("courses")} className={cn("px-3 py-1 rounded-md", sub === "courses" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          Курсы
        </button>
        <button onClick={() => setSub("events")} className={cn("px-3 py-1 rounded-md", sub === "events" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          События
        </button>
        <button onClick={() => setSub("jobs")} className={cn("px-3 py-1 rounded-md", sub === "jobs" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          Вакансии
        </button>
        <button onClick={() => setSub("roles")} className={cn("px-3 py-1 rounded-md", sub === "roles" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          Роли
        </button>
      </div>
      <div>{renderSub()}</div>
    </div>
  );
};

export default AdminIndex;
