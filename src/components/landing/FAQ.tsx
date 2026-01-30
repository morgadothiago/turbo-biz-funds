import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona a integração com WhatsApp?",
      answer: "Após conectar sua conta do WhatsApp Business, você pode enviar comandos simples como 'saldo', 'vendas hoje' ou 'contas a pagar' e receber respostas instantâneas. Também é possível receber alertas automáticos e relatórios semanais diretamente no seu WhatsApp.",
    },
    {
      question: "A IA realmente entende perguntas em linguagem natural?",
      answer: "Sim! Nossa IA foi treinada especificamente para entender perguntas sobre finanças empresariais em português. Você pode perguntar coisas como 'Vou ter dinheiro para pagar os impostos este mês?' ou 'Como posso reduzir meus custos?' e receber respostas contextualizadas com base nos seus dados reais.",
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Absolutamente. Utilizamos criptografia de ponta a ponta (256-bit AES), servidores seguros na AWS Brasil, e seguimos as melhores práticas de segurança do mercado financeiro. Seus dados nunca são compartilhados com terceiros e você pode exportar ou deletar tudo a qualquer momento.",
    },
    {
      question: "Posso gerenciar mais de uma empresa?",
      answer: "Sim! No plano Free você gerencia 1 empresa, no Pro até 3 empresas, e no Business não há limite. Cada empresa tem seus dados separados e você pode alternar entre elas facilmente. Também é possível ter uma visão consolidada de todas.",
    },
    {
      question: "Como funcionam as previsões de fluxo de caixa?",
      answer: "Nossa IA analisa seu histórico de receitas e despesas, padrões sazonais, contas a pagar e receber, e projeta seu fluxo de caixa para 30, 60 e 90 dias. A precisão melhora quanto mais dados históricos você tem. Você recebe alertas se a previsão indicar possíveis problemas de caixa.",
    },
    {
      question: "Preciso saber de contabilidade para usar?",
      answer: "Não! O FinanceAI foi feito para empresários, não para contadores. A interface é simples e intuitiva, e a IA traduz conceitos financeiros complexos para linguagem que qualquer pessoa entende. Se você sabe usar WhatsApp, você sabe usar o FinanceAI.",
    },
    {
      question: "Posso integrar com meu banco ou sistema de vendas?",
      answer: "Estamos trabalhando em integrações com os principais bancos brasileiros e sistemas de vendas. Por enquanto, você pode importar extratos via CSV/Excel ou cadastrar lançamentos manualmente. A integração via API já está disponível no plano Business.",
    },
    {
      question: "E se eu não gostar? Posso cancelar?",
      answer: "Oferecemos garantia de 14 dias em todos os planos pagos. Se você não ficar satisfeito por qualquer motivo, devolvemos 100% do seu dinheiro sem fazer perguntas. Além disso, você pode cancelar sua assinatura a qualquer momento, sem multa ou burocracia.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Perguntas{" "}
            <span className="gradient-text">frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre o FinanceAI
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
