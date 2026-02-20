/**
 * Analytics service for tracking user events
 * Supports Google Analytics 4 and can be extended for Mixpanel
 */

const ANALYTICS_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

type EventCategory = 'auth' | 'navigation' | 'dashboard' | 'transaction' | 'settings' | 'error';

interface EventParams {
  category?: EventCategory;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
}

class Analytics {
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    // Initialize Google Analytics
    if (ANALYTICS_ID) {
      this.initGA();
    }

    // Initialize Mixpanel
    if (MIXPANEL_TOKEN) {
      this.initMixpanel();
    }

    this.initialized = true;
  }

  private initGA() {
    if (!ANALYTICS_ID) return;

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  private initMixpanel() {
    if (!MIXPANEL_TOKEN) return;

    // Mixpanel initialization would go here
    // For now, we'll use a simple console log fallback
    console.log('[Analytics] Mixpanel token:', MIXPANEL_TOKEN);
  }

  pageView(pageName: string, pagePath: string) {
    if (ANALYTICS_ID && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: pagePath,
      });
    }

    if (MIXPANEL_TOKEN) {
      this.track('page_view', { page: pageName, path: pagePath });
    }
  }

  track(eventName: string, params?: EventParams) {
    if (ANALYTICS_ID && window.gtag) {
      window.gtag('event', eventName, params);
    }

    if (MIXPANEL_TOKEN) {
      console.log('[Analytics] Track:', eventName, params);
    }

    // Always log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, params);
    }
  }

  // Convenience methods for common events
  login(method: 'email' | 'google') {
    this.track('login', { method });
  }

  signup(method: 'email' | 'google') {
    this.track('sign_up', { method });
  }

  logout() {
    this.track('logout');
  }

  viewPage(pageName: string) {
    this.pageView(pageName, window.location.pathname);
  }

  click(buttonName: string, location: string) {
    this.track('button_click', {
      button: buttonName,
      location,
    });
  }

  error(errorType: string, errorMsg: string) {
    this.track('error', {
      category: 'error',
      label: errorType,
      value: 1,
      message: errorMsg,
    });
  }
}

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return analytics;
}
