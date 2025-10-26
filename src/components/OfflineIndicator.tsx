import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

/**
 * Offline Indicator Component
 * 
 * Shows a banner when the app is offline
 */
export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2">
      <Alert variant="destructive" className="border-2">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Нет подключения к интернету. Некоторые функции могут быть недоступны.
        </AlertDescription>
      </Alert>
    </div>
  );
};
