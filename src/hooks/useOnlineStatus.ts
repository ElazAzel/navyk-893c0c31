import { useState, useEffect } from 'react';
import { isOnline as checkOnline } from '@/lib/serviceWorkerRegistration';
import { logger } from '@/lib/logger';

/**
 * Hook to track online/offline status
 * 
 * @returns {boolean} isOnline - current connection status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(checkOnline());

  useEffect(() => {
    const handleOnline = () => {
      logger.info('Device is online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      logger.warn('Device is offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
