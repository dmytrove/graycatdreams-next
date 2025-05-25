/**
 * Production monitoring and error tracking utilities
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: number;
  [key: string]: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

class ProductionMonitor {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private errorQueue: Array<{ error: Error; context?: ErrorContext }> = [];
  private metricsQueue: PerformanceMetric[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
      this.setupPerformanceMonitoring();
    }
  }

  private setupGlobalErrorHandlers() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.logError(new Error(event.message), {
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        { type: 'unhandled-promise-rejection' }
      );
    });

    // Start periodic flush
    this.flushInterval = setInterval(() => this.flush(), 30000); // Every 30 seconds
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.logMetric({
          name: 'lcp',
          value: lastEntry.startTime,
          timestamp: performance.now(),
          labels: { metric: 'core-web-vitals' }
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.logMetric({
            name: 'fid',
            value: entry.processingStart - entry.startTime,
            timestamp: performance.now(),
            labels: { metric: 'core-web-vitals' }
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.logMetric({
          name: 'cls',
          value: clsValue,
          timestamp: performance.now(),
          labels: { metric: 'core-web-vitals' }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.logMetric({
            name: 'page_load_time',
            value: perfData.loadEventEnd - perfData.fetchStart,
            timestamp: performance.now(),
            labels: { metric: 'navigation' }
          });
        }
      }, 0);
    });
  }

  logError(error: Error, context?: ErrorContext): void {
    const errorInfo = {
      error,
      context: {
        ...context,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId()
      }
    };

    if (this.isDevelopment) {
      console.error('Production Monitor - Error:', error, context);
    }

    this.errorQueue.push(errorInfo);
    
    // Flush immediately for critical errors
    if (this.isCriticalError(error)) {
      this.flush();
    }
  }

  logMetric(metric: PerformanceMetric): void {
    if (this.isDevelopment) {
      console.log('Production Monitor - Metric:', metric);
    }

    this.metricsQueue.push(metric);
  }

  logCustomEvent(eventName: string, properties?: Record<string, any>): void {
    this.logMetric({
      name: eventName,
      value: 1,
      timestamp: performance.now(),
      labels: properties
    });
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /network/i,
      /security/i,
      /permission/i,
      /webgl/i,
      /three\.js/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }

  private getSessionId(): string | undefined {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => 
        cookie.trim().startsWith('session_id_visible=')
      );
      return sessionCookie ? sessionCookie.split('=')[1] : undefined;
    }
    return undefined;
  }

  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0 && this.metricsQueue.length === 0) {
      return;
    }

    const payload = {
      errors: [...this.errorQueue],
      metrics: [...this.metricsQueue],
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      url: window.location.href
    };

    // Clear queues
    this.errorQueue.length = 0;
    this.metricsQueue.length = 0;

    try {
      // In production, send to your monitoring service
      if (!this.isDevelopment) {
        // Example: Send to monitoring API
        // await fetch('/api/monitoring', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        
        console.log('Would send monitoring data:', payload);
      }
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
      // Re-queue errors for next flush attempt
      if (payload.errors.length > 0) {
        this.errorQueue.push(...payload.errors);
      }
    }
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    // Final flush
    this.flush();
  }
}

// Create singleton instance
const monitor = new ProductionMonitor();

// Export convenient functions
export function logError(error: Error, context?: ErrorContext): void {
  monitor.logError(error, context);
}

export function logPerformance(name: string, duration: number, labels?: Record<string, string>): void {
  monitor.logMetric({
    name,
    value: duration,
    timestamp: performance.now(),
    labels
  });
}

export function logCustomEvent(eventName: string, properties?: Record<string, any>): void {
  monitor.logCustomEvent(eventName, properties);
}

// Performance timing helper
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  logPerformance(name, duration);
  return result;
}

// Async performance timing helper
export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  logPerformance(name, duration);
  return result;
}

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    monitor.destroy();
  });
}

export default monitor;
