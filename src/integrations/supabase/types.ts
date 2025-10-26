export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          code: string
          created_at: string
          credits_reward: number
          description: string
          icon: string
          id: string
          name: string
          xp_reward: number
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          credits_reward?: number
          description: string
          icon: string
          id?: string
          name: string
          xp_reward?: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          credits_reward?: number
          description?: string
          icon?: string
          id?: string
          name?: string
          xp_reward?: number
        }
        Relationships: []
      }
      ai_chat_sessions: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          credits_total: number
          id: string
          last_refill_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          credits_total?: number
          id?: string
          last_refill_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          credits_total?: number
          id?: string
          last_refill_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sessions: {
        Row: {
          coach_type: Database["public"]["Enums"]["coach_type"]
          created_at: string
          credits_used: number
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          coach_type: Database["public"]["Enums"]["coach_type"]
          created_at?: string
          credits_used?: number
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          coach_type?: Database["public"]["Enums"]["coach_type"]
          created_at?: string
          credits_used?: number
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_payments: {
        Row: {
          amount_paid: number
          booking_id: string
          created_at: string
          id: string
          payment_status: string | null
          stripe_payment_id: string | null
        }
        Insert: {
          amount_paid: number
          booking_id: string
          created_at?: string
          id?: string
          payment_status?: string | null
          stripe_payment_id?: string | null
        }
        Update: {
          amount_paid?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "mentor_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string
          duration_hours: number
          id: string
          instructor_avatar: string | null
          instructor_name: string
          is_published: boolean | null
          lessons_count: number | null
          level: string
          price: number
          rating: number | null
          students_count: number | null
          tags: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration_hours: number
          id?: string
          instructor_avatar?: string | null
          instructor_name: string
          is_published?: boolean | null
          lessons_count?: number | null
          level: string
          price?: number
          rating?: number | null
          students_count?: number | null
          tags?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration_hours?: number
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string
          is_published?: boolean | null
          lessons_count?: number | null
          level?: string
          price?: number
          rating?: number | null
          students_count?: number | null
          tags?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          code: string
          created_at: string
          credits_reward: number
          description: string
          id: string
          name: string
          quest_type: string
          required_count: number
          xp_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          credits_reward?: number
          description: string
          id?: string
          name: string
          quest_type: string
          required_count?: number
          xp_reward?: number
        }
        Update: {
          code?: string
          created_at?: string
          credits_reward?: number
          description?: string
          id?: string
          name?: string
          quest_type?: string
          required_count?: number
          xp_reward?: number
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended_at: string | null
          event_id: string
          id: string
          registered_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          attended_at?: string | null
          event_id: string
          id?: string
          registered_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          attended_at?: string | null
          event_id?: string
          id?: string
          registered_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string
          end_date: string
          event_type: string
          id: string
          is_online: boolean | null
          is_published: boolean | null
          location: string | null
          max_participants: number | null
          meeting_url: string | null
          organizer_avatar: string | null
          organizer_name: string
          price: number | null
          start_date: string
          tags: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description: string
          end_date: string
          event_type: string
          id?: string
          is_online?: boolean | null
          is_published?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          organizer_avatar?: string | null
          organizer_name: string
          price?: number | null
          start_date: string
          tags?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          is_online?: boolean | null
          is_published?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          organizer_avatar?: string | null
          organizer_name?: string
          price?: number | null
          start_date?: string
          tags?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string
          created_at: string
          id: string
          job_id: string
          resume_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id: string
          resume_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id?: string
          resume_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          external_url: string | null
          hh_id: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          posted_at: string
          requirements: Json | null
          salary_max: number | null
          salary_min: number | null
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          hh_id?: string | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          posted_at?: string
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          hh_id?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
          posted_at?: string
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          amount_paid: number | null
          created_at: string
          duration_minutes: number
          id: string
          meeting_url: string | null
          mentor_id: string
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentor_id: string
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentor_id?: string
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          company: string
          created_at: string
          experience_years: number
          expertise: Json | null
          id: string
          is_available: boolean
          rate_per_hour: number
          rating: number | null
          role_title: string
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          experience_years: number
          expertise?: Json | null
          id?: string
          is_available?: boolean
          rate_per_hour: number
          rating?: number | null
          role_title: string
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          experience_years?: number
          expertise?: Json | null
          id?: string
          is_available?: boolean
          rate_per_hour?: number
          rating?: number | null
          role_title?: string
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string
          google_connected: boolean | null
          id: string
          location: string | null
          phone: string | null
          phone_verified: boolean | null
          profile_visibility: string | null
          show_in_leaderboard: boolean | null
          telegram_id: number | null
          telegram_username: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name: string
          google_connected?: boolean | null
          id: string
          location?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          profile_visibility?: string | null
          show_in_leaderboard?: boolean | null
          telegram_id?: number | null
          telegram_username?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string
          google_connected?: boolean | null
          id?: string
          location?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          profile_visibility?: string | null
          show_in_leaderboard?: boolean | null
          telegram_id?: number | null
          telegram_username?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          completeness: number
          content: Json
          created_at: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completeness?: number
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completeness?: number
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          started_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          started_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          started_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_verification_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          telegram_id: number
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          telegram_id: number
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          telegram_id?: number
          used?: boolean | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          quest_date: string
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_date?: string
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          quest_date?: string
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_daily_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string
          current_xp: number
          id: string
          level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_xp?: number
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_xp?: number
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          achievements_count: number
          ai_sessions_count: number
          created_at: string
          id: string
          jobs_applied_count: number
          mentor_sessions_count: number
          resumes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_count?: number
          ai_sessions_count?: number
          created_at?: string
          id?: string
          jobs_applied_count?: number
          mentor_sessions_count?: number
          resumes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_count?: number
          ai_sessions_count?: number
          created_at?: string
          id?: string
          jobs_applied_count?: number
          mentor_sessions_count?: number
          resumes_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_login_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          achievements_count: number | null
          anonymous_id: string | null
          full_name: string | null
          level: number | null
          rank: number | null
          total_score: number | null
          total_xp: number | null
        }
        Relationships: []
      }
      leaderboard_secure: {
        Row: {
          achievements_count: number | null
          full_name: string | null
          level: number | null
          rank: number | null
          total_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_credits: {
        Args: { _amount: number; _user_id: string }
        Returns: undefined
      }
      add_xp_to_user: {
        Args: { _user_id: string; _xp_amount: number }
        Returns: undefined
      }
      cleanup_expired_verification_codes: { Args: never; Returns: undefined }
      deduct_credits: {
        Args: { _amount: number; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "mentor"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      coach_type: "arif" | "rau" | "aza"
      job_type: "internship" | "full_time" | "part_time" | "contract"
      subscription_tier: "free" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "mentor"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      coach_type: ["arif", "rau", "aza"],
      job_type: ["internship", "full_time", "part_time", "contract"],
      subscription_tier: ["free", "pro", "enterprise"],
    },
  },
} as const
