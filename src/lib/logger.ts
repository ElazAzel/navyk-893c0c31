/**
 * Centralized Logging Utility
 * 
 * Provides structured logging with different severity levels.
 * In production, logs can be sent to external services like Sentry, LogRocket, etc.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  /**
   * Debug logs - only in development
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info logs - general information
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context));
    }
    
    // TODO: Send to analytics service in production
    // if (this.isProduction) {
    //   analyticsService.track(message, context);
    // }
  }

  /**
   * Warning logs - potential issues
   */
  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
    
    // TODO: Send to monitoring service in production
    // if (this.isProduction) {
    //   monitoringService.warn(message, context);
    // }
  }

  /**
   * Error logs - critical issues
   */
  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    
    console.error(this.formatMessage('error', message, errorContext));
    
    // TODO: Send to error tracking service in production
    // if (this.isProduction) {
    //   Sentry.captureException(error, {
    //     extra: context,
    //     tags: { component: context?.component }
    //   });
    // }
  }

  /**
   * Performance tracking
   */
  performance(label: string, startTime: number, context?: LogContext) {
    const duration = performance.now() - startTime;
    this.info(`Performance: ${label} took ${duration.toFixed(2)}ms`, context);
  }

  /**
   * User action tracking
   */
  track(action: string, properties?: Record<string, any>) {
    this.info(`User action: ${action}`, properties);
    
    // TODO: Send to analytics in production
    // if (this.isProduction) {
    //   analytics.track(action, properties);
    // }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience methods
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logPerformance = logger.performance.bind(logger);
export const trackAction = logger.track.bind(logger);
