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
    description: "Salve o número +55 11 99999-9999 nos seus contatos como 'OrganizaAI'",
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

const FEATURES = [
  { icon: "🎙️", title: "Áudio", description: "Fale o valor e a descrição" },
  { icon: "📸", title: "Foto", description: "Fotografe o comprovante" },
  { icon: "💬", title: "Texto", description: "Digite: 'Gastei 50 no mercado'" },
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
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-gray-600">Conecte-se e registre despesas pelo WhatsApp</p>
      </div>

      {/* Status Card - Minimalista */}
      <Card className="bg-gradient-to-r from-[#25D366] to-[#128C7E] border-none shadow-lg">
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
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Número do OrganizaAI</h3>
                <p className="text-sm text-gray-500">Salve para enviar suas despesas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-lg font-mono text-gray-900">{phoneNumber}</span>
              </div>
              <Button 
                variant="outline" 
                className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white gap-2 transition-colors"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code - Minimalista */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <QrCode className="w-16 h-16 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Ou escaneie o QR Code</h3>
                <p className="text-sm text-gray-500">
                  Abra o WhatsApp, vá em "Novo chat" e escaneie para adicionar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Use - Minimalista */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Como usar</h3>
          <div className="space-y-4">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#25D366] uppercase tracking-wider">Passo {step.number}</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 hidden md:block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features - Minimalista */}
      <div className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

WhatsAppPage.displayName = "WhatsAppPage";

export default WhatsAppPage;
