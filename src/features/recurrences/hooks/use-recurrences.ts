import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Recurrence, RecurrencePayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRecurrence(raw: any): Recurrence {
  return {
    id: raw.id,
    categoryId: raw.categoryId ?? raw.category_id ?? "",
    type: raw.type,
    amount: raw.amount ?? 0,
    description: raw.description,
    frequency: raw.frequency,
    startDate: raw.startDate ?? raw.start_date ?? "",
    endDate: raw.endDate ?? raw.end_date,
    active: raw.active ?? true,
  };
}

async function fetchActiveRecurrences(): Promise<Recurrence[]> {
  try {
    const res = await api.get<ApiListResponse<Recurrence> | { data: Recurrence[] }>(apiEndpoints.recurrences.active);
    const raw = Array.isArray(res) ? res : (res as ApiListResponse<Recurrence>).data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return raw.map((r: any) => mapRecurrence(r));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    mutationFn: ({ id, ...payload }: Partial<RecurrencePayload> & { id: string; active?: boolean }) => {
      const backendPayload: Record<string, unknown> = { ...payload };
      if ("categoryId" in payload) { backendPayload.category_id = payload.categoryId; delete backendPayload.categoryId; }
      if ("startDate" in payload) { backendPayload.start_date = payload.startDate; delete backendPayload.startDate; }
      if ("endDate" in payload) { backendPayload.end_date = payload.endDate; delete backendPayload.endDate; }
      return api.put<ApiItemResponse<Recurrence>>(apiEndpoints.recurrences.update(id), backendPayload);
    },
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
