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

async function fetchAdminSubscriptions(): Promise<ApiAdminSubscriptionsResponse> {
  const res = await api.get<ApiAdminSubscriptionsResponse>(apiEndpoints.admin.subscriptions);
  return res;
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
