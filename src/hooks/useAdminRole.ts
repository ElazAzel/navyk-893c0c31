import { useUserRole } from './useUserRole';

export const useAdminRole = () => {
  const { isAdmin, loading } = useUserRole('admin');
  return { isAdmin, loading };
};
