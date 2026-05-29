import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Recurrence } from "@/shared/types";
import { fmtBRL } from "@/lib/format";

const READ_STORAGE_KEY = "user:notifications:read";
const ACTIVITY_STORAGE_KEY = "user:notifications:activity";

export type NotificationSeverity = "info" | "warning" | "error" | "success";

export interface UserNotification {
  id: string;
  type?: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  action?: { label: string; href: string };
  readAt?: string | null;
  createdAt: string;
}

interface NotificationsResponse {
  data: UserNotification[];
  unreadCount: number;
}

// ─── Activity log (localStorage — used in client-side fallback) ───────────────

export interface ActivityEntry {
  id: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  action?: { label: string; href: string };
  createdAt: string;
}

function getActivityLog(): ActivityEntry[] {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function logActivity(entry: Omit<ActivityEntry, "id" | "createdAt">) {
  const log = getActivityLog();
  const newEntry: ActivityEntry = {
    ...entry,
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([newEntry, ...log].slice(0, 20)));
}

// ─── localStorage read state (client-side fallback) ──────────────────────────

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

// ─── Subscription notifications (client-side fallback) ───────────────────────

interface SubscriptionResponse {
  status?: string;
  plan?: string;
  nextBilling?: string;
  next_billing?: string;
  trialEnd?: string;
  trial_end?: string;
  amount?: number;
}

async function fetchSubscription(): Promise<SubscriptionResponse | null> {
  try {
    const res = await api.get<SubscriptionResponse>("/v1/subscriptions/me");
    return res as unknown as SubscriptionResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.status === 404 || error?.status === 500) return null;
    throw error;
  }
}

function buildSubscriptionNotifications(
  plan: string,
  subscription: SubscriptionResponse | null
): UserNotification[] {
  const notifications: UserNotification[] = [];
  const now = new Date().toISOString();
  const status = subscription?.status?.toLowerCase();
  const nextBillingRaw = subscription?.nextBilling ?? subscription?.next_billing ?? null;

  if (status && ["atrasada", "overdue", "past_due", "defaulting"].includes(status)) {
    notifications.push({
      id: "payment_overdue", severity: "error",
      title: "Mensalidade em atraso",
      body: "Regularize seu pagamento para continuar com acesso total ao DoutorCash.",
      action: { label: "Regularizar agora", href: "/pagamento" },
      createdAt: now,
    });
  }

  if (status && ["pending", "pendente", "inactive", "inativo"].includes(status)) {
    notifications.push({
      id: "payment_pending", severity: "warning",
      title: "Pagamento pendente de mensalidade",
      body: "Seu pagamento está aguardando confirmação.",
      action: { label: "Verificar pagamento", href: "/pagamento" },
      createdAt: now,
    });
  }

  if (status === "trial" || status === "trial_period") {
    const trialEndRaw = subscription?.trialEnd ?? subscription?.trial_end;
    const daysLeft = trialEndRaw
      ? Math.ceil((new Date(trialEndRaw).getTime() - Date.now()) / 86_400_000)
      : null;
    if (daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) {
      notifications.push({
        id: "trial_ending", severity: "warning",
        title: `Trial termina em ${daysLeft} dia${daysLeft !== 1 ? "s" : ""}`,
        body: "Faça upgrade agora para não perder acesso ao DoutorCash.",
        action: { label: "Fazer upgrade", href: "/pagamento" },
        createdAt: now,
      });
    } else {
      notifications.push({
        id: "trial_active", severity: "info",
        title: "Você está no período de avaliação",
        body: "Aproveite todos os recursos Premium gratuitamente. Assine para continuar.",
        action: { label: "Ver planos", href: "/pagamento" },
        createdAt: now,
      });
    }
  }

  if (nextBillingRaw && !["atrasada", "overdue", "past_due", "pending", "pendente"].includes(status ?? "")) {
    const daysUntilBilling = Math.ceil((new Date(nextBillingRaw).getTime() - Date.now()) / 86_400_000);
    if (daysUntilBilling >= 0 && daysUntilBilling <= 3) {
      notifications.push({
        id: "billing_soon", severity: "info",
        title: `Cobrança em ${daysUntilBilling} dia${daysUntilBilling !== 1 ? "s" : ""}`,
        body: `Sua mensalidade será cobrada ${daysUntilBilling === 0 ? "hoje" : `em ${daysUntilBilling} dia(s)`}.`,
        createdAt: now,
      });
    }
  }

  const hasUrgent = notifications.some((n) => n.severity === "error" || n.severity === "warning");
  if (plan === "free" && !hasUrgent && subscription === null) {
    notifications.push({
      id: "free_plan_upgrade", severity: "info",
      title: "Você está no plano Gratuito",
      body: "Faça upgrade para Pro e desbloqueie transações ilimitadas, metas avançadas e muito mais.",
      action: { label: "Ver planos", href: "/pagamento" },
      createdAt: now,
    });
  }

  return notifications;
}

