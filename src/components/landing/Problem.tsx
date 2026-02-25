import { memo, useState } from "react";
import { Table2, Brain, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n-provider";

const Problem = memo(() => {
  const { t, locale } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PROBLEMS = locale === "pt" ? [
    {
      icon: Table2,
      title: "Cansaço de planilhas",
      quote: '"Não aguento mais abrir o Excel"',
      description: "Você quer apenas saber quanto pode gastar, não virar contador.",
    },
    {
      icon: Brain,
      title: "Falta de constância",
      quote: '"Sempre esqueço de anotar os gastos"',
      description: "Até tenta, mas no fim do mês não lembra de metade das compras.",
    },
    {
      icon: CreditCard,
      title: "Medo da fatura",
      quote: '"Fatura do cartão sempre uma surpresa"',
      description: "Chega a fatura e você pensa: gastei tudo isso?",
    },
    {
      icon: HelpCircle,
      title: "Viver no escuro",
      quote: '"Nunca sei se vai sobrar dinheiro"',
      description: "Vive sem saber pra onde seu dinheiro está indo.",
    },
  ] : locale === "en" ? [
    {
      icon: Table2,
      title: "Spreadsheet fatigue",
      quote: '"I can\'t stand opening Excel anymore"',
      description: "You just want to know how much you can spend, not become an accountant.",
    },
    {
      icon: Brain,
      title: "Lack of consistency",
      quote: '"I always forget to log expenses"',
      description: "You try, but by month's end you don't remember half your purchases.",
    },
    {
      icon: CreditCard,
      title: "Credit card fear",
      quote: '"Credit card bill is always a surprise"',
      description: "The bill arrives and you think: did I spend all that?",
    },
    {
      icon: HelpCircle,
      title: "Living in the dark",
      quote: '"I never know if money will be left"',
      description: "You live without knowing where your money is going.",
    },
  ] : [
    {
      icon: Table2,
      title: "Fatiga de hojas de cálculo",
      quote: '"No puedo más con Excel"',
      description: "Solo quieres saber cuánto puedes gastar, no volverte contador.",
    },
    {
      icon: Brain,
      title: "Falta de constancia",
      quote: '"Siempre olvido registrar gastos"',
      description: "Intentas, pero a fin de mes no recuerdas la mitad de las compras.",
    },
    {
      icon: CreditCard,
      title: "Miedo a la factura",
      quote: '"La factura de tarjeta siempre es sorpresa"',
      description: "Llega la factura y piensas: ¿gasté todo eso?",
    },
    {
      icon: HelpCircle,
      title: "Vivir a oscuras",
      quote: '"Nunca sé si sobrará dinero"',
      description: "Vives sin saber a dónde va tu dinero.",
    },
  ] as const;

  const ProblemCard = memo(({ problem, index }: { problem: typeof PROBLEMS[number]; index: number }) => {
    return (
      <div className="group bg-card rounded-2xl p-6 md:p-8 border border-border/60 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
            <problem.icon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
              {problem.title}
            </h3>
            <p className="text-base italic text-foreground/80 mb-2">
              {problem.quote}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {problem.description}
            </p>
          </div>
        </div>
      </div>
    );
  });

  ProblemCard.displayName = "ProblemCard";

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
      {/* Nova faixa intermediária - Sua vida organizada sem esforço */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 rounded-3xl mx-4 md:mx-8 p-8 md:p-12 border border-green-300">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-6">
              {t("landing", "organizedLifeTitle")}
            </h2>
            <p className="text-base md:text-lg text-green-800 mb-6">
              {t("landing", "organizedLifeSubtitle")}
            </p>
            <p className="text-lg md:text-xl font-semibold text-green-700">
              {t("landing", "organizedLifeClosing")}
            </p>
          </div>
          
          {/* Imagem do wireframe */}
          <div className="mt-8 max-w-4xl mx-auto">
            <img 
              src="/wirefrane.png" 
              alt="Demo do aplicativo" 
              className="rounded-xl w-full h-auto"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            {t("landing", "problemSubtitle")}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            {t("landing", "problemTitle")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {t("landing", "problemDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {PROBLEMS.map((problem, index) => (
            <ProblemCard key={index} problem={problem} index={index} />
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">{t("landing", "problemIdentified")}</span>
            <br />
            {t("landing", "problemCreated")}
          </p>
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F9D58] hover:bg-[#0C7A45] text-white font-semibold px-8"
          >
            {t("landing", "problemCTA")}
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("landing", "problemModalTitle")}</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                {t("landing", "problemModalDescription")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("landing", "problemModalTestInfo")}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
});

Problem.displayName = "Problem";

export default Problem;
