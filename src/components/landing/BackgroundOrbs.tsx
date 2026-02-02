import { Brain, Bot, Cpu, Sparkles, Zap, TrendingUp, MessageCircle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const models = [
    { name: 'Claude', icon: Bot, color: 'text-orange-500', pos: 'top-[10%] left-[5%]', delay: '0s' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', pos: 'top-[15%] right-[8%]', delay: '2s' },
    { name: 'Gemini', icon: Brain, color: 'text-blue-500', pos: 'bottom-[40%] right-[12%]', delay: '1.5s' },
    { name: 'Finanças', icon: DollarSign, color: 'text-emerald-500', pos: 'top-[45%] right-[2%]', delay: '3s' },
    { name: 'Copilot', icon: Cpu, color: 'text-indigo-500', pos: 'bottom-[15%] left-[5%]', delay: '4s' },
    { name: 'Grok', icon: Zap, color: 'text-primary', pos: 'bottom-[45%] left-[2%]', delay: '1s' },
    { name: 'Llama', icon: Bot, color: 'text-purple-500', pos: 'top-[5%] left-[45%]', delay: '2.5s' },
    { name: 'Lucro', icon: TrendingUp, color: 'text-blue-500', pos: 'bottom-[10%] left-[48%]', delay: '5.2s' },
    { name: 'ChatGPT', icon: Sparkles, color: 'text-emerald-500', pos: 'top-[40%] left-[40%]', delay: '0.5s', invisible: true },
];

const BackgroundOrbs = ({ isGlobal = false }: { isGlobal?: boolean }) => {
    return (
        <div className={cn(
            "overflow-hidden pointer-events-none z-0",
            isGlobal ? "fixed inset-0" : "absolute inset-0"
        )}>
            {/* Central Glow Effect - responsive sizes for mobile */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-primary/5 via-success/5 to-transparent blur-[80px] md:blur-[120px] opacity-40" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-tr from-success/5 via-primary/5 to-transparent blur-[80px] md:blur-[120px] opacity-40" />

            {/* Floating Icons Loop - hidden on small mobile for performance */}
            <div className="hidden sm:block">
                {models.map((model, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute flex flex-col items-center gap-2 transition-all duration-1000 animate-float",
                            model.pos
                        )}
                        style={{ animationDelay: model.delay }}
                    >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/40 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                            <model.icon className={cn("w-6 h-6 md:w-8 md:h-8", model.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] hidden md:block"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />
        </div>
    );
};

export default BackgroundOrbs;
