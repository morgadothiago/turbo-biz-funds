import { memo } from "react";
import { Star, Quote } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

// Static testimonials data moved outside component
const TESTIMONIALS = [
  {
    name: "Mariana Silva",
    role: "Designer Freelancer, São Paulo",
    image: "/assets/images/avatar_female_1_1769988418158.png",
    rating: 5,
    content: "Eu ODIAVA planilha. Agora só mando áudio pro WhatsApp e tá tudo lá. Finalmente sei pra onde meu dinheiro vai. Minha ansiedade com conta diminuiu muito!",
  },
  {
    name: "Carlos Oliveira",
    role: "Professor, Belo Horizonte",
    image: "/assets/images/avatar_male_1_1769988404233.png",
    rating: 5,
    content: "Minha esposa não acreditou quando mostrei o relatório do mês. Primeira vez que a gente conseguiu economizar juntos. Valeu cada centavo do teste.",
  },
  {
    name: "Julia Santos",
    role: "Mãe de 2 filhos, Rio de Janeiro",
    image: "/assets/images/avatar_female_2_1769988443743.png",
    rating: 5,
    content: "Com criança pequena não tenho tempo pra nada. Mando foto da nota do mercado e pronto, tá registrado. Simples assim. Recomendo pra todas as mães!",
  },
  {
    name: "Pedro Costa",
    role: "Motorista de app, Curitiba",
    image: "/assets/images/avatar_male_2_1769988431346.png",
    rating: 5,
    content: "Trabalho o dia todo e não tinha tempo de anotar nada. Agora mando um áudio rápido 'abasteci 200' e já era. No fim do mês sei exatamente quanto lucrei.",
  },
  {
    name: "Amanda Rodrigues",
    role: "Estudante de Medicina, Salvador",
    image: "/assets/images/avatar_female_3.png",
    rating: 5,
    content: "Com a correria da faculdade, eu vivia no vermelho sem perceber. Agora recebo alerta quando tô gastando demais. Me salvou de várias furadas!",
  },
  {
    name: "Fernando Lima",
    role: "Autônomo, Porto Alegre",
    image: "/assets/images/avatar_male_3_1769989017685.png",
    rating: 5,
    content: "Nunca fui de me organizar financeiramente. Com o WhatsApp ficou natural. Parece que tenho um assistente pessoal cuidando das minhas contas.",
  },
] as const;

// Memoized testimonial card component
const TestimonialCard = memo(({ testimonial, index }: {
  testimonial: typeof TESTIMONIALS[number];
  index: number
}) => {
  const cardRef = useReveal(index * 150);

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-2xl p-8 border border-border hover-lift group"
    >
      {/* Quote icon */}
      <div className="mb-6">
        <Quote className="w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
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
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
            width={48}
            height={48}
          />
        </div>
        <div>
          <div className="font-bold text-foreground">
            {testimonial.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = "TestimonialCard";

const Testimonials = memo(() => {
  const headerRef = useReveal();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="blob w-[600px] h-[600px] bg-primary/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Histórias reais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pessoas que{" "}
            <span className="gradient-text">tomaram o controle</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja como pessoas comuns estão organizando suas finanças sem estresse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
