import { useState } from "react";
import CoursesPage from "@/components/CoursesPage";
import CoachPage from "@/components/CoachPage";
import ResumePage from "@/components/ResumePage";
import { cn } from "@/lib/utils";

interface LearningIndexProps {
  initial?: string;
  onNavigate?: (tab: string) => void;
}

const LearningIndex = ({ initial = "courses", onNavigate }: LearningIndexProps) => {
  const [subTab, setSubTab] = useState<string>(initial);

  const renderSub = () => {
    switch (subTab) {
      case "courses":
        return <CoursesPage />;
      case "coach":
        return <CoachPage />;
      case "resume":
        return <ResumePage />;
      default:
        return <CoursesPage />;
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSubTab("courses")}
          className={cn("px-3 py-1 rounded-md", subTab === "courses" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Курсы
        </button>
        <button
          onClick={() => setSubTab("coach")}
          className={cn("px-3 py-1 rounded-md", subTab === "coach" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Коуч
        </button>
        <button
          onClick={() => setSubTab("resume")}
          className={cn("px-3 py-1 rounded-md", subTab === "resume" ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          Резюме
        </button>
      </div>

      <div>{renderSub()}</div>
    </div>
  );
};

export default LearningIndex;
