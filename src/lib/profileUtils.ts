import { supabase } from "@/integrations/supabase/client";

/**
 * SECURITY: Profile Data Protection
 * 
 * This utility provides safe access to user profiles by filtering sensitive
 * contact information (email, phone, telegram_id, telegram_username) when
 * viewing other users' public profiles.
 * 
 * RLS policies allow SELECT on public profiles, but this application-layer
 * filtering ensures sensitive fields are never exposed to unauthorized users.
 * 
 * Always use getPublicProfile() when displaying user profiles to non-owners.
 */

/**
 * Safely queries a public profile, excluding sensitive contact information
 * for profiles that are not owned by the current user
 */
export const getPublicProfile = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === userId;

  // If viewing own profile or not authenticated, get full profile
  if (isOwnProfile) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    return { data, error };
  }

  // For other users' profiles, only return non-sensitive fields
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, bio, location, profile_visibility, show_in_leaderboard, created_at")
    .eq("id", userId)
    .eq("profile_visibility", "public")
    .maybeSingle();

  return { data, error };
};

/**
 * Type for safe public profile (without sensitive fields)
 */
export type SafePublicProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  profile_visibility: string | null;
  show_in_leaderboard: boolean | null;
  created_at: string;
};