// ─── Recurrence notifications (client-side fallback) ─────────────────────────

function computeNextDue(rec: Recurrence): Date | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = rec.startDate.split("T")[0].split("-").map(Number);
  let cursor = new Date(y, m - 1, d);

  const endDate = rec.endDate
    ? (() => {
        const [ey, em, ed] = rec.endDate.split("T")[0].split("-").map(Number);
        return new Date(ey, em - 1, ed);
      })()
    : null;

  if (cursor >= today) {
    if (endDate && cursor > endDate) return null;
    return cursor;
  }

  let iters = 0;
  while (cursor < today && iters < 2000) {
    switch (rec.frequency) {
      case "daily":   cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1); break;
      case "weekly":  cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7); break;
      case "monthly": cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()); break;
      case "yearly":  cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), cursor.getDate()); break;
    }
    iters++;
  }

  if (endDate && cursor > endDate) return null;
  return cursor;
}

function buildRecurrenceNotifications(recurrences: Recurrence[]): UserNotification[] {
  const notifications: UserNotification[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date().toISOString();

  recurrences
    .filter((r) => r.active && r.type === "EXPENSE")
    .forEach((rec) => {
      const nextDue = computeNextDue(rec);
      if (!nextDue) return;

      const daysUntil = Math.round((nextDue.getTime() - today.getTime()) / 86_400_000);
      const name = rec.description?.trim() || "Recorrência";
      const dateStr = nextDue.toLocaleDateString("pt-BR");
      const valor = fmtBRL(rec.amount);
      const href = `/dashboard/recorrencias/${rec.id}`;

      if (daysUntil < 0) {
        const daysLate = -daysUntil;
        notifications.push({
          id: `rec-overdue-${rec.id}`, severity: "error",
          title: `Pagamento atrasado: ${name}`,
          body: `Venceu há ${daysLate} dia${daysLate !== 1 ? "s" : ""} (${dateStr}). Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      } else if (daysUntil === 0) {
        notifications.push({
          id: `rec-today-${rec.id}`, severity: "warning",
          title: `Último dia para pagar: ${name}`,
          body: `${name} vence hoje (${dateStr}). Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      } else if (daysUntil <= 3) {
        notifications.push({
          id: `rec-soon-${rec.id}-${daysUntil}`, severity: "info",
          title: `Vence em ${daysUntil} dia${daysUntil !== 1 ? "s" : ""}: ${name}`,
          body: `${name} vence em ${dateStr}. Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      }
    });

  return notifications;
}

// ─── Client-side fallback fetch ───────────────────────────────────────────────

async function fetchClientSideNotifications(plan: string): Promise<UserNotification[]> {
  const [sub, recRes] = await Promise.all([
    fetchSubscription(),
    api
      .get<{ data: Recurrence[] }>(apiEndpoints.recurrences.active)
      .catch(() => ({ data: [] as Recurrence[] })),
  ]);

  const recurrences: Recurrence[] = Array.isArray(recRes)
    ? (recRes as unknown as Recurrence[])
    : recRes.data ?? [];

  const subNotifs = buildSubscriptionNotifications(plan, sub);
  const recNotifs = buildRecurrenceNotifications(recurrences);
  const activityNotifs: UserNotification[] = getActivityLog().map((a) => ({ ...a }));

  return [
    ...recNotifs.filter((n) => n.severity === "error"),
    ...recNotifs.filter((n) => n.severity === "warning"),
    ...subNotifs.filter((n) => n.severity === "error"),
    ...subNotifs.filter((n) => n.severity === "warning"),
    ...activityNotifs,
    ...subNotifs.filter((n) => n.severity === "info" || n.severity === "success"),
    ...recNotifs.filter((n) => n.severity === "info" || n.severity === "success"),
  ];
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useUserNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── Server-side path ──────────────────────────────────────────────────────
  const serverQuery = useQuery<NotificationsResponse>({
    queryKey: ["notifications", "server"],
    queryFn: () => api.get<NotificationsResponse>(apiEndpoints.notifications.list),
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: false,
  });

  const isServerMode = serverQuery.isSuccess;
  const isServerError = serverQuery.isError;

  // ── Client-side fallback path ─────────────────────────────────────────────
  const [clientNotifications, setClientNotifications] = useState<UserNotification[]>([]);
  const [clientReadIds, setClientReadIds] = useState<string[]>(getReadIds);
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    if (!isServerError || !user) return;

    let cancelled = false;
    setIsClientLoading(true);

    fetchClientSideNotifications(user.plan ?? "free")
      .then((notifs) => {
        if (!cancelled) {
          setClientNotifications(notifs);
          setIsClientLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsClientLoading(false);
      });

    return () => { cancelled = true; };
  }, [isServerError, user]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const notifications: UserNotification[] = isServerMode
    ? (serverQuery.data?.data ?? [])
    : clientNotifications;

  const readIds: string[] = isServerMode
    ? notifications.filter((n) => n.readAt != null).map((n) => n.id)
    : clientReadIds;

  const unreadCount = isServerMode
    ? (serverQuery.data?.unreadCount ?? 0)
    : notifications.filter((n) => !clientReadIds.includes(n.id)).length;

  const isLoading = serverQuery.isPending || isClientLoading;

  // ── Actions ───────────────────────────────────────────────────────────────
  const markRead = useCallback(async (id: string) => {
    if (isServerMode) {
      // Optimistic update
      queryClient.setQueryData<NotificationsResponse>(["notifications", "server"], (prev) => {
        if (!prev) return prev;
        const readAt = new Date().toISOString();
        const data = prev.data.map((n) => n.id === id ? { ...n, readAt } : n);
        return { data, unreadCount: Math.max(0, prev.unreadCount - 1) };
      });
      try {
        await api.patch(apiEndpoints.notifications.markRead(id), {});
      } catch {
        queryClient.invalidateQueries({ queryKey: ["notifications", "server"] });
      }
    } else {
      setClientReadIds((prev) => {
        const next = prev.includes(id) ? prev : [...prev, id];
        saveReadIds(next);
        return next;
      });
    }
  }, [isServerMode, queryClient]);

  const markAllRead = useCallback(async () => {
    if (isServerMode) {
      // Optimistic update
      queryClient.setQueryData<NotificationsResponse>(["notifications", "server"], (prev) => {
        if (!prev) return prev;
        const readAt = new Date().toISOString();
        return { data: prev.data.map((n) => ({ ...n, readAt })), unreadCount: 0 };
      });
      try {
        await api.post(apiEndpoints.notifications.markAllRead);
      } catch {
        queryClient.invalidateQueries({ queryKey: ["notifications", "server"] });
      }
    } else {
      const ids = clientNotifications.map((n) => n.id);
      setClientReadIds(ids);
      saveReadIds(ids);
    }
  }, [isServerMode, clientNotifications, queryClient]);

  return { notifications, readIds, unreadCount, isLoading, markRead, markAllRead };
}
