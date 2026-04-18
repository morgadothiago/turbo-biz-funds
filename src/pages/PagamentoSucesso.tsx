import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const logoWeb = "/logoweb.png";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  business: "Business",
};

const PagamentoSucesso = () => {
  const location = useLocation();
  const plan = (location.state as { plan?: string })?.plan ?? "pro";
  const planLabel = PLAN_LABELS[plan] ?? "Pro";
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
          <img
            src={logoWeb}
            alt="doutorcash"
            className="h-12 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Ícone de sucesso animado */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
              <CheckCircle2 className="w-14 h-14 text-primary" strokeWidth={1.5} />
            </div>
            <span className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </span>
          </div>
        </div>

        {/* Mensagem */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento confirmado!
          </h1>
          <p className="text-muted-foreground mb-6">
            Sua assinatura do plano{" "}
            <span className="font-semibold text-primary">{planLabel}</span> está ativa.
            Bem-vindo ao doutorcash!
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">Acesso imediato à plataforma</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">Confirmação enviada para seu e-mail</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">Suporte disponível pelo WhatsApp</span>
            </div>
          </div>

          <Button asChild variant="hero" size="lg" className="w-full h-12">
            <Link to="/login">
              Acessar minha conta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Dúvidas?{" "}
          <a href="#" className="text-primary hover:underline">
            Fale com nosso suporte
          </a>
        </p>
      </div>
    </div>
  );
};

export default PagamentoSucesso;
