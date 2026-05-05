import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-provider";
import { analytics } from "@/lib/analytics";
import { usePublicPlans } from "@/features/plans/hooks/use-public-plans";

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
      className={`relative rounded-2xl p-8 border transition-all duration-300 ${
        plan.highlighted
          ? "bg-[#1a3799] border-blue-400/40 shadow-xl shadow-blue-900/30 scale-105 z-10"
          : "bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:shadow-lg"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1a3799] text-white rounded-full text-sm font-medium shadow-lg border border-blue-400/30">
            <Zap className="w-4 h-4" />
            {plan.badge}
          </div>
        </div>
      )}

      {plan.savings && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 text-white rounded-full text-sm font-medium shadow-lg">
            {plan.savings}
          </div>
        </div>
      )}

      <div className="text-center mb-8 pt-2">
        <h3 className="text-xl font-semibold text-white mb-2">
          {plan.name}
        </h3>
        <p className="text-sm text-white/60 mb-4">
          {plan.description}
        </p>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-lg text-white/60">R$</span>
          <span className="text-5xl font-bold text-white">
            {plan.price}
          </span>
          <span className="text-2xl font-bold text-white">,{plan.priceDecimal}</span>
          <span className="text-white/60 ml-1">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-400/20 text-cyan-400">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-white/70">
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
        <Link to="/cadastro" onClick={() => analytics.click(`pricing_${plan.name.toLowerCase()}`, "pricing")}>
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
  const { data: plans, isLoading } = usePublicPlans();

  // Fallback para dados hardcoded se API não retornar nada
  const defaultPlans: PlanProps[] = [
    {
      name: t("landing", "planMonthly"),
      description: t("landing", "planMonthlyDescription"),
      price: "29",
      priceDecimal: "90",
      period: "/mês",
      features: t("landing", "planFeatures2") as unknown as string[],
      cta: t("landing", "planCTA2"),
      highlighted: false,
    },
    {
      name: t("landing", "planQuarterly"),
      description: t("landing", "planQuarterlyDescription"),
      price: "79",
      priceDecimal: "90",
      period: "/semestre",
      features: t("landing", "planFeatures3") as unknown as string[],
      cta: t("landing", "planCTA3"),
      highlighted: true,
      badge: "Mais Popular",
    },
    {
      name: t("landing", "planAnnual"),
      description: t("landing", "planAnnualDescription"),
      price: "159",
      priceDecimal: "90",
      period: "/ano",
      features: t("landing", "planFeatures3") as unknown as string[],
      cta: t("landing", "planCTA3"),
      highlighted: false,
      badge: "Melhor Valor",
    },
  ];

  // Converte dados da API para formato esperado pelo componente
  const PLANS = plans && plans.length > 0
    ? plans.map((plan) => {
        const priceStr = plan.price.toFixed(2).replace(".", ",");
        const [price, priceDecimal] = priceStr.split(",");
        
        const periodMap: Record<string, string> = {
          "MONTHLY": "/mês",
          "YEARLY": "/ano",
          "mês": "/mês",
          "ano": "/ano",
        };
        
        return {
          name: plan.name,
          description: plan.description,
          price,
          priceDecimal,
          period: periodMap[plan.billingPeriod?.toUpperCase()] || `/${plan.billingPeriod}`,
          features: plan.features,
          cta: t("landing", "planCTA2"),
          highlighted: plan.popular ?? false,
          badge: plan.popular ? "Mais Popular" : undefined,
        } as PlanProps;
      })
    : defaultPlans;

  const TRUST_BADGES = [
    { icon: Shield, text: t("landing", "trustSecurePayment") },
    { icon: Check, text: t("landing", "trustCancelAnyTime") },
    { icon: Star, text: t("landing", "trustHumanSupport") },
  ] as const;

  return (
    <section id="planos" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-cyan-400 text-sm font-medium mb-4">
            {t("landing", "pricingBadge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("landing", "pricingTitle")}
          </h2>
          <p className="text-lg text-white/60">
            {t("landing", "pricingSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : (
            PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))
          )}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-white/60">
            {TRUST_BADGES.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5 text-cyan-400" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/50 max-w-lg mx-auto">
            <span className="font-medium text-white">{t("landing", "pricingWhyNoFree")}</span>
            {" "}Acreditamos que quem investe no próprio controle financeiro leva a sério.
            Isso nos permite oferecer suporte de qualidade e manter o produto sem anúncios.
          </p>
        </div>
      </div>
    </section>
  );
});

Pricing.displayName = "Pricing";

export default Pricing;
