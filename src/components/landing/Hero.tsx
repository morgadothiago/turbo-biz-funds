import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, Star, Clock } from "lucide-react";

// Static data moved outside component to prevent recreation on each render
const HERO_STATS = [
  { value: "3.000+", label: "Usuários felizes", icon: Users },
  { value: "500k+", label: "Gastos registrados", icon: Sparkles },
  { value: "4.9", label: "Avaliação média", icon: Star },
  { value: "< 5min", label: "Para começar", icon: Clock },
] as const;

const Hero = memo(() => {
  return (
    <section className="relative min-h-[90vh] pt-20 pb-12 md:min-h-screen md:pt-24 md:pb-16 flex items-center bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Subtle glow - desktop only, no blur on mobile */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[80px] -z-10" />

          {/* Badge - sem animação em mobile */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Chega de Planilhas
          </div>

          {/* Headline - animação mais rápida em mobile */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 md:mb-6 animate-fade-in-up [animation-delay:0.1s]">
            Cansou de planilhas?{" "}
            <span className="gradient-text">Organize suas contas pelo WhatsApp</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 animate-fade-in-up [animation-delay:0.2s]">
            Você vive sua vida, a gente organiza seu dinheiro.
            Mande áudio, foto ou texto — a IA categoriza tudo automaticamente.
            <span className="font-medium text-foreground"> Sem planilhas, sem estresse.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 animate-fade-in-up [animation-delay:0.3s]">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto md:size-xl">
              <Link to="/cadastro">
                Testar por 15 dias — R$ 9,90
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 md:size-xl">
              <Play className="w-5 h-5" />
              Ver como funciona
            </Button>
          </div>

          {/* Stats - grid 2 cols em mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16 animate-fade-in-up [animation-delay:0.4s]">
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

          {/* Video Demo - simplified for mobile */}
          <div className="relative animate-fade-in-up [animation-delay:0.5s]">
            <div className="relative bg-gradient-to-b from-primary/5 to-accent/10 rounded-xl md:rounded-2xl p-1.5 md:p-3 shadow-lg md:shadow-xl border border-border/50">
              <div className="bg-card rounded-lg md:rounded-xl overflow-hidden shadow-card">
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center relative group cursor-pointer">
                  {/* Play Button - smaller on mobile */}
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 md:w-10 md:h-10 text-white ml-0.5" fill="white" />
                  </div>

                  {/* Video Caption */}
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <div className="bg-background/95 rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 text-center">
                      <p className="text-xs md:text-base text-foreground font-medium">
                        📱 Manda mensagem → 🤖 IA organiza → 📊 Você visualiza
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-accent/90 text-white text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                    30 seg
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards - desktop only */}
            <div className="hidden md:block absolute -left-8 top-1/4 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Você enviou:</div>
                  <div className="text-sm font-medium">"Gastei 45 no mercado"</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-8 top-1/3 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float [animation-delay:1s]">
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
