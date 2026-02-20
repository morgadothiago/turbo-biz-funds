import { memo } from "react";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n-provider";

const Testimonials = memo(() => {
  const { t, locale } = useI18n();

  const TESTIMONIALS = locale === "pt" ? [
    {
      name: "Mariana Silva",
      role: "Designer Freelancer, São Paulo",
      image: "/assets/images/avatar_female_1.png",
      rating: 5,
      content: "Eu ODIAVA planilha. Agora só mando áudio pro WhatsApp e tá tudo lá. Finalmente sei pra onde meu dinheiro vai. Minha ansiedade com conta diminuiu muito!",
    },
    {
      name: "Carlos Oliveira",
      role: "Professor, Belo Horizonte",
      image: "/assets/images/avatar_male_1.png",
      rating: 5,
      content: "Minha esposa não acreditou quando mostrei o relatório do mês. Primeira vez que a gente conseguiu economizar juntos. Valeu cada centavo do teste.",
    },
    {
      name: "Julia Santos",
      role: "Mãe de 2 filhos, Rio de Janeiro",
      image: "/assets/images/avatar_female_2.png",
      rating: 5,
      content: "Com criança pequena não tenho tempo pra nada. Mando foto da nota do mercado e pronto, tá registrado. Simples assim. Recomendo pra todas as mães!",
    },
    {
      name: "Pedro Costa",
      role: "Motorista de app, Curitiba",
      image: "/assets/images/avatar_male_2.png",
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
      image: "/assets/images/avatar_male_3.png",
      rating: 5,
      content: "Nunca fui de me organizar financeiramente. Com o WhatsApp ficou natural. Parece que tenho um assistente pessoal cuidando das minhas contas.",
    },
  ] : locale === "en" ? [
    {
      name: "Mariana Silva",
      role: "Freelance Designer, São Paulo",
      image: "/assets/images/avatar_female_1.png",
      rating: 5,
      content: "I HATED spreadsheets. Now I just send a voice note on WhatsApp and everything is there. Finally I know where my money goes. My anxiety about bills has decreased a lot!",
    },
    {
      name: "Carlos Oliveira",
      role: "Teacher, Belo Horizonte",
      image: "/assets/images/avatar_male_1.png",
      rating: 5,
      content: "My wife didn't believe me when I showed her the monthly report. First time we managed to save together. Worth every penny of the test.",
    },
    {
      name: "Julia Santos",
      role: "Mom of 2, Rio de Janeiro",
      image: "/assets/images/avatar_female_2.png",
      rating: 5,
      content: "With little kids I don't have time for anything. I send a photo of the grocery receipt and that's it, it's recorded. Simple as that. I recommend it to all moms!",
    },
    {
      name: "Pedro Costa",
      role: "Ride-share driver, Curitiba",
      image: "/assets/images/avatar_male_2.png",
      rating: 5,
      content: "I work all day and didn't have time to record anything. Now I just send a quick voice note 'filled up 200' and that's it. At the end of the month I know exactly how much I profited.",
    },
    {
      name: "Amanda Rodrigues",
      role: "Medical Student, Salvador",
      image: "/assets/images/avatar_female_3.png",
      rating: 5,
      content: "With the rush of med school, I was living in the red without realizing it. Now I get alerts when I'm spending too much. It saved me from many pitfalls!",
    },
    {
      name: "Fernando Lima",
      role: "Self-employed, Porto Alegre",
      image: "/assets/images/avatar_male_3.png",
      rating: 5,
      content: "I was never good at organizing financially. With WhatsApp it became natural. It feels like I have a personal assistant taking care of my accounts.",
    },
  ] : [
    {
      name: "Mariana Silva",
      role: "Diseñadora Freelancer, São Paulo",
      image: "/assets/images/avatar_female_1.png",
      rating: 5,
      content: "ODIABA las hojas de cálculo. Ahora solo mando audio por WhatsApp y todo está ahí. Finalmente sé a dónde va mi dinero. Mi ansiedad por las cuentas disminuyó mucho!",
    },
    {
      name: "Carlos Oliveira",
      role: "Profesor, Belo Horizonte",
      image: "/assets/images/avatar_male_1.png",
      rating: 5,
      content: "Mi esposa no me creyó cuando le mostré el informe del mes. Primera vez que logramos ahorrar juntos. Valió cada centavo de la prueba.",
    },
    {
      name: "Julia Santos",
      role: "Madre de 2 hijos, Río de Janeiro",
      image: "/assets/images/avatar_female_2.png",
      rating: 5,
      content: "Con niños pequeños no tengo tiempo para nada. Mando foto del ticket del supermercado y listo, está registrado. Así de simple. Lo recomiendo a todas las mamás!",
    },
    {
      name: "Pedro Costa",
      role: "Conductor de app, Curitiba",
      image: "/assets/images/avatar_male_2.png",
      rating: 5,
      content: "Trabajo todo el día y no tenía tiempo de registrar nada. Ahora mando un audio rápido 'cargué 200' y listo. A fin de mes sé exactamente cuánto gané.",
    },
    {
      name: "Amanda Rodrigues",
      role: "Estudiante de Medicina, Salvador",
      image: "/assets/images/avatar_female_3.png",
      rating: 5,
      content: "Con el ajetreo de la facultad, vivía en rojo sin darme cuenta. Ahora recibo alertas cuando estoy gastando demasiado. Me salvó de muchos problemas!",
    },
    {
      name: "Fernando Lima",
      role: "Autónomo, Porto Alegre",
      image: "/assets/images/avatar_male_3.png",
      rating: 5,
      content: "Nunca fui de organizarme financieramente. Con WhatsApp se volvió natural. Es como si tuviera un asistente personal cuidando de mis cuentas.",
    },
  ] as const;

  const TestimonialCard = memo(({ testimonial }: { testimonial: typeof TESTIMONIALS[number] }) => {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border/60 hover:shadow-lg transition-all duration-300">
        <div className="mb-6">
          <Quote className="w-10 h-10 text-primary/20" />
        </div>

        <div className="flex gap-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-warning text-warning"
            />
          ))}
        </div>

        <p className="text-muted-foreground leading-relaxed mb-8 italic">
          "{testimonial.content}"
        </p>

        <div className="flex items-center gap-4 mt-auto">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
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

  return (
    <section id="depoimentos" className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("landing", "testimonialsBadge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("landing", "testimonialsTitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing", "testimonialsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
