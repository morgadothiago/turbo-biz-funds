import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, MessageCircle, Brain, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in">
            <Brain className="w-4 h-4" />
            Inteligência Artificial para suas Finanças
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Gerencie suas finanças com{" "}
            <span className="gradient-text">IA e WhatsApp</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Automatize sua gestão financeira, receba previsões inteligentes e controle
            tudo pelo WhatsApp. Ideal para pequenas e médias empresas que querem crescer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
              <Link to="/cadastro">
                Começar Agora — Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
              <Play className="w-5 h-5" />
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "5.000+", label: "Empresas" },
              { value: "R$ 50M+", label: "Gerenciados" },
              { value: "98%", label: "Satisfação" },
              { value: "24/7", label: "Disponível" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stat-value">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="relative bg-gradient-to-b from-primary/5 to-primary/10 rounded-2xl p-2 md:p-3 shadow-xl border border-border/50">
              <div className="bg-card rounded-xl overflow-hidden shadow-card">
                {/* Mock Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded-md px-4 py-1.5 text-xs text-muted-foreground text-center">
                      app.financeai.com.br/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview Content */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Saldo Atual", value: "R$ 127.450,00", icon: TrendingUp, color: "text-success" },
                      { label: "Receitas", value: "R$ 89.320,00", icon: TrendingUp, color: "text-accent" },
                      { label: "Despesas", value: "R$ 45.780,00", icon: TrendingUp, color: "text-warning" },
                    ].map((card, index) => (
                      <div key={index} className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{card.label}</span>
                          <card.icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{card.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Integration Preview */}
                  <div className="flex items-center gap-4 bg-success/10 rounded-xl p-4 border border-success/20">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-foreground">WhatsApp Conectado</div>
                      <div className="text-xs text-muted-foreground">
                        Envie "saldo" para ver seu balanço atual
                      </div>
                    </div>
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float hidden md:block">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-accent" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">IA detectou</div>
                  <div className="text-sm font-semibold text-foreground">Economia de R$ 3.200</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card rounded-xl p-3 shadow-lg border border-border/50 animate-float hidden md:block" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-success" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Via WhatsApp</div>
                  <div className="text-sm font-semibold text-foreground">Relatório enviado ✓</div>
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
