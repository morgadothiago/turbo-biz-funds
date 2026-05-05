import { HelpCircle, MessageCircle, Mail, Phone, FileText, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const FAQ_ITEMS = [
  {
    question: "Como gerenciar usuários?",
    answer: "No painel admin, vá em 'Clientes' para gerenciar todos os usuários. Você pode alterar planos, suspender contas e ver detalhes."
  },
  {
    question: "Como criar um novo plano?",
    answer: "Acesse 'Planos' no menu admin. Clique em 'Novo Plano' e preencha os detalhes. O plano aparecerá automaticamente na landing page."
  },
  {
    question: "Onde vejo as assinaturas ativas?",
    answer: "No menu 'Assinaturas', você encontra todas as assinaturas ativas, inativas e trials. É possível filtrar por plano e status."
  },
  {
    question: "Como funciona a API de pagamentos?",
    answer: "Usamos integração com gateway de pagamentos. As intenções de pagamento são criadas no backend e confirmadas via webhook."
  },
  {
    question: "Posso personalizar as mensagens do WhatsApp?",
    answer: "Sim! No futuro, haverá opções para personalizar mensagens automáticas. Por enquanto, usamos templates padrão."
  },
];

const SUPPORT_CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp (Admin)",
    description: "Resposta prioritária para admins",
    value: "(11) 99999-9999",
    action: "https://wa.me/5511999999999",
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  },
  {
    icon: Mail,
    title: "E-mail (Admin)",
    description: "Resposta em até 12 horas",
    value: "admin@doutorcashapp.com.br",
    action: "mailto:admin@doutorcashapp.com.br",
    color: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    icon: Phone,
    title: "Telefone (Emergencial)",
    description: "Disponível 24/7 apenas para admins",
    value: "(11) 99999-9999",
    action: "tel:+5511999999999",
    color: "bg-violet-500/10",
    iconColor: "text-violet-500"
  },
];

export default function AdminSupport() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    // Simular envio (no futuro, integrar com API real)
    setTimeout(() => {
      toast.success("Mensagem enviada para a equipe admin!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(null), 2000);
  };

  // Set page title
  if (typeof document !== "undefined") {
    document.title = "Suporte Admin | DoutorCash";
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Central de Suporte Admin
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie dúvidas técnicas e de configuração da plataforma.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${channel.color}`}>
                      <Icon className={`h-5 w-5 ${channel.iconColor}`} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(channel.value, channel.title)}
                    >
                      {copied === channel.title ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-base">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm mb-3">{channel.value}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(channel.action, "_blank", "noopener noreferrer")}
                  >
                    Contatar agora
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Perguntas Frequentes (Admin)</CardTitle>
          <CardDescription>
            Respostas rápidas para dúvidas comuns de administradores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="border-b border-muted/30 pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {item.question}
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                {item.answer}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Enviar Mensagem (Admin)</CardTitle>
          <CardDescription>
            Envie uma mensagem diretamente para a equipe técnica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Nome *</Label>
                  <Input
                    id="admin-name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">E-mail *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-subject">Assunto</Label>
                <Input
                  id="admin-subject"
                  placeholder="Resumo do seu problema"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-message">Mensagem *</Label>
                <Textarea
                  id="admin-message"
                  placeholder="Descreva detalhadamente sua dúvida ou problema técnico..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Documentação Técnica</p>
                  <p className="text-xs text-muted-foreground">
                    Consulte nossos guias técnicos e API docs
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://docs.doutorcashapp.com.br/admin" target="_blank" rel="noopener noreferrer">
                  Acessar
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
