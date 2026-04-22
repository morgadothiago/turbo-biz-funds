import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, apiEndpoints } from "@/lib/api/client";
import { z } from "zod";

const logoWeb = "/logoweb.png";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter ao menos 1 letra maiúscula")
      .regex(/[0-9]/, "Deve conter ao menos 1 número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FieldErrors = { password?: string; confirmPassword?: string };

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      await api.post(apiEndpoints.auth.resetPassword, { token, password });
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string };

      if (apiErr?.status === 400 || apiErr?.status === 422 || apiErr?.status === 404) {
        toast.error("Link inválido ou expirado. Solicite um novo link.");
        navigate("/recuperar-senha");
        return;
      }

      toast.error(apiErr?.message ?? "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
              <p className="text-lg font-semibold text-foreground">Senha redefinida!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Sua senha foi atualizada. Faça login para continuar.
              </p>
            </div>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Ir para o login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Nova senha</h1>
          {!token && (
            <p className="text-sm text-destructive mt-1">
              Link inválido. Solicite um novo link de recuperação.
            </p>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  className={`pl-11 pr-20 h-11 ${errors.password ? "border-destructive" : "focus:border-primary"}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password
                ? <p className="text-xs text-destructive">{errors.password}</p>
                : <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 maiúscula e 1 número</p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                  className={`pl-11 h-11 ${errors.confirmPassword ? "border-destructive" : "focus:border-primary"}`}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button variant="hero" size="lg" className="w-full h-11" type="submit" disabled={isLoading || !token}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
              ) : (
                <>Salvar nova senha<ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          <Link to="/recuperar-senha" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Usar outro email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
