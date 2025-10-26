/**
 * Performance Monitoring Utilities
 * 
 * Provides tools to measure and track application performance.
 * Can be integrated with services like Web Vitals, Lighthouse, etc.
 */

import { logger } from './logger';

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T | Promise<T>,
  context?: Record<string, any>
): T | Promise<T> {
  const startTime = performance.now();
  
  const result = fn();
  
  // Handle async functions
  if (result instanceof Promise) {
    return result.then((value) => {
      logger.performance(label, startTime, context);
      return value;
    }).catch((error) => {
      logger.performance(`${label} (failed)`, startTime, context);
      throw error;
    }) as Promise<T>;
  }
  
  // Sync function
  logger.performance(label, startTime, context);
  return result;
}

/**
 * Create a performance marker
 */
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure performance between two markers
 */
export function measureBetweenMarks(
  name: string,
  startMark: string,
  endMark: string
) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      logger.info(`Performance measure: ${name} = ${measure.duration.toFixed(2)}ms`);
    } catch (error) {
      logger.warn(`Failed to measure performance: ${name}`, { error });
    }
  }
}

/**
 * Monitor component render time
 */
export function useRenderPerformance(componentName: string) {
  if (import.meta.env.DEV) {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      if (duration > 16) { // Slower than 60fps
        logger.warn(`Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  return () => {}; // Noop in production
}

/**
 * Monitor API request performance
 */
export async function monitorApiRequest<T>(
  endpoint: string,
  request: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await request();
    const duration = performance.now() - startTime;
    
    logger.info(`API Request: ${endpoint} completed in ${duration.toFixed(2)}ms`);
    
    // Warn if request is slow
    if (duration > 1000) {
      logger.warn(`Slow API request: ${endpoint} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error(`API Request failed: ${endpoint} after ${duration.toFixed(2)}ms`, error as Error);
    throw error;
  }
}

/**
 * Report Web Vitals
 * Integration point for Core Web Vitals monitoring
 */
export function reportWebVitals(metric: any) {
  logger.info('Web Vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
  });
  
  // TODO: Send to analytics service
  // analytics.track('web_vital', metric);
}

/**
 * Monitor memory usage (development only)
 */
export function monitorMemoryUsage() {
  if (import.meta.env.DEV && 'memory' in performance) {
    const memory = (performance as any).memory;
    logger.debug('Memory usage', {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
}
