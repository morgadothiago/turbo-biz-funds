import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Check, Loader2, Mail, User, Phone } from "lucide-react";
import { toast } from "sonner";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    receberNovidades: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error("Por favor, preencha nome e email");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset and close after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        receberNovidades: true,
      });
      onClose();
      toast.success("Você será redirecionado para o login!");
    }, 2000);
  };

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      if (cleaned.length <= 2) {
        return cleaned;
      } else if (cleaned.length <= 7) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      }
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 overflow-hidden">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Cadastro realizado!
            </h3>
            <p className="text-muted-foreground">
              Em breve você receberá um email com as próximas etapas.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-accent/5">
              <DialogTitle className="text-xl text-center">
                Comece sua jornada financeira
              </DialogTitle>
              <DialogDescription className="text-center">
                Preencha seus dados e comece a organizar suas finanças hoje mesmo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome completo *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">
                  Telefone (opcional)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefone: formatTelefone(e.target.value),
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="novidades"
                  checked={formData.receberNovidades}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, receberNovidades: checked as boolean })
                  }
                />
                <Label
                  htmlFor="novidades"
                  className="text-sm text-muted-foreground font-normal leading-tight cursor-pointer"
                >
                  Quero receber novidades e dicas de organização financeira
                </Label>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Quero organizar minhas finanças
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>

              <p className="text-xs text-center text-muted-foreground pt-2">
                Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
