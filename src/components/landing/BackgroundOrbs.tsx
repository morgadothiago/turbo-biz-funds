import { memo } from 'react';
import { Wallet, PiggyBank, Receipt, Sparkles, Calculator, TrendingUp, MessageCircle, CreditCard, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

// Static model data moved outside component
const MODELS = [
  { name: 'WhatsApp', icon: MessageCircle, color: 'text-[#25D366]', pos: 'top-[10%] left-[5%]', delay: '0s' },
  { name: 'Carteira', icon: Wallet, color: 'text-primary', pos: 'top-[15%] right-[8%]', delay: '2s' },
  { name: 'Economia', icon: PiggyBank, color: 'text-accent', pos: 'bottom-[40%] right-[12%]', delay: '1.5s' },
  { name: 'Cartão', icon: CreditCard, color: 'text-success', pos: 'top-[45%] right-[2%]', delay: '3s' },
  { name: 'Cálculo', icon: Calculator, color: 'text-primary', pos: 'bottom-[15%] left-[5%]', delay: '4s' },
  { name: 'Recibo', icon: Receipt, color: 'text-accent', pos: 'bottom-[45%] left-[2%]', delay: '1s' },
  { name: 'Meta', icon: Target, color: 'text-success', pos: 'top-[5%] left-[45%]', delay: '2.5s' },
  { name: 'Lucro', icon: TrendingUp, color: 'text-primary', pos: 'bottom-[10%] left-[48%]', delay: '5.2s' },
  { name: 'IA', icon: Sparkles, color: 'text-accent', pos: 'top-[40%] left-[40%]', delay: '0.5s', invisible: true },
] as const;

// Memoized floating icon component
const FloatingIcon = memo(({ model }: { model: typeof MODELS[number] }) => (
  <div
    className={cn(
      "absolute flex flex-col items-center gap-2 animate-float will-change-transform",
      model.pos
    )}
    style={{ animationDelay: model.delay }}
  >
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/40 md:backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
      <model.icon className={cn("w-6 h-6 md:w-8 md:h-8", model.color)} />
    </div>
  </div>
));

FloatingIcon.displayName = "FloatingIcon";

const BackgroundOrbs = memo(({ isGlobal = false }: { isGlobal?: boolean }) => {
  return (
    <div className={cn(
      "overflow-hidden pointer-events-none z-0",
      isGlobal ? "fixed inset-0" : "absolute inset-0"
    )}>
      {/* Central Glow Effect - simplified on mobile for performance */}
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-primary/5 via-accent/5 to-transparent blur-[40px] md:blur-[120px] opacity-40" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-tr from-accent/5 via-primary/5 to-transparent blur-[40px] md:blur-[120px] opacity-40" />

      {/* Floating Icons Loop - hidden on small mobile for performance */}
      <div className="hidden sm:block">
        {MODELS.map((model) => (
          <FloatingIcon key={model.name} model={model} />
        ))}
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] hidden md:block"
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
    </div>
  );
});

BackgroundOrbs.displayName = "BackgroundOrbs";

export default BackgroundOrbs;
