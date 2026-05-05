import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Recurrence, RecurrencePayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

async function fetchActiveRecurrences(): Promise<Recurrence[]> {
  try {
    const res = await api.get<ApiListResponse<Recurrence> | { data: Recurrence[] }>(apiEndpoints.recurrences.active);
    return Array.isArray(res) ? res : (res as ApiListResponse<Recurrence>).data ?? [];
  } catch (error: any) {
    console.error("[fetchActiveRecurrences] Erro:", error);
    if (error?.status === 404 || error?.status === 500) {
      return [];
    }
    throw error;
  }
}

export function useActiveRecurrences() {
  const query = useQuery({
    queryKey: ["recurrences", "active"],
    queryFn: fetchActiveRecurrences,
    staleTime: 5 * 60 * 1000,
  });

  return {
    recurrences: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RecurrencePayload) => {
      // Formata o payload para o formato snake_case do backend
      const backendPayload = {
        category_id: payload.categoryId,
        type: payload.type,
        amount: payload.amount,
        description: payload.description || "",
        frequency: payload.frequency,
        start_date: payload.startDate,
        end_date: payload.endDate || null,
      };
      
      console.log("[useCreateRecurrence] Enviando payload:", JSON.stringify(backendPayload));
      
      const res = await api.post<ApiItemResponse<Recurrence>>(apiEndpoints.recurrences.create, backendPayload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrences"] });
    },
  });
}

export function useUpdateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<RecurrencePayload> & { id: string }) =>
      api.put<ApiItemResponse<Recurrence>>(apiEndpoints.recurrences.update(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrences"] });
    },
  });
}

export function useGenerateRecurrences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ generated: number }>(apiEndpoints.recurrences.generate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrences"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
