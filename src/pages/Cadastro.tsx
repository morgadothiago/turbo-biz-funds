import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Mail, Lock, User, Building, ArrowRight, Check } from "lucide-react";

const Cadastro = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    plan: "free",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // TODO: Implementar cadastro
      console.log("Cadastro:", formData);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "R$ 0",
      description: "1 empresa, recursos básicos",
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 97/mês",
      description: "3 empresas, IA + WhatsApp",
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: "R$ 297/mês",
      description: "Ilimitado, API + Suporte VIP",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Finance<span className="text-accent">AI</span>
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

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-accent" : "bg-border"}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-accent" : "bg-border"}`} />
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nome da empresa</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <RadioGroup
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
                className="space-y-3"
              >
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.id}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    />
                    <div className="pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{plan.name}</span>
                        {plan.popular && (
                          <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                    {formData.plan === plan.id && (
                      <div className="absolute top-4 left-4">
                        <Check className="w-5 h-5 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}

            <Button variant="hero" size="lg" className="w-full" type="submit">
              {step === 1 ? "Continuar" : "Criar conta"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {step === 1 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button variant="outline" size="lg" className="w-full mt-4">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Continuar com Google
              </Button>
            </div>
          )}
        </div>

        {/* Sign in link */}
        <p className="text-center text-muted-foreground mt-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Entrar
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="underline">Termos de Uso</a> e{" "}
          <a href="#" className="underline">Política de Privacidade</a>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
