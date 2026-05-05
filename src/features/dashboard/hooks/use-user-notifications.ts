import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api/client";

const READ_STORAGE_KEY = "user:notifications:read";

export type NotificationSeverity = "info" | "warning" | "error" | "success";

export interface UserNotification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  action?: { label: string; href: string };
  createdAt: string;
}

interface SubscriptionResponse {
  status?: string;
  plan?: string;
  nextBilling?: string;
  next_billing?: string;
  trialEnd?: string;
  trial_end?: string;
  amount?: number;
}

function getReadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(READ_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReadIds(ids: string[]) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
}

async function fetchSubscription(): Promise<SubscriptionResponse | null> {
  try {
    // Tenta endpoint alternativo ou retorna null se não existir
    const res = await api.get<SubscriptionResponse>("/v1/subscriptions/me");
    return res as unknown as SubscriptionResponse;
  } catch (error: any) {
    // Se for 404 (endpoint não existe) ou 500, retorna null silenciosamente
    if (error?.status === 404 || error?.status === 500) {
      console.log("[fetchSubscription] Endpoint não disponível, usando dados padrão");
      return null;
    }
    throw error; // Repropaga outros erros
  }
}

function buildNotifications(
  plan: string,
  subscription: SubscriptionResponse | null
): UserNotification[] {
  const notifications: UserNotification[] = [];
  const now = new Date().toISOString();

  const status = subscription?.status?.toLowerCase();
  const nextBillingRaw = subscription?.nextBilling ?? subscription?.next_billing ?? null;

  // Pagamento atrasado
  if (status && ["atrasada", "overdue", "past_due", "defaulting"].includes(status)) {
    notifications.push({
      id: "payment_overdue",
      severity: "error",
      title: "Mensalidade em atraso",
      body: "Regularize seu pagamento para continuar com acesso total ao DoutorCash.",
      action: { label: "Regularizar agora", href: "/pagamento" },
      createdAt: now,
    });
  }

  // Pagamento pendente
  if (status && ["pending", "pendente", "inactive", "inativo"].includes(status)) {
    notifications.push({
      id: "payment_pending",
      severity: "warning",
      title: "Pagamento pendente de mensalidade",
      body: "Seu pagamento está aguardando confirmação. Verifique seu método de pagamento.",
      action: { label: "Verificar pagamento", href: "/pagamento" },
      createdAt: now,
    });
  }

  // Trial próximo do fim
  if (status === "trial" || status === "trial_period") {
    const trialEndRaw = subscription?.trialEnd ?? subscription?.trial_end;
    const daysLeft = trialEndRaw
      ? Math.ceil((new Date(trialEndRaw).getTime() - Date.now()) / 86_400_000)
      : null;
    if (daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) {
      notifications.push({
        id: "trial_ending",
        severity: "warning",
        title: `Trial termina em ${daysLeft} dia${daysLeft !== 1 ? "s" : ""}`,
        body: "Faça upgrade agora para não perder acesso ao DoutorCash.",
        action: { label: "Fazer upgrade", href: "/pagamento" },
        createdAt: now,
      });
    } else {
      notifications.push({
        id: "trial_active",
        severity: "info",
        title: "Você está no período de avaliação",
        body: "Aproveite todos os recursos Premium gratuitamente. Assine para continuar.",
        action: { label: "Ver planos", href: "/pagamento" },
        createdAt: now,
      });
    }
  }

  // Próxima cobrança em ≤ 3 dias
  if (nextBillingRaw && !["atrasada", "overdue", "past_due", "pending", "pendente"].includes(status ?? "")) {
    const daysUntilBilling = Math.ceil(
      (new Date(nextBillingRaw).getTime() - Date.now()) / 86_400_000
    );
    if (daysUntilBilling >= 0 && daysUntilBilling <= 3) {
      notifications.push({
        id: "billing_soon",
        severity: "info",
        title: `Cobrança em ${daysUntilBilling} dia${daysUntilBilling !== 1 ? "s" : ""}`,
        body: `Sua mensalidade será cobrada ${daysUntilBilling === 0 ? "hoje" : `em ${daysUntilBilling} dia${daysUntilBilling !== 1 ? "s" : ""}`}. Certifique-se que seu método de pagamento está ativo.`,
        createdAt: now,
      });
    }
  }

  // Plano gratuito — sugestão de upgrade (só se nenhuma outra notificação urgente)
  const hasUrgent = notifications.some((n) => n.severity === "error" || n.severity === "warning");
  if (plan === "free" && !hasUrgent && subscription === null) {
    notifications.push({
      id: "free_plan_upgrade",
      severity: "info",
      title: "Você está no plano Gratuito",
      body: "Faça upgrade para Pro ou Business e desbloqueie transações ilimitadas, metas avançadas e muito mais.",
      action: { label: "Ver planos", href: "/pagamento" },
      createdAt: now,
    });
  }

  return notifications;
}

export function useUserNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>(getReadIds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }

    let cancelled = false;
    setIsLoading(true);

    fetchSubscription().then((sub) => {
      if (cancelled) return;
      setNotifications(buildNotifications(user.plan ?? "free", sub));
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [user]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const ids = notifications.map((n) => n.id);
    setReadIds(ids);
    saveReadIds(ids);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  return { notifications, readIds, unreadCount, isLoading, markRead, markAllRead };
}
