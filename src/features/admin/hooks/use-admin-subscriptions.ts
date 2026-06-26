/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface AdminSubscription {
  id: string;
  user: { name: string; email: string; avatar: string };
  plan: string;
  amount: number;
  interval: string;
  status: string;
  startDate: string;
  nextBilling: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  autoRenew: boolean;
}

interface ApiAdminSubscriptionsResponse {
  data: AdminSubscription[];
  stats: {
    totalRevenue: number;
    active: number;
    trial: number;
    overdue: number;
  };
}

const PAYMENT_METHOD_MAP: Record<string, string> = {
  pix: "PIX",
  PIX: "PIX",
  credit_card: "Cartão de Crédito",
  creditcard: "Cartão de Crédito",
  credit: "Cartão de Crédito",
  card: "Cartão de Crédito",
  cartao: "Cartão de Crédito",
  cartão: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  boleto: "Boleto",
};

// Backend pode enviar amount em centavos (ex: 2990) ou reais (ex: 29.90)
// Se for inteiro >= 100, assume centavos e divide por 100
function normalizeAmount(raw: unknown): number {
  const n = Number(raw);
  if (!raw || isNaN(n)) return 0;
  if (Number.isInteger(n) && n >= 100) return n / 100;
  return n;
}

const STATUS_MAP: Record<string, string> = {
  ACTIVE: "Ativo",
  CANCELLED: "Cancelado",
  CANCELED: "Cancelado",
  PAST_DUE: "Inadimplente",
  TRIAL: "Trial",
  active: "Ativo",
  cancelled: "Cancelado",
  canceled: "Cancelado",
  past_due: "Inadimplente",
  trial: "Trial",
  ativa: "Ativo",
  cancelada: "Cancelado",
  atrasada: "Inadimplente",
  inativa: "Inativo",
};

async function fetchAdminSubscriptions(): Promise<ApiAdminSubscriptionsResponse> {
  const res = await api.get<any>(apiEndpoints.admin.subscriptions);
  // Normalize: API may return flat array or { data: [], stats: {} }
  const raw: any[] = Array.isArray(res) ? res : (res?.data ?? []);
  const data: AdminSubscription[] = raw.map((s: any) => {
    const displayName = s.user?.name ?? s.userName ?? s.name ?? "N/A";
    return {
      id: s.id ?? "",
      user: s.user ?? {
        name: displayName,
        email: s.user?.email ?? s.userEmail ?? s.email ?? "N/A",
        avatar: displayName.slice(0, 2).toUpperCase(),
      },
      plan: s.plan ?? s.planName ?? s.planId ?? "N/A",
      amount: normalizeAmount(s.amount ?? s.price ?? s.planPrice),
      interval: s.interval ?? "monthly",
      status: STATUS_MAP[s.status] ?? s.status ?? "N/A",
      startDate: s.startDate ?? s.createdAt ?? "",
      nextBilling: s.nextBilling ?? s.nextBillingAt ?? "",
      paymentMethod: s.paymentMethod ?? s.payment_method ?? s.method ?? "",
      paymentMethodLabel: PAYMENT_METHOD_MAP[s.paymentMethod ?? s.payment_method ?? s.method ?? ""] ?? (s.paymentMethod ? s.paymentMethod : "—"),
      autoRenew: s.autoRenew ?? false,
    };
  });
  const apiStats = Array.isArray(res) ? null : res?.stats;
  return {
    data,
    stats: apiStats ?? {
      totalRevenue: data.reduce((sum, s) => sum + s.amount, 0),
      active: data.filter((s) => s.status === "Ativo").length,
      trial: data.filter((s) => s.status === "Trial").length,
      overdue: data.filter((s) => s.status === "Inadimplente").length,
    },
  };
}

export function useAdminSubscriptions() {
  const query = useQuery({
    queryKey: ["admin", "subscriptions"],
    queryFn: fetchAdminSubscriptions,
    staleTime: 2 * 60 * 1000,
  });

  return {
    subscriptions: query.data?.data ?? [],
    stats: query.data?.stats ?? { totalRevenue: 0, active: 0, trial: 0, overdue: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
