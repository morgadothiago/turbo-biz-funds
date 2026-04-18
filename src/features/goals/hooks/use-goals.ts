import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Goal, CreateGoalPayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

async function fetchGoals(): Promise<Goal[]> {
  const res = await api.get<ApiListResponse<Goal>>(apiEndpoints.goals.list);
  return res.data;
}

export function useGoals() {
  const query = useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
    staleTime: 5 * 60 * 1000,
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
    mutationFn: (payload: CreateGoalPayload) =>
      api.post<ApiItemResponse<Goal>>(apiEndpoints.goals.create, payload),
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
