import { lazy, Suspense, useState, useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BackgroundOrbs from "@/components/landing/BackgroundOrbs";

// Lazy load components below the fold for better performance
const Problem = lazy(() => import("@/components/landing/Problem"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const Pricing = lazy(() => import("@/components/landing/Pricing"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const Footer = lazy(() => import("@/components/landing/Footer"));

// Simple loading fallback that doesn't block rendering
const SectionFallback = () => <div className="min-h-[200px]" />;

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
const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, isNear } = useNearViewport();
  
  return (
    <div ref={ref} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}>
      {isNear ? (
        <Suspense fallback={<SectionFallback />}>
          {children}
        </Suspense>
      ) : (
        <SectionFallback />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundOrbs isGlobal={true} />
      <Navbar />
      <Hero />
      
      {/* Lazy load sections below the fold */}
      <LazySection>
        <Problem />
      </LazySection>
      
      <LazySection>
        <HowItWorks />
      </LazySection>
      
      <LazySection>
        <Testimonials />
      </LazySection>
      
      <LazySection>
        <Pricing />
      </LazySection>
      
      <LazySection>
        <FAQ />
      </LazySection>
      
      <LazySection>
        <Footer />
      </LazySection>
    </div>
  );
};

export default Index;
