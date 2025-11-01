import React, { useState } from "react";
import JobsPage from "@/components/JobsPage";
import EventsPage from "@/components/EventsPage";
import { cn } from "@/lib/utils";

const JobsIndex: React.FC = () => {
  const [sub, setSub] = useState<string>("jobs");

  const renderSub = () => {
    switch (sub) {
      case "jobs":
        return <JobsPage />;
      case "events":
        return <EventsPage />;
      default:
        return <JobsPage />;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setSub("jobs")} className={cn("px-3 py-1 rounded-md", sub === "jobs" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          Вакансии
        </button>
        <button onClick={() => setSub("events")} className={cn("px-3 py-1 rounded-md", sub === "events" ? "bg-primary text-primary-foreground" : "bg-muted")}>
          События
        </button>
      </div>
      <div>{renderSub()}</div>
    </div>
  );
};

export default JobsIndex;
