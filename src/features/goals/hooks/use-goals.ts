import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Goal, CreateGoalPayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

async function fetchGoals(): Promise<Goal[]> {
  try {
    const res = await api.get<ApiListResponse<Goal> | { data: Goal[] }>(apiEndpoints.goals.list);
    // Aceita tanto { data: [...] } quanto [...]
    return Array.isArray(res) ? res : (res as ApiListResponse<Goal>).data ?? [];
  } catch (error: any) {
    console.error("[fetchGoals] Erro:", error);
    // Se o endpoint não existir, retorna array vazio
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
    staleTime: 5 * 60 * 1000,
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
        name: payload.name,
        target: payload.target,
        current: payload.current ?? 0,
        deadline: payload.deadline, // Enviar no formato ISO ou string
        ...(payload.category && { category: payload.category }),
      };
      
      const res = await api.post<ApiItemResponse<Goal>>(apiEndpoints.goals.create, backendPayload);
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
    mutationFn: ({ id, ...payload }: Partial<CreateGoalPayload> & { id: string }) =>
      api.patch<ApiItemResponse<Goal>>(apiEndpoints.goals.update(id), payload),
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
