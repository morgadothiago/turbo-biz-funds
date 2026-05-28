import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Recurrence } from "@/shared/types";
import { fmtBRL } from "@/lib/format";

const READ_STORAGE_KEY = "user:notifications:read";
const ACTIVITY_STORAGE_KEY = "user:notifications:activity";

export type NotificationSeverity = "info" | "warning" | "error" | "success";

export interface UserNotification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  action?: { label: string; href: string };
  createdAt: string;
}

// ─── Activity log (stored in localStorage) ──────────────────────────────────

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

/** Call this from any mutation onSuccess to log user activity */
export function logActivity(entry: Omit<ActivityEntry, "id" | "createdAt">) {
  const log = getActivityLog();
  const newEntry: ActivityEntry = {
    ...entry,
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  // Keep last 20 activity entries
  const trimmed = [newEntry, ...log].slice(0, 20);
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed));
}

// ─── Subscription notifications ──────────────────────────────────────────────

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
      id: "payment_overdue",
      severity: "error",
      title: "Mensalidade em atraso",
      body: "Regularize seu pagamento para continuar com acesso total ao DoutorCash.",
      action: { label: "Regularizar agora", href: "/pagamento" },
      createdAt: now,
    });
  }

  if (status && ["pending", "pendente", "inactive", "inativo"].includes(status)) {
    notifications.push({
      id: "payment_pending",
      severity: "warning",
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

  if (
    nextBillingRaw &&
    !["atrasada", "overdue", "past_due", "pending", "pendente"].includes(status ?? "")
  ) {
    const daysUntilBilling = Math.ceil(
      (new Date(nextBillingRaw).getTime() - Date.now()) / 86_400_000
    );
    if (daysUntilBilling >= 0 && daysUntilBilling <= 3) {
      notifications.push({
        id: "billing_soon",
        severity: "info",
        title: `Cobrança em ${daysUntilBilling} dia${daysUntilBilling !== 1 ? "s" : ""}`,
        body: `Sua mensalidade será cobrada ${daysUntilBilling === 0 ? "hoje" : `em ${daysUntilBilling} dia(s)`}.`,
        createdAt: now,
      });
    }
  }

  const hasUrgent = notifications.some((n) => n.severity === "error" || n.severity === "warning");
  if (plan === "free" && !hasUrgent && subscription === null) {
    notifications.push({
      id: "free_plan_upgrade",
      severity: "info",
      title: "Você está no plano Gratuito",
      body: "Faça upgrade para Pro e desbloqueie transações ilimitadas, metas avançadas e muito mais.",
      action: { label: "Ver planos", href: "/pagamento" },
      createdAt: now,
    });
  }

  return notifications;
}

// ─── Recurrence notifications ─────────────────────────────────────────────────

/** Compute next occurrence >= today for a recurrence (local-timezone safe) */
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
      case "daily":
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
        break;
      case "weekly":
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
        break;
      case "monthly":
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
        break;
      case "yearly":
        cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), cursor.getDate());
        break;
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
          id: `rec-overdue-${rec.id}`,
          severity: "error",
          title: `Pagamento atrasado: ${name}`,
          body: `Venceu há ${daysLate} dia${daysLate !== 1 ? "s" : ""} (${dateStr}). Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      } else if (daysUntil === 0) {
        notifications.push({
          id: `rec-today-${rec.id}`,
          severity: "warning",
          title: `Último dia para pagar: ${name}`,
          body: `${name} vence hoje (${dateStr}). Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      } else if (daysUntil <= 3) {
        notifications.push({
          id: `rec-soon-${rec.id}-${daysUntil}`,
          severity: "info",
          title: `Vence em ${daysUntil} dia${daysUntil !== 1 ? "s" : ""}: ${name}`,
          body: `${name} vence em ${dateStr}. Valor: ${valor}`,
          action: { label: "Ver recorrência", href },
          createdAt: now,
        });
      }
    });

  return notifications;
}

// ─── Main hook ────────────────────────────────────────────────────────────────

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

export function useUserNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>(getReadIds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      fetchSubscription(),
      api
        .get<{ data: Recurrence[] }>(
          `${apiEndpoints.recurrences.list}?active=true`
        )
        .catch(() => ({ data: [] as Recurrence[] })),
    ]).then(([sub, recRes]) => {
      if (cancelled) return;

      const recurrences: Recurrence[] = Array.isArray(recRes)
        ? (recRes as unknown as Recurrence[])
        : recRes.data ?? [];

      const subNotifs = buildSubscriptionNotifications(user.plan ?? "free", sub);
      const recNotifs = buildRecurrenceNotifications(recurrences);
      const activityNotifs: UserNotification[] = getActivityLog().map((a) => ({
        id: a.id,
        severity: a.severity,
        title: a.title,
        body: a.body,
        action: a.action,
        createdAt: a.createdAt,
      }));

      // Merge: overdue/today first, then sub alerts, then activity, then due-soon
      const ordered = [
        ...recNotifs.filter((n) => n.severity === "error"),
        ...recNotifs.filter((n) => n.severity === "warning"),
        ...subNotifs.filter((n) => n.severity === "error"),
        ...subNotifs.filter((n) => n.severity === "warning"),
        ...activityNotifs,
        ...subNotifs.filter((n) => n.severity === "info" || n.severity === "success"),
        ...recNotifs.filter((n) => n.severity === "info" || n.severity === "success"),
      ];

      setNotifications(ordered);
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
