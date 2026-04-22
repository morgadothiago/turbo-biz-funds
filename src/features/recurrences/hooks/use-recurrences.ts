import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { Recurrence, RecurrencePayload, ApiListResponse, ApiItemResponse } from "@/shared/types";

async function fetchActiveRecurrences(): Promise<Recurrence[]> {
  const res = await api.get<ApiListResponse<Recurrence>>(apiEndpoints.recurrences.active);
  return res.data;
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
    mutationFn: (payload: RecurrencePayload) =>
      api.post<ApiItemResponse<Recurrence>>(apiEndpoints.recurrences.create, payload),
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
