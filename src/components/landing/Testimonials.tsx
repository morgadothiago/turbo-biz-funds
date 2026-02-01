import { Star, Quote } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const Testimonials = () => {
  const headerRef = useReveal();
  const testimonials = [

    {
      name: "Carlos Mendes",
      role: "CEO, Mendes Consulting",
      image: "/assets/images/avatar_male_1_1769988404233.png",
      rating: 5,
      content: "O FinanceAI transformou minha gestão financeira. Antes eu passava horas em planilhas, agora recebo tudo pelo WhatsApp. A previsão de caixa me ajudou a evitar um problema sério de liquidez.",
    },
    {
      name: "Ana Paula Silva",
      role: "Diretora Financeira, TechBrasil",
      image: "/assets/images/avatar_female_1_1769988418158.png",
      rating: 5,
      content: "Finalmente uma ferramenta que entende as necessidades de PMEs brasileiras. A IA realmente faz diferença, me deu insights que eu nunca teria sozinha.",
    },
    {
      name: "Roberto Ferreira",
      role: "Proprietário, Padaria Ferreira",
      image: "/assets/images/avatar_male_2_1769988431346.png",
      rating: 5,
      content: "Eu não entendia nada de finanças. O FinanceAI simplificou tudo pra mim. Só de mandar 'saldo' no WhatsApp já sei como está minha empresa. Incrível!",
    },
    {
      name: "Mariana Costa",
      role: "Sócia, Costa & Lima Advocacia",
      image: "/assets/images/avatar_female_2_1769988443743.png",
      rating: 5,
      content: "Gerencio 3 empresas diferentes e o FinanceAI me dá visão consolidada de tudo. Os relatórios automáticos economizam pelo menos 2 dias do meu mês.",
    },
    {
      name: "Pedro Santos",
      role: "Fundador, E-commerce Express",
      image: "/assets/images/avatar_male_3_1769989017685.png",
      rating: 5,
      content: "A integração com WhatsApp foi um game changer. Minha equipe toda usa e recebemos alertas em tempo real. Vale cada centavo do plano Business.",
    },
    {
      name: "Juliana Oliveira",
      role: "CFO, Grupo Oliveira",
      image: "/assets/images/avatar_female_3.png",
      rating: 5,
      content: "Já testei várias ferramentas de gestão financeira. O diferencial do FinanceAI é a combinação de IA + simplicidade. Parece que foi feito sob medida para a gente.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="blob w-[600px] h-[600px] bg-primary/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const cardRef = useReveal(index * 150);
            return (
              <div
                key={index}
                ref={cardRef}
                className="bg-card rounded-2xl p-8 border border-border hover-lift group"
              >
                {/* Quote icon */}
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-accent/20 group-hover:text-accent/40 transition-colors" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
