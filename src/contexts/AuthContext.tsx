import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setSession(session);
        setUser(session.user ?? null);
        setLoading(false);
        // persist a lightweight copy for manual restore if needed
        try {
          const save = {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: (session.expires_at ?? null),
          };
          localStorage.setItem('navyk_saved_session', JSON.stringify(save));
        } catch (e) {
          // ignore storage errors
        }
      } else {
        // Try manual restore: if supabase didn't restore but we have saved tokens
        try {
          const raw = localStorage.getItem('navyk_saved_session');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.access_token || parsed?.refresh_token) {
              // attempt to set session from saved tokens
              await supabase.auth.setSession({
                access_token: parsed.access_token || undefined,
                refresh_token: parsed.refresh_token || undefined,
              });

              const { data: { session: restored } } = await supabase.auth.getSession();
              setSession(restored);
              setUser(restored?.user ?? null);
            }
          }
        } catch (e) {
          // ignore restore errors
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "Ошибка регистрации",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Добро пожаловать!",
          description: "Регистрация прошла успешно",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Ошибка входа",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "С возвращением!",
          description: "Вы успешно вошли в систему",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      try {
        localStorage.removeItem('navyk_saved_session');
      } catch (e) {
        // ignore
      }
      toast({
        title: "До встречи!",
        description: "Вы вышли из системы",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
