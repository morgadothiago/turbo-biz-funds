import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "CEO, Mendes Consulting",
      avatar: "CM",
      rating: 5,
      content: "O FinanceAI transformou minha gestão financeira. Antes eu passava horas em planilhas, agora recebo tudo pelo WhatsApp. A previsão de caixa me ajudou a evitar um problema sério de liquidez.",
    },
    {
      name: "Ana Paula Silva",
      role: "Diretora Financeira, TechBrasil",
      avatar: "AS",
      rating: 5,
      content: "Finalmente uma ferramenta que entende as necessidades de PMEs brasileiras. A IA realmente faz diferença, me deu insights que eu nunca teria sozinha.",
    },
    {
      name: "Roberto Ferreira",
      role: "Proprietário, Padaria Ferreira",
      avatar: "RF",
      rating: 5,
      content: "Eu não entendia nada de finanças. O FinanceAI simplificou tudo pra mim. Só de mandar 'saldo' no WhatsApp já sei como está minha empresa. Incrível!",
    },
    {
      name: "Mariana Costa",
      role: "Sócia, Costa & Lima Advocacia",
      avatar: "MC",
      rating: 5,
      content: "Gerencio 3 empresas diferentes e o FinanceAI me dá visão consolidada de tudo. Os relatórios automáticos economizam pelo menos 2 dias do meu mês.",
    },
    {
      name: "Pedro Santos",
      role: "Fundador, E-commerce Express",
      avatar: "PS",
      rating: 5,
      content: "A integração com WhatsApp foi um game changer. Minha equipe toda usa e recebemos alertas em tempo real. Vale cada centavo do plano Business.",
    },
    {
      name: "Juliana Oliveira",
      role: "CFO, Grupo Oliveira",
      avatar: "JO",
      rating: 5,
      content: "Já testei várias ferramentas de gestão financeira. O diferencial do FinanceAI é a combinação de IA + simplicidade. Parece que foi feito sob medida para a gente.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Empresas que já{" "}
            <span className="gradient-text">transformaram suas finanças</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja o que nossos clientes estão falando sobre o FinanceAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-accent/30 group-hover:text-accent/50 transition-colors" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-warning text-warning"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
