import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { PlanInfo, ApiItemResponse } from "@/shared/types";

export type { PlanInfo };

const PLAN_DEFAULTS: Record<string, PlanInfo> = {
  free: {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "1 empresa, recursos básicos",
    features: ["Categorização básica", "Relatórios simples", "Suporte por email"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "3 empresas, IA + WhatsApp",
    features: [
      "Tudo do Gratuito",
      "Categorização por IA",
      "Registro por WhatsApp",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  business: {
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
};

async function fetchPlanInfo(planId: string): Promise<PlanInfo> {
  try {
    const res = await api.get<ApiItemResponse<PlanInfo>>(apiEndpoints.plans.get(planId));
    return res.data;
  } catch {
    return PLAN_DEFAULTS[planId] ?? { id: planId, name: planId, price: "—", period: "/mês", description: "", features: [] };
  }
}

export function usePlanInfo(planId: string) {
  const query = useQuery({
    queryKey: ["plans", planId],
    queryFn: () => fetchPlanInfo(planId),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(planId),
  });

  return {
    planInfo: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function usePlansList() {
  const query = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get<{ data: PlanInfo[] }>(apiEndpoints.plans.list),
    staleTime: 10 * 60 * 1000,
  });

  return {
    plans: query.data?.data ?? Object.values(PLAN_DEFAULTS),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
