import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, Star, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Subtle central glow for text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[100px] -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Chega de Planilhas
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Cansou de planilhas?{" "}
            <span className="gradient-text">Organize suas contas pelo WhatsApp</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Você vive sua vida, a gente organiza seu dinheiro.
            Mande áudio, foto ou texto — a IA categoriza tudo automaticamente.
            <span className="font-medium text-foreground"> Sem planilhas, sem estresse.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
              <Link to="/cadastro">
                Testar por 15 dias — R$ 9,90
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
              <Play className="w-5 h-5" />
              Ver como funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "3.000+", label: "Usuários felizes", icon: Users },
              { value: "500k+", label: "Gastos registrados", icon: Sparkles },
              { value: "4.9", label: "Avaliação média", icon: Star },
              { value: "< 5min", label: "Para começar", icon: Clock },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stat-value flex items-center justify-center gap-2">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Video Demo Placeholder */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="relative bg-gradient-to-b from-primary/5 to-accent/10 rounded-2xl p-2 md:p-3 shadow-xl border border-border/50">
              <div className="bg-card rounded-xl overflow-hidden shadow-card">
                {/* Video Container */}
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center relative group cursor-pointer">
                  {/* Play Button */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                  </div>

                  {/* Video Caption */}
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
                      <p className="text-sm md:text-base text-foreground font-medium">
                        📱 Manda mensagem → 🤖 IA organiza → 📊 Você visualiza
                      </p>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 bg-accent/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                    30 segundos
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="hidden md:block absolute -left-8 top-1/4 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float" style={{ animationDelay: "0s" }}>
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

            <div className="hidden md:block absolute -right-8 top-1/3 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float" style={{ animationDelay: "1s" }}>
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
};

export default Hero;
