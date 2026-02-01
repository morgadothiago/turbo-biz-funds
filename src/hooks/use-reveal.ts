import { useEffect, useRef } from 'react';

export const useReveal = (delay = 0) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

        if (ref.current) {
            ref.current.classList.add('reveal');
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return ref;
};
