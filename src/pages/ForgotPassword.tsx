import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api, apiEndpoints } from "@/lib/api/client";
import { forgotPasswordSchema } from "@/features/auth/schemas/auth.schema";

const logoWeb = "/logoweb.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.success("Código enviado! Verifique seu email.");
      navigate("/redefinir-senha", { state: { email } });
    } catch {
      toast.error("Não foi possível enviar o código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img
              src={logoWeb}
              alt="doutorcash"
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Recuperar senha
          </h1>
          <p className="text-muted-foreground">
            Insira seu email e enviaremos um código de recuperação
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(undefined);
                  }}
                  className={`pl-11 h-11 transition-all ${
                    emailError
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                  disabled={isLoading}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {emailError}
                </p>
              )}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full h-11"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar código
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
