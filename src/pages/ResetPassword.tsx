import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api, apiEndpoints } from "@/lib/api/client";
import { z } from "zod";
import { AUTH_BG, AUTH_LOGO } from "@/features/auth/constants";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/, "Deve conter ao menos 1 letra maiúscula").regex(/[0-9]/, "Deve conter ao menos 1 número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "As senhas não coincidem", path: ["confirmPassword"] });

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

  // Token ausente — redireciona imediatamente para solicitar novo link
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: AUTH_BG }}>
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <img src={AUTH_LOGO} alt="doutorcash" width={48} height={48} className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Link inválido</p>
              <p className="text-sm text-gray-500 mt-1">
                Este link de redefinição é inválido ou expirou. Solicite um novo link.
              </p>
            </div>
            <Button
              className="w-full h-11 bg-[#1a3799] hover:bg-[#1a3799]/90 text-white font-semibold rounded-xl"
              onClick={() => navigate("/recuperar-senha")}
            >
              Solicitar novo link <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: AUTH_BG }}>
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <img src={AUTH_LOGO} alt="doutorcash" width={48} height={48} className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Senha redefinida!</p>
              <p className="text-sm text-gray-500 mt-1">Sua senha foi atualizada com sucesso.</p>
            </div>
            <Button
              className="w-full h-11 bg-[#1a3799] hover:bg-[#1a3799]/90 text-white font-semibold rounded-xl"
              onClick={() => navigate("/login")}
            >
              Ir para o login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: AUTH_BG }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img src={AUTH_LOGO} alt="doutorcash" width={48} height={48} className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Nova senha</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  className={`pl-11 pr-20 h-11 border-gray-200 ${errors.password ? "border-red-400" : "focus:border-[#1a3799]"}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-describedby={errors.password ? "password-error" : "password-hint"}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password
                ? <p id="password-error" role="alert" className="text-xs text-red-500">{errors.password}</p>
                : <p id="password-hint" className="text-xs text-gray-400">Mínimo 8 caracteres, 1 maiúscula e 1 número</p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                  className={`pl-11 h-11 border-gray-200 ${errors.confirmPassword ? "border-red-400" : "focus:border-[#1a3799]"}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
              </div>
              {errors.confirmPassword && (
                <p id="confirm-error" role="alert" className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              className="w-full h-11 bg-[#1a3799] hover:bg-[#1a3799]/90 text-white font-semibold rounded-xl"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
                : <>Salvar nova senha<ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/60 mt-6">
          <Link to="/recuperar-senha" className="inline-flex items-center gap-1 text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Usar outro email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
