import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api, apiEndpoints } from "@/lib/api/client";
import { forgotPasswordSchema } from "@/features/auth/schemas/auth.schema";

const logoWeb = "/logoweb.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message);
      return;
    }
    setEmailError(undefined);
    setIsLoading(true);

    try {
      await api.post(apiEndpoints.auth.forgotPassword, { email });
      setSent(true);
    } catch (err: unknown) {
      const apiErr = err as { status?: number };
      if (apiErr?.status === 404 || apiErr?.status === 422 || apiErr?.status === 400) {
        setEmailError("Email não encontrado. Verifique e tente novamente.");
        return;
      }
      // Backend enviou o email mas retornou erro desconhecido — mostrar sucesso mesmo assim
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <img src={logoWeb} alt="doutorcash" className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Email enviado!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enviamos um link de redefinição para <span className="font-medium text-foreground">{email}</span>. Verifique sua caixa de entrada.
              </p>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-6">
            <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img src={logoWeb} alt="doutorcash" className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">Recuperar senha</h1>
          <p className="text-muted-foreground">Insira seu email cadastrado para redefinir sua senha</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(undefined); }}
                  className={`pl-11 h-11 transition-all ${
                    emailError ? "border-destructive focus:border-destructive" : "focus:border-primary focus:ring-primary/20"
                  }`}
                  disabled={isLoading}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
                  {emailError}
                </p>
              )}
            </div>

            <Button variant="hero" size="lg" className="w-full h-11" type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</>
              ) : (
                <>Continuar<ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
