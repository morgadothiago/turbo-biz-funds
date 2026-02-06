import { memo } from 'react';
import { cn } from '@/lib/utils';

// BackgroundOrbs - REMOVIDO em mobile para performance
// Desktop apenas: mostra gradientes suaves sem ícones flutuantes
const BackgroundOrbs = memo(({ isGlobal = false }: { isGlobal?: boolean }) => {
  return (
    <div className={cn(
      "overflow-hidden pointer-events-none z-0 hidden md:block",
      isGlobal ? "fixed inset-0" : "absolute inset-0"
    )}>
      {/* Gradientes suaves - desktop only */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-br from-primary/5 via-accent/3 to-transparent blur-[60px] opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-tr from-accent/5 via-primary/3 to-transparent blur-[60px] opacity-30" />
    </div>
  );
});

BackgroundOrbs.displayName = "BackgroundOrbs";

export default BackgroundOrbs;
