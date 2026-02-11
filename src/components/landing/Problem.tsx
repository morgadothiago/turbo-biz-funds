import { memo, useState } from "react";
import { Table2, Brain, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PROBLEMS = [
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

const Problem = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            A gente entende
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            A gente sabe como é...
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Você não precisa de mais uma ferramenta complicada.
            Precisa de algo que funcione no seu dia a dia, sem esforço.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {PROBLEMS.map((problem, index) => (
            <ProblemCard key={index} problem={problem} index={index} />
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">Se identificou?</span>
            <br />
            A gente criou algo pra você nunca mais passar por isso.
          </p>
          <Button variant="hero" size="lg" onClick={() => setIsModalOpen(true)}>
            Quero organizar minhas finanças
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Comece agora</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Deixe seu email para começar a organizar suas finanças pelo WhatsApp.
              </p>
              <p className="text-sm text-muted-foreground">
                Você receberá acesso ao teste de R$ 9,90.
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
