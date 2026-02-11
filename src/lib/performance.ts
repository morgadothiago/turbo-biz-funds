import { useEffect } from "react";

export function useRoutePreload(route: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [route]);
}

export function preloadAuthPages() {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/dashboard';
    document.head.appendChild(link);
  }
}

export function initializePerformanceMonitoring() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
        }
        if (entry.entryType === 'first-input') {
          console.log(`FID: ${entry.startTime.toFixed(2)}ms`);
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log(`CLS: ${(entry as any).value.toFixed(4)}`);
        }
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'first-input', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });

    return () => observer.disconnect();
  }
}

export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'FCP':
      console.log(`FCP: ${metric.value}`);
      break;
    case 'LCP':
      console.log(`LCP: ${metric.value}`);
      break;
    case 'FID':
      console.log(`FID: ${metric.value}`);
      break;
    case 'CLS':
      console.log(`CLS: ${metric.value}`);
      break;
    case 'TTFB':
      console.log(`TTFB: ${metric.value}`);
      break;
  }
}

export function optimizeImages() {
  if (typeof window === 'undefined') return;
  
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });
}

interface PerformanceResult<T> {
  result: T;
  duration: number;
  operation: string;
  error?: Error;
}

export async function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>
): Promise<PerformanceResult<T>> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration, operation };
  } catch (error) {
    const duration = performance.now() - start;
    return { result: null as T, duration, operation, error: error as Error };
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: { leading?: boolean }
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let called = false;

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (options?.leading && !called) {
      fn.apply(this, args);
      called = true;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (!options?.leading || called) {
        if (lastArgs) {
          fn.apply(this, lastArgs);
        }
      }
      called = false;
      timeoutId = null;
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs && !inThrottle) {
          fn.apply(this, lastArgs);
        }
      }, limit);
    }
  };
}

interface ChunkedProcessorOptions {
  chunkSize?: number;
  delayMs?: number;
}

export function createChunkedProcessor<T>(
  processor: (item: T) => Promise<void>,
  options: ChunkedProcessorOptions = {}
): (items: T[]) => Promise<void> {
  const { chunkSize = 10, delayMs = 0 } = options;

  return async function (items: T[]): Promise<void> {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await Promise.all(chunk.map((item) => processor(item)));
      if (delayMs > 0 && i + chunkSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };
}

export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}_${params[key]}`)
    .join(":");
  return `${prefix}:${sortedParams}`;
}

export async function batchOperations<T>(
  operations: (() => Promise<T>)[],
  options: ChunkedProcessorOptions = {}
): Promise<T[]> {
  const { chunkSize = 5 } = options;
  const results: T[] = [];

  for (let i = 0; i < operations.length; i += chunkSize) {
    const chunk = operations.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map((op) => op()));
    results.push(...chunkResults);
  }

  return results;
}
