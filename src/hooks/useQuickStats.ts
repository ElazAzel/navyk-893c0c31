import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuickStats {
  coursesCompleted: number;
  coursesEnrolled: number;
  eventsAttended: number;
  totalHoursLearned: number;
  jobsApplied: number;
}

export const useQuickStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<QuickStats>({
    coursesCompleted: 0,
    coursesEnrolled: 0,
    eventsAttended: 0,
    totalHoursLearned: 0,
    jobsApplied: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  const loadStats = async () => {
    try {
      const [enrollments, events, jobs] = await Promise.all([
        supabase
          .from("course_enrollments")
          .select("*, courses(duration_hours)")
          .eq("user_id", userId),
        supabase
          .from("event_registrations")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "attended"),
        supabase
          .from("job_applications")
          .select("*")
          .eq("user_id", userId),
      ]);

      const completedCourses = enrollments.data?.filter((e) => e.completed) || [];
      const totalHours = completedCourses.reduce((sum, e: any) => {
        return sum + (e.courses?.duration_hours || 0);
      }, 0);

      setStats({
        coursesCompleted: completedCourses.length,
        coursesEnrolled: enrollments.data?.length || 0,
        eventsAttended: events.data?.length || 0,
        totalHoursLearned: totalHours,
        jobsApplied: jobs.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
};
