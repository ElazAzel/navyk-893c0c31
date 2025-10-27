import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'moderator' | 'user';

export const useUserRole = (role?: AppRole) => {
  const { user } = useAuth();
  const [hasRole, setHasRole] = useState(false);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setHasRole(false);
        setUserRoles([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const roles = (data || []).map(r => r.role as AppRole);
        setUserRoles(roles);

        if (role) {
          setHasRole(roles.includes(role));
        } else {
          setHasRole(roles.length > 0);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setHasRole(false);
        setUserRoles([]);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user, role]);

  return { hasRole, userRoles, loading, isAdmin: userRoles.includes('admin'), isModerator: userRoles.includes('moderator') };
};
