import { memo, useMemo } from "react";
import { MessageCircle, Sparkles, BarChart3, ArrowRight, Camera, Mic, Type } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

// Static data moved outside component
const STEPS = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Conecte o WhatsApp",
    description: "Escaneie o QR Code e conecte em 30 segundos. Nada de app novo para baixar.",
    color: "primary" as const,
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Mande seus gastos",
    description: "Foto do comprovante, áudio 'gastei 50 no mercado', ou mensagem de texto. A IA entende tudo.",
    color: "accent" as const,
    inputs: [
      { icon: Camera, label: "Foto" },
      { icon: Mic, label: "Áudio" },
      { icon: Type, label: "Texto" },
    ],
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Veja tudo organizado",
    description: "Acesse o dashboard ou pergunte 'quanto gastei esse mês?' direto no WhatsApp.",
    color: "success" as const,
  },
];

const DASHBOARD_STATS = [
  { label: "Saldo Disponível", value: "R$ 2.340", color: "text-primary" },
  { label: "Gastos do Mês", value: "R$ 1.850", color: "text-accent" },
  { label: "Economia", value: "R$ 490", color: "text-success" },
  { label: "Meta Mensal", value: "76%", color: "text-primary" },
];

const CATEGORIES = [
  { name: "🛒 Alimentação", value: "R$ 680", percent: 37, color: "bg-primary" },
  { name: "🚗 Transporte", value: "R$ 420", percent: 23, color: "bg-accent" },
  { name: "🏠 Moradia", value: "R$ 450", percent: 24, color: "bg-success" },
  { name: "🎬 Lazer", value: "R$ 300", percent: 16, color: "bg-warning" },
];

const WHATSAPP_COMMANDS = ["quanto gastei hoje?", "sobra quanto?", "gastos do mês", "resumo semanal"];

// Color classes mapping moved outside
const COLOR_CLASSES = {
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/20",
    text: "text-accent",
    number: "text-accent/20",
  },
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    number: "text-primary/20",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    text: "text-success",
    number: "text-success/20",
  },
} as const;

// Memoized step card component
const StepCard = memo(({ step, index }: { step: typeof STEPS[number]; index: number }) => {
  const cardRef = useReveal(index * 150);
  const colors = COLOR_CLASSES[step.color];

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="group relative bg-card rounded-2xl p-6 md:p-8 border border-border hover-lift h-full"
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
        <p className="text-muted-foreground leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Input types for step 2 */}
        {step.inputs && (
          <div className="flex gap-2 mt-4">
            {step.inputs.map((input, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colors.bg} text-sm font-medium ${colors.text}`}
              >
                <input.icon className="w-3.5 h-3.5" />
                {input.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrow connector */}
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
  const titleRef = useReveal();
  const dashboardRef = useReveal(300);

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-primary/5 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="blob w-96 h-96 bg-accent/5 -top-20 -left-20 animate-blob" />
      <div className="blob w-80 h-80 bg-primary/5 top-1/2 right-0 animate-blob [animation-delay:-12s]" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simples assim
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Simples como{" "}
            <span className="gradient-text">mandar mensagem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em 3 passos você organiza suas finanças sem complicação.
            Sem planilhas, sem apps complicados.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div ref={dashboardRef} className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">✨ Você conversa, o sistema organiza</span>
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Browser Header */}
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

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {DASHBOARD_STATS.map((stat, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Categories */}
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

        {/* WhatsApp Commands */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 rounded-2xl p-6 md:p-8 border border-[#25D366]/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
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
