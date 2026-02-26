import { lazy, Suspense, useState, useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BackgroundOrbs from "@/components/landing/BackgroundOrbs";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Hook to detect scroll direction and hide/show balloon
const useScrollDirection = () => {
  const [hideBalloon, setHideBalloon] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide balloon when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideBalloon(true);
      } else {
        setHideBalloon(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hideBalloon;
};

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
  const hideBalloon = useScrollDirection();

  return (
    <ThemeProvider defaultTheme="light" storageKey="organizaai-theme">
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

        {/* Botão flutuante do WhatsApp com balão */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 ">
          <div
            className={`bg-white text-gray-900 px-4 py-2 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap border border-gray-200 transition-all duration-300 ${hideBalloon ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
          >
            Como posso ajudar?
          </div>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Falar no WhatsApp"
          >
            <img
              src="/whatsapp.png"
              alt="WhatsApp"
              className="w-10 h-10"
            />
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
