import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Goal, CreateGoalPayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

const GOAL_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500",
  "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-red-500",
];
const GOAL_ICONS = ["🎯", "🏠", "✈️", "🚗", "💰", "📱", "🎓", "💊"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGoal(raw: any, index = 0): Goal {
  return {
    id: raw.id,
    name: raw.name ?? raw.title ?? "",
    current: raw.current ?? raw.current_value ?? 0,
    target: raw.target ?? raw.target_value ?? 0,
    deadline: raw.deadline ?? raw.target_date ?? "",
    category: raw.category ?? raw.goal_category ?? "Geral",
    color: raw.color ?? GOAL_COLORS[index % GOAL_COLORS.length],
    icon: raw.icon ?? GOAL_ICONS[index % GOAL_ICONS.length],
  };
}

async function fetchGoals(): Promise<Goal[]> {
  try {
    const res = await api.get<ApiListResponse<Goal> | { data: Goal[] }>(apiEndpoints.goals.list);
    const raw = Array.isArray(res) ? res : (res as ApiListResponse<Goal>).data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return raw.map((g: any, i: number) => mapGoal(g, i));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[fetchGoals] Erro:", error);
    if (error?.status === 404 || error?.status === 500) {
      return [];
    }
    throw error;
  }
}

export function useGoals() {
  const query = useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
    staleTime: 30 * 1000,
    retry: 1,
  });

  return {
    goals: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateGoalPayload) => {
      // Formata o payload para o formato esperado pelo backend
      const backendPayload = {
        // Campos no formato snake_case que é padrão do backend
        title: payload.name,
        target_value: payload.target,
        current_value: payload.current ?? 0,
        target_date: payload.deadline,
        goal_category: payload.category || "Geral",
      };
      
      console.log("[useCreateGoal] Enviando payload:", JSON.stringify(backendPayload));
      
      const res = await api.post<ApiItemResponse<Goal>>(apiEndpoints.goals.create, backendPayload);
      if (res?.data) res.data = mapGoal(res.data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<CreateGoalPayload> & { id: string }) => {
      // Backend espera snake_case, igual ao create
      const backendPayload: Record<string, unknown> = {};
      if (payload.name !== undefined)     backendPayload.title          = payload.name;
      if (payload.target !== undefined)   backendPayload.target_value   = payload.target;
      if (payload.current !== undefined)  backendPayload.current_value  = payload.current;
      if (payload.deadline !== undefined) backendPayload.target_date    = payload.deadline;
      if (payload.category !== undefined) backendPayload.goal_category  = payload.category;
      return api.patch<ApiItemResponse<Goal>>(apiEndpoints.goals.update(id), backendPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiItemResponse<{ removed: boolean }>>(apiEndpoints.goals.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
