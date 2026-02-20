import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n-provider";

const FAQ = memo(() => {
  const { t, locale } = useI18n();

  const FAQS = locale === "pt" ? [
    {
      question: "Preciso baixar algum aplicativo?",
      answer: "Não! Tudo funciona pelo WhatsApp que você já usa no dia a dia. O dashboard fica no navegador do celular ou computador — sem nada para instalar. É só conectar e começar a usar.",
    },
    {
      question: "Como funciona na prática?",
      answer: "Super simples: você manda uma mensagem no WhatsApp dizendo 'gastei 50 no mercado', ou manda a foto do comprovante, ou até um áudio. O Assistente Financeiro entende, categoriza e salva pra você. Depois é só acessar o dashboard ou perguntar 'quanto gastei esse mês?' no próprio WhatsApp.",
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
      answer: "Sem problema! Você pode adicionar gastos retroativos a qualquer momento, é só informar a data. O Assistente Financeiro também te manda lembrete se ficar muito tempo sem registrar nada — mas de um jeito gentil, sem pressão.",
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
  ] : locale === "en" ? [
    {
      question: "Do I need to download any app?",
      answer: "No! Everything works through WhatsApp that you already use daily. The dashboard is in your phone or computer browser — nothing to install. Just connect and start using.",
    },
    {
      question: "How does it work in practice?",
      answer: "Super simple: you send a WhatsApp message saying 'spent 50 at the market', or send a photo of the receipt, or even a voice note. The Financial Assistant understands, categorizes and saves it for you. Then just access the dashboard or ask 'how much did I spend this month?' on WhatsApp.",
    },
    {
      question: "Does it work with joint account / couple?",
      answer: "Yes! You can invite another person to access the same dashboard. Ideal for couples or families who want to organize finances together. Each can log expenses through their own WhatsApp.",
    },
    {
      question: "Does it work for companies?",
      answer: "No, our focus is 100% on personal finances. We created an experience designed for people who want simple organization, not for companies that need accounting or ERP.",
    },
    {
      question: "What if I forget to log an expense?",
      answer: "No problem! You can add retroactively expenses at any time, just inform the date. The Financial Assistant also sends you a reminder if you go too long without recording anything — but in a gentle way, without pressure.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use end-to-end encryption and secure servers. Your financial data is never shared with third parties. You can export or delete everything at any time.",
    },
    {
      question: "Why is there no free plan?",
      answer: "We believe that anyone who invests $9.90 to test takes their financial organization seriously. This allows us to offer quality support and maintain the product without ads or data selling.",
    },
    {
      question: "What if I don't like it? Can I cancel?",
      answer: "Of course! If you don't like the 15-day test, just talk to us and we'll refund your money. In monthly plans, you can cancel anytime via WhatsApp, without fees or bureaucracy.",
    },
  ] : [
    {
      question: "¿Necesito descargar alguna aplicación?",
      answer: "¡No! Todo funciona a través de WhatsApp que ya usas a diario. El dashboard está en el navegador de tu celular o computadora — nada que instalar. Solo conecta y comienza a usar.",
    },
    {
      question: "¿Cómo funciona en la práctica?",
      answer: "Súper simple: mandas un mensaje por WhatsApp diciendo 'gasté 50 en el mercado', o mandas la foto del recibo, o incluso un audio. La IA entiende, categoriza y guarda para ti. Luego solo accede al dashboard o pregunta 'cuánto gasté este mes?' en WhatsApp.",
    },
    {
      question: "¿Funciona con cuenta conjunta / pareja?",
      answer: "¡Sí! Puedes invitar a otra persona para acceder al mismo dashboard. Ideal para parejas o familias que quieren organizar las finanzas juntos. Cada uno puede registrar gastos por su propio WhatsApp.",
    },
    {
      question: "¿Sirve para empresa?",
      answer: "No, nuestro enfoque es 100% en finanzas personales. Creamos una experiencia pensada para personas que quieren organización simple, no para empresas que necesitan contabilidad o ERP.",
    },
    {
      question: "¿Y si olvido registrar un gasto?",
      answer: "¡Sin problema! Puedes agregar gastos retroactivos en cualquier momento, solo indica la fecha. La IA también te envía recordatorio si pasas mucho tiempo sin registrar nada — pero de manera gentil, sin presión.",
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "¡Sí! Usamos encriptación de extremo a extremo y servidores seguros. Tus datos financieros nunca se comparten con terceros. Puedes exportar o eliminar todo en cualquier momento.",
    },
    {
      question: "¿Por qué no hay plan gratuito?",
      answer: "Creemos que quien invierte $9,90 para probar se toma en serio su organización financiera. Esto nos permite ofrecer soporte de calidad y mantener el producto sin anuncios ni venta de datos.",
    },
    {
      question: "¿Y si no me gusta? ¿Puedo cancelar?",
      answer: "¡Claro! Si no te gusta la prueba de 15 días, solo háblanos y te devolvemos tu dinero. En los planes mensuales, puedes cancelar cuando quieras por WhatsApp, sin multa ni burocracia.",
    },
  ] as const;

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("landing", "faqBadge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("landing", "faqTitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing", "faqSubtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="hover:text-primary py-5">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {t("landing", "faqStillQuestions")}{" "}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              {t("landing", "faqContactWhatsApp")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = "FAQ";

export default FAQ;
