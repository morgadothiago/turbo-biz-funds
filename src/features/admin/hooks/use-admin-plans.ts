import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import { Sparkles, Zap, Crown } from "lucide-react";

export interface AdminPlanFeature {
  name: string;
  included: boolean;
}

export interface AdminPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  subscribers: number;
  mrr: number;
  popular?: boolean;
  features: AdminPlanFeature[];
}

export interface AdminPlanSubscription {
  id: string;
  client: string;
  plan: string;
  status: string;
  startDate: string;
  nextBilling: string;
  amount: number;
}

interface ApiAdminPlansResponse {
  data: AdminPlan[];
  subscriptions: AdminPlanSubscription[];
}

const PLAN_ICON_MAP: Record<string, typeof Sparkles> = {
  free: Sparkles,
  pro: Zap,
  business: Crown,
};

const PLAN_COLOR_MAP: Record<string, string> = {
  free: "bg-muted",
  pro: "bg-primary/10",
  business: "bg-success/10",
};

export function getAdminPlanIcon(planId: string) {
  return PLAN_ICON_MAP[planId.toLowerCase()] ?? Sparkles;
}

export function getAdminPlanColor(planId: string) {
  return PLAN_COLOR_MAP[planId.toLowerCase()] ?? "bg-muted";
}

async function fetchAdminPlans(): Promise<ApiAdminPlansResponse> {
  const res = await api.get<ApiAdminPlansResponse>(apiEndpoints.admin.plans);
  return res;
}

export function useAdminPlans() {
  const query = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: fetchAdminPlans,
    staleTime: 5 * 60 * 1000,
  });

  return {
    plans: query.data?.data ?? [],
    subscriptions: query.data?.subscriptions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export interface CreatePlanPayload {
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: AdminPlanFeature[];
  popular?: boolean;
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanPayload) =>
      api.post(apiEndpoints.admin.plans, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: CreatePlanPayload & { id: string }) =>
      api.patch(`${apiEndpoints.admin.plans}/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`${apiEndpoints.admin.plans}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });
}
