import { useEffect, useRef } from 'react';

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

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('active');
                            }, delay);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            observer.observe(el);

            // Fallback: if observer doesn't fire within 2s, show content anyway
            const fallback = setTimeout(() => {
                el.classList.add('active');
            }, 2000);

            const cleanup = () => {
                observer.disconnect();
                clearTimeout(fallback);
            };

            el.dataset.cleanup = '';
            (el as any)._revealCleanup = cleanup;
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
