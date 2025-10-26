import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Rate limiting hook to prevent API abuse
 * @param config Configuration with maxRequests and windowMs
 */
export const useRateLimiting = (config: RateLimitConfig) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<number[]>([]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= config.maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const waitTime = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
      
      toast({
        title: "Слишком много запросов",
        description: `Пожалуйста, подождите ${waitTime} секунд`,
        variant: "destructive",
      });
      
      return false;
    }
    
    // Add current request
    setRequests([...recentRequests, now]);
    return true;
  }, [requests, config, toast]);

  const resetRateLimit = useCallback(() => {
    setRequests([]);
  }, []);

  return {
    checkRateLimit,
    resetRateLimit,
    remainingRequests: Math.max(0, config.maxRequests - requests.length),
  };
};
