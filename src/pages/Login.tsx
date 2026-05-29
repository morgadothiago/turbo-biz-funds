import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, MessageCircle, BarChart3, Brain, CreditCard, Repeat2, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { analytics } from "@/lib/analytics";
import { AUTH_BG, AUTH_LOGO } from "@/features/auth/constants";
import { useRateLimit } from "@/features/auth/use-rate-limit";

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória").min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isLocked, secondsLeft, recordFailure, recordSuccess } = useRateLimit();

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") formattedErrors.email = issue.message;
        else if (issue.path[0] === "password") formattedErrors.password = issue.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || !validateForm()) return;
    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      recordSuccess();
      analytics.login("email");
      toast.success("Login realizado com sucesso!");
      navigate(loggedUser.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch {
      recordFailure();
      toast.error("Email ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || isLocked;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: AUTH_BG }}>

      {/* Animated orbs */}
      <style>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.18; }
          33%       { transform: scale(1.18) translate(20px, -30px); opacity: 0.28; }
          66%       { transform: scale(0.88) translate(-15px, 20px); opacity: 0.14; }
        }
        @keyframes orb-pulse-b {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.14; }
          40%       { transform: scale(1.22) translate(-25px, 15px); opacity: 0.24; }
          70%       { transform: scale(0.85) translate(20px, -20px); opacity: 0.10; }
        }
        @keyframes orb-pulse-c {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.10; }
          50%       { transform: scale(1.3) translate(10px, 25px); opacity: 0.20; }
        }
      `}</style>

      {/* Orb: WhatsApp — green */}
      <div className="absolute top-[10%] left-[8%] w-24 h-24 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(37,211,102,0.2) 0%, rgba(37,211,102,0.04) 70%)", border: "1px solid rgba(37,211,102,0.35)", animation: "orb-pulse 9s ease-in-out infinite", boxShadow: "0 0 30px rgba(37,211,102,0.18)" }}>
        <MessageCircle className="w-10 h-10" style={{ color: "#25D366" }} />
      </div>

      {/* Orb: Gráficos — cyan */}
      <div className="absolute bottom-[18%] right-[7%] w-28 h-28 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.04) 70%)", border: "1px solid rgba(56,189,248,0.35)", animation: "orb-pulse-b 12s ease-in-out infinite 1.5s", boxShadow: "0 0 30px rgba(56,189,248,0.18)" }}>
        <BarChart3 className="w-12 h-12" style={{ color: "#38BDF8" }} />
      </div>

      {/* Orb: IA — purple */}
      <div className="absolute top-[52%] left-[4%] w-20 h-20 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0.04) 70%)", border: "1px solid rgba(167,139,250,0.35)", animation: "orb-pulse-c 7s ease-in-out infinite 3s", boxShadow: "0 0 24px rgba(167,139,250,0.18)" }}>
        <Brain className="w-8 h-8" style={{ color: "#A78BFA" }} />
      </div>

      {/* Orb: Cartão — yellow */}
      <div className="absolute top-[18%] right-[10%] w-20 h-20 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.04) 70%)", border: "1px solid rgba(251,191,36,0.35)", animation: "orb-pulse-b 10s ease-in-out infinite 0.8s", boxShadow: "0 0 24px rgba(251,191,36,0.18)" }}>
        <CreditCard className="w-8 h-8" style={{ color: "#FBBF24" }} />
      </div>

      {/* Orb: Recorrências — orange */}
      <div className="absolute bottom-[8%] left-[15%] w-16 h-16 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(251,146,60,0.04) 70%)", border: "1px solid rgba(251,146,60,0.35)", animation: "orb-pulse-c 8s ease-in-out infinite 2s", boxShadow: "0 0 20px rgba(251,146,60,0.18)" }}>
        <Repeat2 className="w-7 h-7" style={{ color: "#FB923C" }} />
      </div>

      {/* Orb: Carteira — emerald */}
      <div className="absolute top-[38%] right-[4%] w-16 h-16 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.04) 70%)", border: "1px solid rgba(74,222,128,0.35)", animation: "orb-pulse 11s ease-in-out infinite 4s", boxShadow: "0 0 20px rgba(74,222,128,0.18)" }}>
        <Wallet className="w-7 h-7" style={{ color: "#4ADE80" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img src={AUTH_LOGO} alt="doutorcash" className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-white/60">Entre na sua conta para continuar</p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(27,77,191,0.25),0_32px_64px_rgba(0,0,0,0.4)]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)", border: "1px solid rgba(27,77,191,0.35)", backdropFilter: "blur(20px)" }}>
          {/* Top accent bar */}
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #1B4DBF, transparent)" }} />
          <div className="p-7">
            {isLocked && (
              <div role="alert" className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
                Muitas tentativas. Aguarde {secondsLeft}s para tentar novamente.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                    className={`auth-input pl-11 h-11 ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "bg-[#0c1938] border-[#1B4DBF]/40 text-white placeholder:text-white/40 focus:border-[#1B4DBF] focus:bg-[#0e1d42] focus:ring-[#1B4DBF]/20"
                    }`}
                    disabled={disabled}
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive inline-block" aria-hidden="true" />{errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-white/80">Senha</Label>
                  <Link to="/recuperar-senha" className="text-sm text-white/50 hover:text-white transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                    className={`auth-input pl-11 pr-11 h-11 ${
                      errors.password
                        ? "border-destructive focus:border-destructive"
                        : "bg-[#0c1938] border-[#1B4DBF]/40 text-white placeholder:text-white/40 focus:border-[#1B4DBF] focus:bg-[#0e1d42] focus:ring-[#1B4DBF]/20"
                    }`}
                    disabled={disabled}
                    autoComplete="current-password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive inline-block" aria-hidden="true" />{errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={disabled}
                className="w-full h-11 mt-2 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1B4DBF, #0B1F3A)", boxShadow: "0 0 20px rgba(27,77,191,0.4)" }}
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Entrando...</>
                  : isLocked
                  ? `Aguarde ${secondsLeft}s`
                  : <>Entrar<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 text-white/30" style={{ background: "transparent" }}>ou continue com</span>
                </div>
              </div>
              <button
                type="button"
                disabled
                title="Login com Google em breve"
                className="w-full mt-4 h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white/40 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google (em breve)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white/60 mt-6">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-[#E5E7EB] font-medium hover:text-white transition-colors">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
