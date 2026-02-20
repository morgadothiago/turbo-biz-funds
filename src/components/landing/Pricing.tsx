import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n-provider";

interface PlanProps {
  name: string;
  description: string;
  price: string;
  priceDecimal: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  savings?: string;
}

const PlanCard = memo(({ plan }: { plan: PlanProps }) => {
  return (
    <div
      className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 ${
        plan.highlighted
          ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10"
          : "border-border/60 hover:border-primary/30 hover:shadow-lg"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg">
            <Zap className="w-4 h-4" />
            {plan.badge}
          </div>
        </div>
      )}

      {plan.savings && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium shadow-lg">
            {plan.savings}
          </div>
        </div>
      )}

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

      <Button
        variant={plan.highlighted ? "hero" : "default"}
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
});

PlanCard.displayName = "PlanCard";

const Pricing = memo(() => {
  const { t } = useI18n();

  const PLANS: PlanProps[] = [
    {
      name: t("landing", "planTest"),
      description: t("landing", "planTestDescription"),
      price: "9",
      priceDecimal: "90",
      period: t("landing", "planTestPeriod"),
      features: t("landing", "planFeatures1") as unknown as string[],
      cta: t("landing", "planCTA1"),
      highlighted: false,
    },
    {
      name: t("landing", "planMonthly"),
      description: t("landing", "planMonthlyDescription"),
      price: "29",
      priceDecimal: "90",
      period: "/mês",
      features: t("landing", "planFeatures2") as unknown as string[],
      cta: t("landing", "planCTA2"),
      highlighted: true,
      badge: "Mais Popular",
    },
    {
      name: t("landing", "planQuarterly"),
      description: t("landing", "planQuarterlyDescription"),
      price: "79",
      priceDecimal: "90",
      period: "/trimestre",
      features: t("landing", "planFeatures3") as unknown as string[],
      cta: t("landing", "planCTA3"),
      highlighted: false,
      savings: "Economize R$ 10",
    },
  ];

  const TRUST_BADGES = [
    { icon: Shield, text: t("landing", "trustSecurePayment") },
    { icon: Check, text: t("landing", "trustCancelAnyTime") },
    { icon: Star, text: t("landing", "trustHumanSupport") },
  ] as const;

  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-success/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("landing", "pricingBadge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("landing", "pricingTitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing", "pricingSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
            {TRUST_BADGES.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5 text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            <span className="font-medium text-foreground">{t("landing", "pricingWhyNoFree")}</span>
            {" "}Acreditamos que quem investe no próprio controle financeiro leva a sério.
            O teste de R$ 9,90 garante a melhor experiência desde o primeiro dia.
          </p>
        </div>
      </div>
    </section>
  );
});

Pricing.displayName = "Pricing";

export default Pricing;
