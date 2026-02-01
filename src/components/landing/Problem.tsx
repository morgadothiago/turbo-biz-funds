import { AlertTriangle, Clock, Calculator, TrendingDown } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const Problem = () => {
  const sectionRef = useReveal();
  const problems = [
    {
      icon: Clock,
      title: "Horas perdidas com planilhas",
      description: "Você passa horas preenchendo planilhas complexas que ninguém atualiza corretamente.",
    },
    {
      icon: Calculator,
      title: "Falta de controle financeiro",
      description: "Não sabe exatamente quanto sua empresa tem em caixa ou se vai conseguir pagar as contas.",
    },
    {
      icon: TrendingDown,
      title: "Decisões no escuro",
      description: "Toma decisões importantes sem dados confiáveis ou previsões de fluxo de caixa.",
    },
    {
      icon: AlertTriangle,
      title: "Surpresas desagradáveis",
      description: "Descobre problemas financeiros tarde demais, quando já não há tempo para corrigir.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="blob w-96 h-96 bg-primary/20 -top-20 -right-20 animate-blob" />
      <div className="blob w-72 h-72 bg-destructive/10 -bottom-20 -left-20 animate-blob" style={{ animationDelay: '-8s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={sectionRef} className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            O Problema
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Gestão financeira não deveria ser{" "}
            <span className="text-destructive">tão difícil</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A maioria das pequenas e médias empresas ainda gerencia suas finanças
            de forma manual, perdendo tempo e dinheiro todos os dias.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const cardRef = useReveal(index * 150);
            return (
              <div
                key={index}
                ref={cardRef}
                className="group relative bg-card rounded-2xl p-8 border border-border shadow-sm hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/20 group-hover:scale-110 transition-all duration-300">
                    <problem.icon className="w-7 h-7 text-destructive transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-destructive transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">E se existisse uma forma mais inteligente?</span>
            <br />
            Uma ferramenta que automatiza tudo e ainda te avisa antes dos problemas acontecerem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
