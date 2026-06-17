import { memo, useState, useEffect, useRef } from "react";
import { MessageCircle, Check, Copy, Smartphone, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QRCode from "qrcode";

const BOT_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

const STEPS = [
  {
    number: 1,
    title: "Adicione o número",
    description: BOT_PHONE
      ? `Salve o número +${BOT_PHONE} nos seus contatos como 'doutorcash'`
      : "Salve o número do doutorcash nos seus contatos",
    icon: "📱",
  },
  {
    number: 2,
    title: "Inicie a conversa",
    description: "Abra o WhatsApp e envie uma mensagem qualquer para iniciar",
    icon: "💬",
  },
  {
    number: 3,
    title: "Pronto!",
    description: "Agora é só enviar suas despesas por áudio, foto ou texto",
    icon: "✅",
  },
];

function formatPhone(raw: string): string {
  // +55 (11) 99999-9999
  const d = raw.replace(/\D/g, "");
  if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 12) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
  return `+${d}`;
}

function QRCodeCanvas({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 180,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => setError(true));
  }, [url]);

  if (error) return (
    <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted rounded-lg border border-border">
      <p className="text-xs text-muted-foreground text-center px-2">Erro ao gerar QR Code</p>
    </div>
  );

  return <canvas ref={canvasRef} className="rounded-lg" />;
}

const WhatsAppPage = memo(() => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = BOT_PHONE ?? "";
  const waUrl = phoneNumber ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}` : "";

  const copyToClipboard = () => {
    if (!phoneNumber) return;
    navigator.clipboard.writeText(formatPhone(phoneNumber));
    setCopied(true);
    toast.success("Número copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    if (!waUrl) return;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">WhatsApp</h1>
        <p className="text-muted-foreground">Conecte-se e registre despesas pelo WhatsApp</p>
      </div>

      {/* Intro Card */}
      <Card className="bg-gradient-to-r from-[#25D366] to-[#128C7E] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-white mb-1">Registre despesas pelo WhatsApp</h2>
              <p className="text-white/90">
                Envie áudio, foto ou texto e o doutorcash registra automaticamente.
              </p>
            </div>
            {waUrl && (
              <Button
                onClick={openWhatsApp}
                className="bg-white text-[#128C7E] hover:bg-white/90 font-bold gap-2 shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                Chamar no WhatsApp
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Phone Number */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Número do doutorcash</h3>
                <p className="text-sm text-muted-foreground">Salve para enviar suas despesas</p>
              </div>
            </div>

            {phoneNumber ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-lg bg-accent border border-input">
                    <span className="text-lg font-mono text-foreground">{formatPhone(phoneNumber)}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white gap-2 transition-colors shrink-0"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                {waUrl && (
                  <Button
                    onClick={openWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Número em configuração — consulte o suporte.
              </p>
            )}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📲</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Escaneie o QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Abra o WhatsApp, vá em "Novo chat" e escaneie para adicionar.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              {waUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                    <QRCodeCanvas url={waUrl} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Aponte a câmera do WhatsApp para iniciar conversa
                  </p>
                </div>
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground text-center px-4">
                    Número não configurado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Use */}
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
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      Passo {step.number}
                    </span>
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
          <div className="hidden md:flex absolute bottom-4 right-6 items-center gap-2 text-white/60">
            <span className="text-sm">Fluxo →</span>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">→ Registro automático</p>
            </div>

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
