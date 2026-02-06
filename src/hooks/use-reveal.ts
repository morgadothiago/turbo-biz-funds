import { useEffect, useRef } from 'react';

// Global singleton observer - shared across all useReveal instances
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, { delay: number; callback: () => void }>();

function getGlobalObserver(): IntersectionObserver {
    if (!globalObserver) {
        globalObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const config = observedElements.get(entry.target);
                        if (config) {
                            setTimeout(() => {
                                entry.target.classList.add('active');
                                config.callback();
                            }, config.delay);
                            globalObserver?.unobserve(entry.target);
                            observedElements.delete(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );
    }
    return globalObserver;
}

export const useReveal = (delay = 0) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Add reveal class immediately (content stays visible via CSS default)
        el.classList.add('reveal');

        // Small delay before enabling animation - ensures content is painted first
        const raf = requestAnimationFrame(() => {
            el.classList.add('animate');

            const observer = getGlobalObserver();
            const cleanup = () => {
                observer.unobserve(el);
                observedElements.delete(el);
            };

            observedElements.set(el, { delay, callback: cleanup });
            observer.observe(el);

            // Fallback: if observer doesn't fire within 3s, show content anyway
            const fallback = setTimeout(() => {
                el.classList.add('active');
                cleanup();
            }, 3000);

            (el as any)._revealCleanup = () => {
                clearTimeout(fallback);
                cleanup();
            };
        });

        return () => {
            cancelAnimationFrame(raf);
            if ((el as any)._revealCleanup) {
                (el as any)._revealCleanup();
            }
        };
    }, [delay]);

    return ref;
};
