import { MessageCircle, Image, Mic, FileText, CheckCircle2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import { useState, useEffect } from "react";

const MESSAGES = [
  { id: 1, from: "user",  text: "Gastei R$ 89,90 no supermercado hoje 🛒", time: "09:14" },
  { id: 2, from: "bot",   text: "✅ Registrado! Supermercado — R$ 89,90 na categoria Alimentação.", time: "09:14" },
  { id: 3, from: "user",  text: "Qual meu saldo esse mês?", time: "09:15" },
  { id: 4, from: "bot",   text: "💰 Saldo atual: R$ 1.840,00\n📉 Gastos: R$ 1.260,00\n🎯 Meta mensal: R$ 3.000,00", time: "09:15" },
  { id: 5, from: "user",  text: "Recebi meu salário de R$ 4.500,00 hoje", time: "09:16" },
  { id: 6, from: "bot",   text: "🎉 Receita registrada! R$ 4.500,00 — Salário.\nNovo saldo: R$ 6.340,00 💚", time: "09:16" },
];

const TYPING_DELAY = 900;
const MESSAGE_DELAY = 1400;
const RESTART_DELAY = 3000;

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatsAppChat() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      while (!cancelled) {
        setVisible([]);
        setTyping(false);
        await delay(600);

        for (const msg of MESSAGES) {
          if (cancelled) return;
          if (msg.from === "bot") {
            setTyping(true);
            await delay(TYPING_DELAY);
            if (cancelled) return;
            setTyping(false);
          }
          setVisible((prev) => [...prev, msg.id]);
          await delay(MESSAGE_DELAY);
        }

        await delay(RESTART_DELAY);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex-1 p-3 space-y-2.5 overflow-hidden flex flex-col justify-end">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      {MESSAGES.filter((m) => visible.includes(m.id)).map((msg) => (
        <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
          <div className={`px-3 py-2 rounded-lg shadow-sm max-w-[82%] text-sm text-gray-800 ${msg.from === "user" ? "bg-[#DCF8C6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
            <p className="whitespace-pre-line leading-snug">{msg.text}</p>
            <span className="text-[10px] text-gray-400 block text-right mt-1">{msg.time} {msg.from === "user" ? "✓✓" : ""}</span>
          </div>
        </div>
      ))}
      {typing && <TypingIndicator />}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const WhatsAppConnect = () => {
  const contentRef = useReveal();
  const phoneRef = useReveal(200);

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background decoration */}
      <div className="blob w-96 h-96 bg-cyan-400/5 top-0 left-0 animate-blob" />
      <div className="blob w-72 h-72 bg-blue-600/5 bottom-0 right-0 animate-blob" style={{ animationDelay: '-5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div ref={contentRef} className="order-2 lg:order-1">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Integração Total
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Conecte seu WhatsApp à plataforma
            </h2>

            <p className="text-lg text-white/60 mb-8">
              Conecte seu WhatsApp e envie imagens, texto e áudio para registrar despesas.
              Tudo fica salvo na plataforma automaticamente. Simplifique a gestão com a ferramenta que você já usa todos os dias.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Image, text: "Envie comprovantes e documentos por foto" },
                { icon: Mic, text: "Grave áudios para registrar despesas rápido" },
                { icon: FileText, text: "Receba relatórios automáticos em PDF" },
                { icon: CheckCircle2, text: "Confirmação instantânea de transações" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <span className="text-white font-medium">{item.text}</span>
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

                  {/* Animated Chat */}
                  <div className="flex-1 relative overflow-hidden flex flex-col justify-end pb-2">
                    <WhatsAppChat />
                  </div>

                  {/* Input bar */}
                  <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 border-t border-gray-200">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-gray-400">Mensagem</div>
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative bloobs behind phone */}
              <div className="absolute top-10 -right-10 w-20 h-20 bg-warning/20 rounded-full blur-xl animate-float" />
              <div className="absolute bottom-20 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />

              {/* Floating Cards */}
              <div className="absolute top-1/3 -right-12 bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/10 animate-float hidden lg:block" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Nota Fiscal</div>
                    <div className="text-sm font-bold text-white">Processada</div>
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
