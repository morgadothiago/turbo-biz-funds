import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, apiEndpoints } from "@/lib/api/client";
import { resetPasswordSchema } from "@/features/auth/schemas/auth.schema";

const logoWeb = "/logoweb.png";

type FieldErrors = {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
};

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>((location.state as { email?: string })?.email ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({ email, code, password, confirmPassword });
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
      await api.post(apiEndpoints.auth.resetPassword, { email, code, newPassword: password });
      setSuccess(true);
      toast.success("Senha redefinida com sucesso!");
    } catch (err: unknown) {
      const apiErr = err as { status?: number };
      if (apiErr?.status === 401) {
        setErrors({ code: "Código inválido, expirado ou já utilizado" });
      } else {
        toast.error("Não foi possível redefinir a senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Senha redefinida!</h1>
          <p className="text-muted-foreground mb-8">
            Sua senha foi alterada com sucesso. Faça login com sua nova senha.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="w-full h-11"
            onClick={() => navigate("/login")}
          >
            Ir para o login
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

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
            Redefinir senha
          </h1>
          <p className="text-muted-foreground">
            Insira o código recebido por email e crie uma nova senha
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
                    clearError("email");
                  }}
                  className={`pl-11 h-11 transition-all ${
                    errors.email
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Código de verificação</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(val) => {
                    setCode(val);
                    clearError("code");
                  }}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {errors.code && (
                <p className="text-xs text-destructive flex items-center gap-1 justify-center">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.code}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  className={`pl-11 h-11 transition-all ${
                    errors.password
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  className={`pl-11 h-11 transition-all ${
                    errors.confirmPassword
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.confirmPassword}
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
                  Redefinindo...
                </>
              ) : (
                <>
                  Redefinir senha
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          <Link
            to="/recuperar-senha"
            className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Reenviar código
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
