import { AlertTriangle, Clock, Calculator, TrendingDown } from "lucide-react";

const Problem = () => {
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
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-destructive/30 transition-all duration-300 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/20 transition-colors">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
