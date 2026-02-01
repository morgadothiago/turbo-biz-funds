import { Brain, MessageCircle, Zap, BarChart3, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const HowItWorks = () => {
  const titleRef = useReveal();
  const steps = [

    {
      number: "01",
      icon: Zap,
      title: "Conecte suas finanças",
      description: "Importe dados de bancos, planilhas ou cadastre manualmente. Em minutos sua empresa está configurada.",
      color: "accent",
    },
    {
      number: "02",
      icon: Brain,
      title: "A IA analisa tudo",
      description: "Nossa inteligência artificial processa seus dados e identifica padrões, riscos e oportunidades.",
      color: "primary",
    },
    {
      number: "03",
      icon: MessageCircle,
      title: "Envie e Gerencie",
      description: "Mande uma foto da conta ou um áudio dizendo 'Gastei R$ 50 no almoço'. A IA categoriza e, salva para você.",
      color: "success",
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Tome decisões melhores",
      description: "Com previsões de fluxo de caixa e recomendações da IA, você sempre sabe o próximo passo.",
      color: "accent",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      accent: {
        bg: "bg-accent/10",
        border: "border-accent/20",
        text: "text-accent",
        number: "text-accent/30",
      },
      primary: {
        bg: "bg-primary/10",
        border: "border-primary/20",
        text: "text-primary",
        number: "text-primary/30",
      },
      success: {
        bg: "bg-success/10",
        border: "border-success/20",
        text: "text-success",
        number: "text-success/30",
      },
    };
    return colors[color as keyof typeof colors] || colors.accent;
  };

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="blob w-96 h-96 bg-accent/5 -top-20 -left-20 animate-blob" />
      <div className="blob w-80 h-80 bg-primary/5 top-1/2 right-0 animate-blob" style={{ animationDelay: '-12s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="max-w-3xl mx-auto text-center mb-16">

          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Simples de começar,{" "}
            <span className="gradient-text">poderoso de usar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em apenas 4 passos você terá controle total das suas finanças
            com inteligência artificial trabalhando para você.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              const cardRef = useReveal(index * 150);
              return (
                <div
                  key={index}
                  ref={cardRef}
                  className="group relative bg-card rounded-2xl p-8 border border-border hover-lift"
                >
                  {/* Step number */}
                  <div className={`absolute top-4 right-4 text-5xl font-bold ${colors.number}`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for connection (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 opacity-20">
                      <ArrowRight className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Commands Preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-8 border border-success/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-success" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Comandos simples via WhatsApp
                </h3>
                <p className="text-muted-foreground mb-4">
                  Envie mensagens simples e receba informações instantâneas:
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {["saldo", "vendas hoje", "despesas do mês", "previsão 30 dias", "contas a pagar"].map((command) => (
                    <span
                      key={command}
                      className="px-3 py-1.5 bg-success/20 text-success rounded-full text-sm font-medium"
                    >
                      "{command}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
