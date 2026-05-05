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
      amount: s.amount ?? 0,
      interval: s.interval ?? "monthly",
      status: STATUS_MAP[s.status] ?? s.status ?? "N/A",
      startDate: s.startDate ?? s.createdAt ?? "",
      nextBilling: s.nextBilling ?? s.nextBillingAt ?? "",
      paymentMethod: s.paymentMethod ?? "N/A",
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
