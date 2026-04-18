import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Check,
  Copy,
  CheckCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { usePlanInfo } from "@/features/payments/hooks/use-plan-info";
import { api, apiEndpoints } from "@/lib/api/client";
import { toast } from "sonner";

const logoWeb = "/logoweb.png";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

type PaymentMethod = "cartao" | "pix";

interface PlanDisplay {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

interface PaymentIntent {
  paymentId: string;
  method: PaymentMethod;
  status: string;
  expiresAt?: string;
  pix?: {
    qrCodeBase64: string;
    qrCodeText: string;
    expiresInSeconds: number;
  };
  amount: number;
  currency: string;
}

// ----- Formulário de Cartão -----
function CardForm({
  isLoading,
  onSubmit,
  planInfo,
}: {
  isLoading: boolean;
  onSubmit: (card: { number: string; holderName: string; expiryMonth: string; expiryYear: string; cvv: string }) => void;
  planInfo: PlanDisplay;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Número do cartão inválido";
    if (cardName.trim().length < 3) errs.cardName = "Nome inválido";
    if (expiry.length < 5) errs.expiry = "Data inválida";
    if (cvv.length < 3) errs.cvv = "CVV inválido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const [expiryMonth, expiryYear] = expiry.split("/");
    onSubmit({
      number: cardNumber.replace(/\s/g, ""),
      holderName: cardName,
      expiryMonth,
      expiryYear,
      cvv,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-sm font-medium">
          Número do cartão
        </Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
            }}
            className={`pl-11 h-11 font-mono tracking-widest ${
              errors.cardNumber ? "border-destructive" : "focus:border-primary"
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName" className="text-sm font-medium">
          Nome no cartão
        </Label>
        <Input
          id="cardName"
          type="text"
          placeholder="Como aparece no cartão"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value.toUpperCase());
            if (errors.cardName) setErrors({ ...errors, cardName: "" });
          }}
          className={`h-11 uppercase tracking-wide ${
            errors.cardName ? "border-destructive" : "focus:border-primary"
          }`}
          disabled={isLoading}
        />
        {errors.cardName && <p className="text-xs text-destructive">{errors.cardName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-sm font-medium">
            Validade
          </Label>
          <Input
            id="expiry"
            type="text"
            inputMode="numeric"
            placeholder="MM/AA"
            value={expiry}
            onChange={(e) => {
              setExpiry(formatExpiry(e.target.value));
              if (errors.expiry) setErrors({ ...errors, expiry: "" });
            }}
            className={`h-11 font-mono ${
              errors.expiry ? "border-destructive" : "focus:border-primary"
            }`}
            disabled={isLoading}
          />
          {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-sm font-medium">
            CVV
          </Label>
          <Input
            id="cvv"
            type="text"
            inputMode="numeric"
            placeholder="000"
            value={cvv}
            onChange={(e) => {
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
              if (errors.cvv) setErrors({ ...errors, cvv: "" });
            }}
            className={`h-11 font-mono ${
              errors.cvv ? "border-destructive" : "focus:border-primary"
            }`}
            disabled={isLoading}
          />
          {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
        </div>
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full h-12 mt-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando pagamento...
          </>
        ) : (
          <>
            Pagar {planInfo.price}/mês
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}

// ----- Formulário de Pix -----
function PixForm({
  intent,
  isCheckingStatus,
  onCheckStatus,
}: {
  intent: PaymentIntent | null;
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(intent?.pix?.expiresInSeconds ?? 15 * 60);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const expired = seconds <= 0;
  const pixCode = intent?.pix?.qrCodeText ?? null;
  const qrBase64 = intent?.pix?.qrCodeBase64 ?? null;

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div
        className={`flex items-center justify-center gap-2 text-sm font-medium rounded-lg px-4 py-2 ${
          expired ? "bg-destructive/10 text-destructive" : "bg-primary/8 text-primary"
        }`}
      >
        <Clock className="w-4 h-4 shrink-0" />
        {expired ? "QR Code expirado" : `QR Code válido por ${mm}:${ss}`}
      </div>

      <div className="flex flex-col items-center gap-3">
        {qrBase64 ? (
          <img
            src={`data:image/png;base64,${qrBase64}`}
            alt="QR Code Pix"
            className={`w-44 h-44 rounded-xl border-2 object-contain ${
              expired ? "border-border/40 opacity-40" : "border-primary/30"
            }`}
          />
        ) : (
          <div className="w-44 h-44 rounded-xl border-2 border-border/40 flex items-center justify-center bg-muted/20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">
          Abra o app do seu banco e escaneie o QR Code
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-xs text-muted-foreground">ou copie o código</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Pix Copia e Cola</Label>
        {!intent ? (
          <div className="flex items-center gap-2 h-11 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando código Pix...
          </div>
        ) : pixCode ? (
          <div className="flex gap-2">
            <Input
              readOnly
              value={pixCode}
              className="h-11 font-mono text-xs text-muted-foreground bg-muted/40 truncate"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={handleCopy}
              disabled={expired}
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 h-11 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            Falha ao gerar código Pix. Tente novamente.
          </div>
        )}
        {copied && <p className="text-xs text-primary">Código copiado!</p>}
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        className="w-full h-12"
        disabled={isCheckingStatus || expired || !intent}
        onClick={onCheckStatus}
      >
        {isCheckingStatus ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verificando pagamento...
          </>
        ) : (
          <>
            Já fiz o pagamento
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        O pagamento via Pix é confirmado em até 1 minuto após o envio.
      </p>
    </div>
  );
}

// ----- Página principal -----
const Pagamento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = (location.state as { plan?: string })?.plan ?? "pro";
  const showSteps = plan === "pro" || plan === "business";

  const { planInfo: apiPlanInfo, isLoading: isPlanLoading } = usePlanInfo(plan);

  const planInfo: PlanDisplay = apiPlanInfo ?? {
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    price: "—",
    period: "/mês",
    description: "",
    features: [],
  };

  const [method, setMethod] = useState<PaymentMethod>("cartao");
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Cria o intent ao trocar para Pix
  useEffect(() => {
    if (method !== "pix") return;
    setIntent(null);
    setIsCreatingIntent(true);
    api
      .post<{ data: PaymentIntent }>(apiEndpoints.payments.intent, { plan, method: "pix" })
      .then((res) => setIntent(res.data))
      .catch(() => toast.error("Erro ao gerar QR Code Pix. Tente novamente."))
      .finally(() => setIsCreatingIntent(false));
  }, [method, plan]);

  const handleCardSubmit = async (card: {
    number: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) => {
    setIsConfirming(true);
    try {
      // Passo 1: criar intent
      const intentRes = await api.post<{ data: PaymentIntent }>(
        apiEndpoints.payments.intent,
        { plan, method: "cartao" }
      );
      const paymentId = intentRes.data.paymentId;

      // Passo 2: confirmar com dados do cartão
      await api.post(apiEndpoints.payments.confirm(paymentId), { card });
      navigate("/pagamento-sucesso", { state: { plan, method } });
    } catch (err: unknown) {
      const apiError = err as { message?: string; status?: number; code?: string };
      if (apiError?.code === "CARD_DECLINED") {
        toast.error("Cartão recusado pela operadora.");
      } else if (apiError?.code === "INSUFFICIENT_FUNDS") {
        toast.error("Saldo insuficiente no cartão.");
      } else if (apiError?.code === "INVALID_CARD" || apiError?.code === "EXPIRED_CARD") {
        toast.error("Dados do cartão inválidos ou cartão vencido.");
      } else if (apiError?.status === 402) {
        toast.error(apiError.message ?? "Pagamento recusado.");
      } else if (apiError?.status === 422) {
        toast.error(apiError.message ?? "Dados de pagamento inválidos.");
      } else {
        toast.error(apiError?.message ?? "Erro ao processar pagamento. Tente novamente.");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePixStatusCheck = async () => {
    if (!intent) return;
    setIsCheckingStatus(true);
    try {
      const res = await api.get<{ data: { paymentId: string; status: string } }>(
        apiEndpoints.payments.status(intent.paymentId)
      );
      const status = res.data.status;
      if (status === "approved") {
        navigate("/pagamento-sucesso", { state: { plan, method } });
      } else if (status === "expired") {
        toast.error("QR Code expirado. Gere um novo.");
      } else {
        toast.info("Pagamento ainda não identificado. Aguarde e tente novamente.");
      }
    } catch {
      toast.error("Erro ao verificar pagamento. Tente novamente.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img src={logoWeb} alt="doutorcash" className="h-12 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">Finalizar assinatura</h1>
          <p className="text-muted-foreground">Seus dados estão protegidos com criptografia SSL</p>
        </div>

        {showSteps && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                    {s < 3 ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  {s < 3 && <div className="w-16 h-0.5 rounded-full bg-primary" />}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-10 mt-2 text-xs text-muted-foreground">
              <span>Dados pessoais</span>
              <span>Plano</span>
              <span>Pagamento</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-6 sticky top-6">
              <h2 className="font-semibold text-foreground mb-4">Resumo do pedido</h2>
              {isPlanLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">Plano {planInfo.name}</span>
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Escolhido
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-foreground">{planInfo.price}</span>
                    <span className="text-sm text-muted-foreground">{planInfo.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{planInfo.description}</p>
                  <ul className="space-y-1.5">
                    {planInfo.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="border-t border-border/60 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{planInfo.price}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground">Total hoje</span>
                  <span className="text-foreground">{planInfo.price}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                Cancele a qualquer momento. Sem fidelidade.
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground">Forma de pagamento</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  Seguro
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setMethod("cartao")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 text-sm font-medium transition-all ${
                    method === "cartao"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("pix")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 text-sm font-medium transition-all ${
                    method === "pix"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M242.4 292.5C247.8 287.1 254.4 284.1 260 284.1C265.7 284.1 272.3 287.1 277.7 292.5L416 430.8C436.8 451.5 469.2 451.5 490 430.8C510.8 410.1 510.8 377.7 490 356.9L351.6 218.5C346.2 213.1 343.2 206.5 343.2 200.9C343.2 195.3 346.2 188.7 351.6 183.2L490 44.9C510.8 24.1 510.8-8.3 490-29.1C469.2-49.9 436.8-49.9 416-29.1L277.7 109.2C272.3 114.6 265.7 117.6 260 117.6C254.4 117.6 247.8 114.6 242.4 109.2L104 -29.1C83.2-49.9 50.8-49.9 30-29.1C9.2-8.3 9.2 24.1 30 44.9L168.4 183.2C173.8 188.6 176.8 195.2 176.8 200.9C176.8 206.5 173.8 213.1 168.4 218.5L30 356.9C9.2 377.7 9.2 410.1 30 430.8C50.8 451.5 83.2 451.5 104 430.8L242.4 292.5z"/>
                  </svg>
                  Pix
                </button>
              </div>

              {method === "cartao" ? (
                <CardForm
                  isLoading={isConfirming}
                  onSubmit={handleCardSubmit}
                  planInfo={planInfo}
                />
              ) : (
                <PixForm
                  intent={isCreatingIntent ? null : intent}
                  isCheckingStatus={isCheckingStatus}
                  onCheckStatus={handlePixStatusCheck}
                />
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Ao confirmar, você concorda com nossos{" "}
              <a href="#" className="text-primary hover:underline">
                Termos de Uso
              </a>{" "}
              e autoriza a cobrança recorrente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
