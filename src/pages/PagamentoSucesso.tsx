import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, BarChart3, Brain, CreditCard, Repeat2, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AUTH_BG, AUTH_LOGO } from "@/features/auth/constants";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  "pro-monthly": "Pro Mensal",
  "pro-annual": "Pro Anual",
  business: "Business",
};

const REDIRECT_SECONDS = 5;

const PagamentoSucesso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan =
    (location.state as { plan?: string })?.plan ??
    new URLSearchParams(location.search).get("plan") ??
    "pro";
  const planLabel = PLAN_LABELS[plan] ?? "Pro";
  const hasInit = useRef(false);
  const { refreshUser } = useAuth();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    sessionStorage.removeItem("pendingPaymentPlan");
    sessionStorage.removeItem("postRegisterRedirect");
    refreshUser();
    requestAnimationFrame(() => setVisible(true));
  }, [refreshUser]);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/login", { replace: true });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, navigate]);

  const circumference = 2 * Math.PI * 26;
  const progress = (seconds / REDIRECT_SECONDS) * circumference;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: AUTH_BG }}
    >
      <style>{`
        @keyframes orb-pulse   { 0%,100%{transform:scale(1) translate(0,0);opacity:.18} 33%{transform:scale(1.18) translate(20px,-30px);opacity:.28} 66%{transform:scale(.88) translate(-15px,20px);opacity:.14} }
        @keyframes orb-pulse-b { 0%,100%{transform:scale(1) translate(0,0);opacity:.14} 40%{transform:scale(1.22) translate(-25px,15px);opacity:.24} 70%{transform:scale(.85) translate(20px,-20px);opacity:.10} }
        @keyframes orb-pulse-c { 0%,100%{transform:scale(1) translate(0,0);opacity:.10} 50%{transform:scale(1.3) translate(10px,25px);opacity:.20} }
        @keyframes pop-in { 0%{transform:scale(.7) translateY(20px);opacity:0} 70%{transform:scale(1.03) translateY(-3px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes draw-check { 0%{stroke-dashoffset:60} 100%{stroke-dashoffset:0} }
        @keyframes ring-glow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.15;transform:scale(1.2)} }
        @keyframes confetti-fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
      `}</style>

      {/* Orbs — mesmo do login */}
      <div className="absolute top-[10%] left-[8%] w-24 h-24 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(37,211,102,.2),rgba(37,211,102,.04) 70%)", border: "1px solid rgba(37,211,102,.35)", animation: "orb-pulse 9s ease-in-out infinite", boxShadow: "0 0 30px rgba(37,211,102,.18)" }}>
        <MessageCircle className="w-10 h-10 text-[#25D366]" />
      </div>
      <div className="absolute bottom-[18%] right-[7%] w-28 h-28 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(56,189,248,.2),rgba(56,189,248,.04) 70%)", border: "1px solid rgba(56,189,248,.35)", animation: "orb-pulse-b 12s ease-in-out infinite 1.5s", boxShadow: "0 0 30px rgba(56,189,248,.18)" }}>
        <BarChart3 className="w-12 h-12 text-[#38BDF8]" />
      </div>
      <div className="absolute top-[52%] left-[4%] w-20 h-20 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.2),rgba(167,139,250,.04) 70%)", border: "1px solid rgba(167,139,250,.35)", animation: "orb-pulse-c 7s ease-in-out infinite 3s", boxShadow: "0 0 24px rgba(167,139,250,.18)" }}>
        <Brain className="w-8 h-8 text-[#A78BFA]" />
      </div>
      <div className="absolute top-[18%] right-[10%] w-20 h-20 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,.2),rgba(251,191,36,.04) 70%)", border: "1px solid rgba(251,191,36,.35)", animation: "orb-pulse-b 10s ease-in-out infinite .8s", boxShadow: "0 0 24px rgba(251,191,36,.18)" }}>
        <CreditCard className="w-8 h-8 text-[#FBBF24]" />
      </div>
      <div className="absolute bottom-[8%] left-[15%] w-16 h-16 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(251,146,60,.2),rgba(251,146,60,.04) 70%)", border: "1px solid rgba(251,146,60,.35)", animation: "orb-pulse-c 8s ease-in-out infinite 2s", boxShadow: "0 0 20px rgba(251,146,60,.18)" }}>
        <Repeat2 className="w-7 h-7 text-[#FB923C]" />
      </div>
      <div className="absolute top-[38%] right-[4%] w-16 h-16 rounded-full pointer-events-none hidden md:flex items-center justify-center"
        style={{ background: "radial-gradient(circle,rgba(74,222,128,.2),rgba(74,222,128,.04) 70%)", border: "1px solid rgba(74,222,128,.35)", animation: "orb-pulse 11s ease-in-out infinite 4s", boxShadow: "0 0 20px rgba(74,222,128,.18)" }}>
        <Wallet className="w-7 h-7 text-[#4ADE80]" />
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="absolute w-2 h-2 rounded-sm" style={{
            left: `${4 + (i * 4.8) % 90}%`,
            top: "-8px",
            backgroundColor: ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4"][i % 6],
            opacity: visible ? 1 : 0,
            animation: visible ? `confetti-fall ${1.4 + (i % 5) * 0.35}s ease-in ${(i % 8) * 0.12}s forwards` : "none",
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-12px)", transition: "all .5s ease" }}>
          <img src={AUTH_LOGO} alt="doutorcash" className="h-12 w-auto mx-auto" />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(16,185,129,.2),0_32px_64px_rgba(0,0,0,.5)]"
          style={{
            background: "linear-gradient(180deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,.03) 100%)",
            border: "1px solid rgba(16,185,129,.35)",
            backdropFilter: "blur(20px)",
            animation: visible ? "pop-in .55s cubic-bezier(.34,1.56,.64,1) forwards" : "none",
            opacity: 0,
          }}
        >
          {/* Top accent — emerald */}
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg,transparent,#10b981,transparent)" }} />

          <div className="p-8 text-center">

            {/* Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60"
                  style={{ animation: "ring-glow 2.2s ease-in-out infinite" }} />
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="4" />
                  <circle cx="30" cy="30" r="26" fill="rgba(16,185,129,.12)" />
                  <polyline
                    points="18,30 26,38 42,22"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="60"
                    style={{
                      transformOrigin: "center",
                      transform: "rotate(90deg) translate(0,-60px)",
                      animation: visible ? "draw-check .5s ease-out .35s forwards" : "none",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-white mb-1">Assinatura ativada!</h1>
            <p className="text-white/60 text-sm mb-1">
              Plano <span className="text-emerald-400 font-semibold">{planLabel}</span> está ativo
            </p>
            <p className="text-white/30 text-xs mb-7">Confirmação enviada para seu e-mail</p>

            {/* Benefits */}
            <div className="space-y-2.5 mb-8 text-left">
              {[
                "Acesso imediato à plataforma",
                "Recursos completos desbloqueados",
                "Suporte prioritário ativo",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <svg width="9" height="9" viewBox="0 0 9 9">
                      <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/60">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA with countdown */}
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-[.98]"
              style={{
                background: "linear-gradient(135deg,#059669,#10b981)",
                boxShadow: "0 0 28px rgba(16,185,129,.4), 0 4px 16px rgba(0,0,0,.3)",
              }}
            >
              <div className="relative w-7 h-7 shrink-0">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="6" />
                  <circle
                    cx="30" cy="30" r="26"
                    fill="none"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{seconds}</span>
              </div>
              Ir para o login
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-white/20 mt-3">
              Redirecionando automaticamente em {seconds}s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentoSucesso;
