import { memo } from "react";
import { MessageCircle, Sparkles, BarChart3, ArrowRight, Zap, Check } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Conecte o WhatsApp",
    description: "Escaneie o QR Code e conecte em 30 segundos. Nada de app novo para baixar.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Mande seus gastos",
    description: "Foto do comprovante, áudio 'gastei 50 no mercado', ou mensagem. A IA entende tudo.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Tudo organizado",
    description: "Acesse o dashboard ou pergunte 'quanto gastei esse mês?' direto no WhatsApp.",
  },
] as const;

const DASHBOARD_STATS = [
  { label: "Saldo", value: "R$ 2.340", color: "text-primary" },
  { label: "Gastos", value: "R$ 1.850", color: "text-accent" },
  { label: "Economia", value: "R$ 490", color: "text-success" },
  { label: "Meta", value: "76%", color: "text-primary" },
];

const CATEGORIES = [
  { name: "Alimentação", value: "R$ 680", percent: 37, color: "bg-primary" },
  { name: "Transporte", value: "R$ 420", percent: 23, color: "bg-accent" },
  { name: "Moradia", value: "R$ 450", percent: 24, color: "bg-success" },
  { name: "Lazer", value: "R$ 300", percent: 16, color: "bg-warning" },
];

const WHATSAPP_COMMANDS = ["quanto gastei hoje?", "sobra quanto?", "gastos do mês"];

const StepCard = memo(({ step, index }: { step: typeof STEPS[number]; index: number }) => {
  const colors: Record<string, { bg: string; border: string; text: string; number: string }> = {
    "01": { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary", number: "text-primary/20" },
    "02": { bg: "bg-accent/10", border: "border-accent/20", text: "text-accent", number: "text-accent/20" },
    "03": { bg: "bg-success/10", border: "border-success/20", text: "text-success", number: "text-success/20" },
  };
  const color = colors[step.number];

  return (
    <div className="relative">
      <div className="group bg-card rounded-2xl p-6 md:p-8 border border-border/60 hover:shadow-lg transition-all duration-300 h-full">
        <div className={`absolute top-4 right-4 text-5xl font-bold ${color.number}`}>
          {step.number}
        </div>

        <div className={`w-14 h-14 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <step.icon className={`w-7 h-7 ${color.text}`} />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>

      {index < STEPS.length - 1 && (
        <div className="hidden md:flex absolute top-1/2 -right-4 z-10 items-center justify-center w-8 h-8">
          <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
});

StepCard.displayName = "StepCard";

const HowItWorks = memo(() => {
  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simples assim
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Organize em{" "}
            <span className="gradient-text">3 passos</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em 3 passos você organiza suas finanças sem complicação.
            Sem planilhas, sem apps difíceis.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">✨ Você conversa, o sistema organiza</span>
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background rounded-md px-4 py-1.5 text-xs text-muted-foreground text-center">
                  app.organizaai.com.br/dashboard
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {DASHBOARD_STATS.map((stat, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-xl p-4">
                <div className="text-sm font-medium text-foreground mb-3">Gastos por Categoria</div>
                <div className="space-y-3">
                  {CATEGORIES.map((cat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat.name}</span>
                          <span className="font-medium">{cat.value}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cat.color} rounded-full transition-all`}
                            style={{ width: `${cat.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 rounded-2xl p-6 md:p-8 border border-[#25D366]/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[#25D366]" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Pergunte pelo WhatsApp
                </h3>
                <p className="text-muted-foreground mb-4">
                  Não precisa abrir o app. Pergunte direto na conversa:
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {WHATSAPP_COMMANDS.map((command) => (
                    <span
                      key={command}
                      className="px-3 py-1.5 bg-[#25D366]/20 text-[#128C7E] rounded-full text-sm font-medium"
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
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
