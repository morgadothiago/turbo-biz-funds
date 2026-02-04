import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReveal } from "@/hooks/use-reveal";

const FAQ = () => {
  const headerRef = useReveal();

  const faqs = [
    {
      question: "Preciso baixar algum aplicativo?",
      answer: "Não! Tudo funciona pelo WhatsApp que você já usa no dia a dia. O dashboard fica no navegador do celular ou computador — sem nada para instalar. É só conectar e começar a usar.",
    },
    {
      question: "Como funciona na prática?",
      answer: "Super simples: você manda uma mensagem no WhatsApp dizendo 'gastei 50 no mercado', ou manda a foto do comprovante, ou até um áudio. A IA entende, categoriza e salva pra você. Depois é só acessar o dashboard ou perguntar 'quanto gastei esse mês?' no próprio WhatsApp.",
    },
    {
      question: "Funciona com conta conjunta / casal?",
      answer: "Sim! Você pode convidar outra pessoa para acessar o mesmo dashboard. Ideal para casais ou famílias que querem organizar as finanças juntos. Cada um pode lançar gastos pelo próprio WhatsApp.",
    },
    {
      question: "Serve para empresa?",
      answer: "Não, nosso foco é 100% em finanças pessoais. Criamos uma experiência pensada para pessoas que querem organização simples, não para empresas que precisam de contabilidade ou ERP.",
    },
    {
      question: "E se eu esquecer de anotar um gasto?",
      answer: "Sem problema! Você pode adicionar gastos retroativos a qualquer momento, é só informar a data. A IA também te manda lembrete se ficar muito tempo sem registrar nada — mas de um jeito gentil, sem pressão.",
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Usamos criptografia de ponta a ponta e servidores seguros. Seus dados financeiros nunca são compartilhados com terceiros. Você pode exportar ou deletar tudo a qualquer momento.",
    },
    {
      question: "Por que não tem plano gratuito?",
      answer: "Acreditamos que quem investe R$ 9,90 para testar leva a sério a própria organização financeira. Isso nos permite oferecer suporte de qualidade e manter o produto sem anúncios ou venda de dados.",
    },
    {
      question: "E se eu não gostar? Posso cancelar?",
      answer: "Claro! Se não gostar do teste de 15 dias, é só falar com a gente que devolvemos seu dinheiro. Nos planos mensais, você cancela quando quiser pelo próprio WhatsApp, sem multa ou burocracia.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Dúvidas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Perguntas{" "}
            <span className="gradient-text">frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa saber antes de começar
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-md data-[state=open]:border-primary/20 transition-all"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary py-5 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Ainda tem dúvidas?{" "}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Fale com a gente no WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
