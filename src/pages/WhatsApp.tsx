import { memo, useState } from "react";
import { MessageCircle, Check, Copy, QrCode, Smartphone, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STEPS = [
  {
    number: 1,
    title: "Adicione o número",
    description: "Salve o número +55 11 99999-9999 nos seus contatos como 'Planeja Aí'",
    icon: "📱"
  },
  {
    number: 2,
    title: "Inicie a conversa",
    description: "Abra o WhatsApp e envie uma mensagem qualquer para iniciar",
    icon: "💬"
  },
  {
    number: 3,
    title: "Pronto!",
    description: "Agora é só enviar suas despesas por áudio, foto ou texto",
    icon: "✅"
  }
];

const WhatsAppPage = memo(() => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "+55 11 99999-9999";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    toast.success("Número copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">WhatsApp</h1>
        <p className="text-muted-foreground">Conecte-se e registre despesas pelo WhatsApp</p>
      </div>

      {/* Status Card - Minimalista */}
      <Card className="bg-gradient-to-r from-[#25D366] to-[#128C7E] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">WhatsApp Conectado</h2>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">Ativo</Badge>
              </div>
              <p className="text-white/90">
                Seu número está vinculado. Envie despesas pelo WhatsApp!
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-sm"
              onClick={() => toast.info("Em breve: desconectar")}
            >
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Phone Number - Minimalista */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Número do Planeja Aí</h3>
                <p className="text-sm text-muted-foreground">Salve para enviar suas despesas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 rounded-lg bg-accent border border-input">
                <span className="text-lg font-mono text-foreground">{phoneNumber}</span>
              </div>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white gap-2 transition-colors"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code - Minimalista */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-accent rounded-lg flex items-center justify-center border border-border">
                <QrCode className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Ou escaneie o QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Abra o WhatsApp, vá em "Novo chat" e escaneie para adicionar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Use - Minimalista */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6">Como usar</h3>
          <div className="space-y-4">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0 border border-border">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">Passo {step.number}</span>
                    </div>
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de envio */}
      <Card className="border-border shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4 relative">
          <h3 className="font-semibold text-white text-lg">Como enviar suas despesas</h3>
          <p className="text-white/80 text-sm">Envie no formato que preferir</p>
          {/* Seta indicando fluxo */}
          <div className="hidden md:flex absolute bottom-4 right-6 items-center gap-2 text-white/60">
            <span className="text-sm">Fluxo →</span>
          </div>
          {/* Seta para mobile */}
          <div className="md:hidden absolute bottom-4 right-6 animate-bounce">
            <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Áudio */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <span className="text-2xl">🎤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Áudio</h4>
                  <p className="text-xs text-muted-foreground">Fale rapidinho</p>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-sm text-foreground italic">"Gastei 50 reais na farmácia"</p>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">→ Registrado em Saúde 💊</p>
            </div>

            {/* Foto */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Foto</h4>
                  <p className="text-xs text-muted-foreground">Fotografe o comprovante</p>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border min-h-[60px] flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">→ Registro automático</p>
            </div>

            {/* Texto */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Texto</h4>
                  <p className="text-xs text-muted-foreground">Digite sua despesa</p>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-sm text-foreground">R$ 150,00 mercado</p>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">→ Categoria detectada</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

WhatsAppPage.displayName = "WhatsAppPage";

export default WhatsAppPage;
