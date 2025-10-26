import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
}

interface UserCredits {
  credits_remaining: number;
  credits_total: number;
}

interface Subscription {
  tier: 'free' | 'pro' | 'enterprise';
  is_active: boolean;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState<UserCredits>({ credits_remaining: 0, credits_total: 0 });
  const [subscription, setSubscription] = useState<Subscription>({ tier: 'free', is_active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('ai_credits')
          .select('credits_remaining, credits_total')
          .eq('user_id', user.id)
          .single();

        if (creditsError) throw creditsError;
        setCredits(creditsData);

        // Fetch subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('tier, is_active')
          .eq('user_id', user.id)
          .single();

        if (subscriptionError) throw subscriptionError;
        setSubscription(subscriptionData);

      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up realtime subscription for credits
    const creditsChannel = supabase
      .channel('ai_credits_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_credits',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setCredits({
            credits_remaining: payload.new.credits_remaining,
            credits_total: payload.new.credits_total,
          });
        }
      )
      .subscribe();

    return () => {
      creditsChannel.unsubscribe();
    };
  }, [user, toast]);

  return {
    profile,
    credits,
    subscription,
    loading,
    isPro: subscription.tier === 'pro' || subscription.tier === 'enterprise',
  };
};
