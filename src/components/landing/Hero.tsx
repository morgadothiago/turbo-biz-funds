import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, Star, Clock, MessageCircle } from "lucide-react";

const HERO_STATS = [
  { value: "3.000+", label: "Usuários", icon: Users },
  { value: "500k+", label: "Gastos", icon: MessageCircle },
  { value: "4.9", label: "Avaliação", icon: Star },
  { value: "< 5min", label: "Para começar", icon: Clock },
] as const;

const Hero = memo(() => {
  return (
    <section className="relative min-h-[90vh] pt-20 pb-12 md:min-h-screen md:pt-24 md:pb-16 flex items-center bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[80px] -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 md:mb-8">
            <Sparkles className="w-4 h-4" />
            Chega de Planilhas
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 md:mb-6">
            Cansou de planilhas?{" "}
            <span className="gradient-text">Organize pelo WhatsApp</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10">
            Você vive sua vida, a gente organiza seu dinheiro.
            Mande áudio, foto ou texto — a IA categoriza automaticamente.
            <span className="font-medium text-foreground"> Sem planilhas, sem estresse.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto md:size-xl">
              <Link to="/cadastro">
                Comece agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto md:size-xl gap-2">
              <Play className="w-5 h-5" />
              Ver como funciona
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
            {HERO_STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight flex items-center justify-center gap-1 md:gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-b from-primary/5 to-accent/10 rounded-xl md:rounded-2xl p-1.5 md:p-3 shadow-lg md:shadow-xl border border-border/50">
              <div className="bg-card rounded-lg md:rounded-xl overflow-hidden shadow-card">
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center relative group cursor-pointer">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 md:w-10 md:h-10 text-white ml-0.5" fill="white" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <div className="bg-background/95 rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 text-center">
                      <p className="text-xs md:text-base text-foreground font-medium">
                        📱 Manda → 🤖 IA → 📊 Você visualiza
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-accent/90 text-white text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                    30 seg
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -left-8 top-1/4 bg-card rounded-xl p-3 shadow-lg border border-border/50 -translate-x-4 opacity-0 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Você enviou:</div>
                  <div className="text-sm font-medium">"Gastei 45 no mercado"</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-8 top-1/3 bg-card rounded-xl p-3 shadow-lg border border-border/50 translate-x-4 opacity-0 animate-fade-in [animation-delay:0.3s]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Categorizado:</div>
                  <div className="text-sm font-medium text-primary">🛒 Alimentação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
