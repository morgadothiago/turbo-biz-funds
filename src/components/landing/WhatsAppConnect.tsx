import { MessageCircle, Image, Mic, FileText, CheckCircle2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";

const WhatsAppConnect = () => {
  const contentRef = useReveal();
  const phoneRef = useReveal(200);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="blob w-96 h-96 bg-success/5 top-0 left-0 animate-blob" />
      <div className="blob w-72 h-72 bg-primary/5 bottom-0 right-0 animate-blob" style={{ animationDelay: '-5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div ref={contentRef} className="order-2 lg:order-1">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Integração Total
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Conecte seu WhatsApp na plataforma
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Conecte seu WhatsApp e envie imagens, texto e áudio para gravar e trabalhar
              na sua plataforma interligada. Simplifique a gestão com a ferramenta que você já usa todos os dias.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Image, text: "Envie comprovantes e documentos por foto" },
                { icon: Mic, text: "Grave áudios para registrar despesas rápidos" },
                { icon: FileText, text: "Receba relatórios automáticos em PDF" },
                { icon: CheckCircle2, text: "Confirmação instantânea de transações" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                    <item.icon className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button size="xl" className="w-full sm:w-auto bg-[#128C7E] hover:bg-[#075E54] text-white shadow-lg hover:shadow-glow transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conectar WhatsApp Agora
            </Button>
          </div>

          {/* Visual Content */}
          <div ref={phoneRef} className="order-1 lg:order-2 relative">
            <div className="relative mx-auto max-w-[320px] lg:max-w-[400px]">
              {/* Phone Mockup Base */}
              <div className="relative z-10 bg-background border-[8px] border-muted rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Screen Content */}
                <div className="bg-[#E5DDD5] h-[600px] flex flex-col relative overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#075E54] p-4 pt-8 text-white flex items-center gap-3 shadow-md z-20">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Assistente Financeiro</div>
                      <div className="text-xs text-white/80">Online</div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                    {/* Background Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm text-gray-800">
                        <p className="mb-2">Pode cadastrar este almoço?</p>
                        <div className="relative h-40 w-48 bg-white border border-gray-200 rounded-sm shadow-inner overflow-hidden flex flex-col p-2">
                          <div className="w-12 h-1 invisible" /> {/* Spacer */}
                          <div className="flex flex-col gap-1.5">
                            <div className="h-2 w-3/4 bg-gray-100 rounded" />
                            <div className="h-2 w-1/2 bg-gray-100 rounded" />
                            <div className="mt-2 h-0.5 w-full bg-gray-50 bg-dashed" />
                            <div className="flex justify-between mt-1">
                              <div className="h-2 w-1/3 bg-gray-200 rounded" />
                              <div className="h-2 w-1/4 bg-gray-200 rounded" />
                            </div>
                            <div className="flex justify-between">
                              <div className="h-2 w-1/2 bg-gray-100 rounded" />
                              <div className="h-2 w-1/4 bg-gray-100 rounded" />
                            </div>
                            <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-2">
                              <div className="h-3 w-1/3 bg-gray-300 rounded" />
                              <div className="h-4 w-1/2 bg-primary/20 rounded" />
                            </div>
                          </div>
                          {/* Receipt "jagged" bottom effect */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[length:10px_10px]" />
                        </div>
                        <span className="text-[10px] text-gray-500 block text-right mt-2">12:30 ✓✓</span>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm text-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Mic className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500">Áudio recebido (0:15)</span>
                        </div>
                        <p>Entendido! Almoço de R$ 45,90 no Restaurante Central cadastrado.</p>
                        <span className="text-[10px] text-gray-500 block text-right mt-1">12:30</span>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm text-gray-800">
                        <p className="font-medium text-success mb-1">Relatório Diário 📊</p>
                        <p>Seu saldo atual é de <span className="font-bold">R$ 1.250,00</span>.</p>
                        <span className="text-[10px] text-gray-500 block text-right mt-1">18:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Button mimic */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white z-20">
                    <Mic className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Decorative bloobs behind phone */}
              <div className="absolute top-10 -right-10 w-20 h-20 bg-warning/20 rounded-full blur-xl animate-float" />
              <div className="absolute bottom-20 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />

              {/* Floating Cards */}
              <div className="absolute top-1/3 -right-12 bg-card p-3 rounded-xl shadow-lg border border-border animate-float hidden lg:block" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Nota Fiscal</div>
                    <div className="text-sm font-bold">Processada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatsAppConnect;
