import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      description: "Para começar a organizar suas finanças",
      price: "0",
      period: "para sempre",
      features: [
        "1 empresa",
        "Lançamentos ilimitados",
        "Dashboard básico",
        "Relatórios mensais",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      highlighted: false,
      variant: "outline" as const,
    },
    {
      name: "Pro",
      description: "Para empresas que querem crescer",
      price: "97",
      period: "/mês",
      features: [
        "Até 3 empresas",
        "Tudo do Free +",
        "Chat com IA financeira",
        "Previsão de fluxo de caixa",
        "Integração WhatsApp",
        "Relatórios avançados (PDF/Excel)",
        "Alertas personalizados",
        "Suporte prioritário",
      ],
      cta: "Assinar Pro",
      highlighted: true,
      variant: "hero" as const,
      badge: "Mais Popular",
    },
    {
      name: "Business",
      description: "Para operações mais complexas",
      price: "297",
      period: "/mês",
      features: [
        "Empresas ilimitadas",
        "Tudo do Pro +",
        "Multi-usuários com permissões",
        "API de integração",
        "Relatórios personalizados",
        "Envio automático por WhatsApp/email",
        "Auditoria e logs",
        "Gerente de conta dedicado",
        "Onboarding personalizado",
      ],
      cta: "Falar com Vendas",
      highlighted: false,
      variant: "default" as const,
    },
  ];

  return (
    <section id="planos" className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Escolha o plano ideal para{" "}
            <span className="gradient-text">sua empresa</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis e evolua conforme suas necessidades.
            Sem taxas escondidas, cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "border-accent shadow-xl shadow-accent/10 scale-105 z-10"
                  : "border-border hover:border-accent/30 hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium shadow-lg">
                    <Star className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? "bg-accent/20 text-accent" : "bg-success/20 text-success"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.variant}
                size="lg"
                className="w-full"
                asChild
              >
                <Link to="/cadastro">
                  {plan.highlighted && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            ✨ <span className="font-medium text-foreground">Garantia de 14 dias</span> — 
            Se não gostar, devolvemos seu dinheiro sem perguntas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
