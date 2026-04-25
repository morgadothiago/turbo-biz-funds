import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api, apiEndpoints } from "@/lib/api/client";
import { forgotPasswordSchema } from "@/features/auth/schemas/auth.schema";
import { AUTH_BG, AUTH_LOGO } from "@/features/auth/constants";

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
    } catch {
      // Não diferenciamos erros de "email não encontrado" vs erros reais
      // para evitar enumeração de usuários cadastrados.
    } finally {
      setIsLoading(false);
      setSent(true);
    }
  };

  if (sent) {
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
              <p className="text-lg font-bold text-gray-900">Verifique seu email</p>
              <p className="text-sm text-gray-500 mt-1">
                Se <span className="font-semibold text-gray-800">{email}</span> estiver cadastrado, você receberá um link em instantes. Verifique também a caixa de spam.
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full h-11 bg-[#1a3799] hover:bg-[#1a3799]/90 text-white font-semibold rounded-xl">
                Voltar para o login
              </Button>
            </Link>
          </div>
          <p className="text-center text-white/60 mt-6">
            <Link to="/login" className="inline-flex items-center gap-1 text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar para o login
            </Link>
          </p>
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
          <h1 className="text-2xl font-bold text-white mb-2">Recuperar senha</h1>
          <p className="text-white/60">Insira seu email cadastrado para redefinir sua senha</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(undefined); }}
                  className={`pl-11 h-11 border-gray-200 ${emailError ? "border-red-400" : "focus:border-[#1a3799]"}`}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-describedby={emailError ? "email-error" : undefined}
                  aria-invalid={!!emailError}
                />
              </div>
              {emailError && (
                <p id="email-error" role="alert" className="text-xs text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 inline-block" aria-hidden="true" />{emailError}
                </p>
              )}
            </div>

            <Button
              className="w-full h-11 bg-[#1a3799] hover:bg-[#1a3799]/90 text-white font-semibold rounded-xl"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
                : <>Continuar<ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/60 mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
