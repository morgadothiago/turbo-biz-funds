import { Suspense, useState, useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

// Lazy load components below the fold for better performance
const Problem = lazyWithRetry(() => import("@/components/landing/Problem"));
const HowItWorks = lazyWithRetry(() => import("@/components/landing/HowItWorks"));
const WhatsAppConnect = lazyWithRetry(() => import("@/components/landing/WhatsAppConnect"));
const Testimonials = lazyWithRetry(() => import("@/components/landing/Testimonials"));
const Pricing = lazyWithRetry(() => import("@/components/landing/Pricing"));
const FAQ = lazyWithRetry(() => import("@/components/landing/FAQ"));
const Footer = lazyWithRetry(() => import("@/components/landing/Footer"));

// Simple loading fallback that doesn't block rendering
const SectionFallback = ({ height = 400 }: { height?: number }) => (
  <div style={{ minHeight: height }} />
);

// Hook to detect when element is near viewport for lazy loading
const useNearViewport = (options = {}) => {
  const [isNear, setIsNear] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNear) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '200px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, options]);

  return { ref, isNear };
};

// Lazy section wrapper
const LazySection = ({ children, height = 400 }: { children: React.ReactNode; height?: number }) => {
  const { ref, isNear } = useNearViewport();

  return (
    <div ref={ref} style={{ contentVisibility: 'auto', containIntrinsicSize: `0 ${height}px` }}>
      {isNear ? (
        <Suspense fallback={<SectionFallback height={height} />}>
          {children}
        </Suspense>
      ) : (
        <SectionFallback height={height} />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="organizaai-theme">
      <div className="min-h-screen relative" style={{ background: "linear-gradient(to bottom, #030712, #020617 40%, #010409)" }}>
        <Navbar />
        <Hero />

        {/* Lazy load sections below the fold */}
        <LazySection height={500}>
          <Problem />
        </LazySection>

        <LazySection height={600}>
          <HowItWorks />
        </LazySection>

        <LazySection height={600}>
          <WhatsAppConnect />
        </LazySection>

        <LazySection height={700}>
          <Pricing />
        </LazySection>

        <LazySection height={500}>
          <Testimonials />
        </LazySection>

        <LazySection height={400}>
          <FAQ />
        </LazySection>

        <LazySection height={200}>
          <Footer />
        </LazySection>

      </div>
    </ThemeProvider>
  );
};

export default Index;
