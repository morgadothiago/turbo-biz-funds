import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const Pricing = () => {
  const headerRef = useReveal();

  const plans = [
    {
      name: "Teste",
      description: "Experimente por 15 dias",
      price: "9",
      priceDecimal: "90",
      period: "único",
      features: [
        "15 dias de acesso completo",
        "Lançamentos ilimitados",
        "Integração WhatsApp",
        "Dashboard completo",
        "Suporte por WhatsApp",
      ],
      cta: "Começar Teste",
      highlighted: false,
      variant: "outline" as const,
    },
    {
      name: "Mensal",
      description: "Sem compromisso, cancele quando quiser",
      price: "29",
      priceDecimal: "90",
      period: "/mês",
      features: [
        "Tudo do Teste +",
        "Relatórios automáticos",
        "Categorias personalizadas",
        "Metas de economia",
        "Alertas de gastos",
        "Suporte prioritário",
      ],
      cta: "Assinar Mensal",
      highlighted: true,
      variant: "hero" as const,
      badge: "Mais Popular",
    },
    {
      name: "Trimestral",
      description: "Economize 10% no plano",
      price: "79",
      priceDecimal: "90",
      period: "/trimestre",
      features: [
        "Tudo do Mensal +",
        "Equivale a R$ 26,63/mês",
        "Prioridade no suporte",
        "Acesso antecipado a novidades",
        "3 meses de organização",
      ],
      cta: "Assinar Trimestral",
      highlighted: false,
      variant: "default" as const,
      savings: "Economize R$ 10",
    },
  ];

  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-success/5 to-background">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Investimento
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Invista em{" "}
            <span className="gradient-text">paz de espírito</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Menos que um café por dia para nunca mais se perder nas contas.
            Cancele quando quiser, sem burocracia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const cardRef = useReveal(index * 150);
            return (
              <div
                key={index}
                ref={cardRef}
                className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10"
                    : "border-border hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
                      <Star className="w-4 h-4" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Savings badge */}
                {plan.savings && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium shadow-lg">
                      {plan.savings}
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-8 pt-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-lg text-muted-foreground">R$</span>
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-2xl font-bold text-foreground">,{plan.priceDecimal}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
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
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Suporte humanizado</span>
            </div>
          </div>
        </div>

        {/* No free plan notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            <span className="font-medium text-foreground">Por que não temos plano gratuito?</span>
            {" "}Acreditamos que quem investe no próprio controle financeiro leva a sério.
            O teste de R$ 9,90 garante que você tenha a melhor experiência desde o primeiro dia.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
