import { Clock, TrendingUp, Shield, Smartphone, Brain, BarChart3, Bell, Coins } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const Benefits = () => {
  const titleRef = useReveal();
  const benefits = [
    {
      icon: Clock,
      title: "Economize 10+ horas por semana",
      description: "Automatize lançamentos, relatórios e reconciliações. Pare de perder tempo com planilhas.",
    },
    {
      icon: TrendingUp,
      title: "Previsões precisas",
      description: "A IA prevê seu fluxo de caixa para 30, 60 e 90 dias com alta precisão.",
    },
    {
      icon: Brain,
      title: "Insights inteligentes",
      description: "Receba alertas e sugestões personalizadas para melhorar sua saúde financeira.",
    },
    {
      icon: Smartphone,
      title: "Registre tudo no WhatsApp",
      description: "Envie áudios ou fotos de notas fiscais e nossa IA cadastra a despesa automaticamente.",
    },
    {
      icon: Shield,
      title: "Segurança bancária",
      description: "Seus dados são protegidos com criptografia de nível bancário e autenticação robusta.",
    },
    {
      icon: Bell,
      title: "Alertas proativos",
      description: "Seja avisado antes de problemas acontecerem: contas a vencer, fluxo de caixa baixo, etc.",
    },
    {
      icon: BarChart3,
      title: "Relatórios automáticos",
      description: "DRE, fluxo de caixa e relatórios mensais gerados automaticamente em PDF e Excel.",
    },
    {
      icon: Coins,
      title: "Reduza custos",
      description: "A IA identifica gastos desnecessários e sugere formas de economizar dinheiro.",
    },
  ];


  return (
    <section id="beneficios" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Benefícios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Tudo que você precisa para{" "}
            <span className="gradient-text">crescer com segurança</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            O FinanceAI reúne automação, inteligência artificial e praticidade
            em uma única plataforma pensada para PMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const cardRef = useReveal(index * 100);
            return (
              <div
                key={index}
                ref={cardRef}
                className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI Capabilities Section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-12 text-primary-foreground overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8" />
                <h3 className="text-2xl md:text-3xl font-bold">
                  IA que entende seu negócio
                </h3>
              </div>

              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl">
                Pergunte qualquer coisa em linguagem natural. Nossa IA analisa seus dados
                e responde de forma clara e objetiva.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Vou ter caixa para pagar meus impostos este mês?",
                  "Posso contratar um funcionário agora?",
                  "Como posso reduzir meus custos fixos?",
                  "Qual é a previsão de faturamento para o próximo trimestre?",
                ].map((question, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
                  >
                    <span className="text-sm">"{question}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
