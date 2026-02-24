import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Mail, Lock, User, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { analytics } from "@/lib/analytics";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Página de cadastro com wizard em 2 passos e design minimalista.
 */
const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData & { plan: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "pro",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateStep1 = (): boolean => {
    const result = registerSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      analytics.signup("email");
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre",
      description: "1 empresa, recursos básicos",
      features: ["Categorização básica", "Relatórios simples", "Suporte por email"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 97",
      period: "/mês",
      description: "3 empresas, IA + WhatsApp",
      popular: true,
      features: [
        "Tudo do Gratuito",
        "Categorização por IA",
        "Registro por WhatsApp",
        "Relatórios avançados",
        "Suporte prioritário",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: "R$ 297",
      period: "/mês",
      description: "Ilimitado, API + Suporte VIP",
      features: [
        "Tudo do Pro",
        "Empresas ilimitadas",
        "API de integração",
        "Suporte VIP",
        "Treinamento dedicado",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Planeja<span className="text-accent"> Aí</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 ? "Crie sua conta" : "Escolha seu plano"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1
              ? "Comece grátis e escale conforme cresce"
              : "Você pode mudar de plano a qualquer momento"}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div
              className={`w-16 h-0.5 rounded-full transition-colors ${
                step >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-center gap-16 mt-2 text-xs text-muted-foreground">
            <span>Dados pessoais</span>
            <span>Plano</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={`pl-11 h-11 ${
                        errors.name
                          ? "border-destructive focus:border-destructive"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`pl-11 h-11 ${
                        errors.email
                          ? "border-destructive focus:border-destructive"
                          : "focus:border-primary focus:ring-primary/20"
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
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={`pl-11 h-11 ${
                        errors.password
                          ? "border-destructive focus:border-destructive"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.password}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres, 1 letra maiúscula e 1 número
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      className={`pl-11 h-11 ${
                        errors.confirmPassword
                          ? "border-destructive focus:border-destructive"
                          : "focus:border-primary focus:ring-primary/20"
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
                  type="button"
                  variant="hero"
                  size="lg"
                  className="w-full h-11 mt-2"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <RadioGroup
                  value={formData.plan}
                  onValueChange={(value) => setFormData({ ...formData, plan: value })}
                  className="space-y-3"
                >
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                        formData.plan === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border/60 hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem
                        value={plan.id}
                        id={plan.id}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      />
                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-2xl font-bold text-foreground">
                            {plan.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {plan.period}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {plan.description}
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {plan.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {formData.plan === plan.id && (
                        <div className="absolute top-4 left-4">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar conta
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>

          {step === 1 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    ou continue com
                  </span>
                </div>
              </div>

              <Button variant="outline" size="lg" className="w-full mt-4 h-11" disabled={isLoading}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground mt-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-accent font-medium hover:text-primary transition-colors">
            Entrar
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="text-primary hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-primary hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
