import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { CreditCard, ApiListResponse, ApiItemResponse } from "@/shared/types";

export type { CreditCard };

export interface CreateCardPayload {
  name: string;
  number: string;
  limit: number;
  dueDate: string;
  color?: string;
  flag?: string;
}

async function fetchCards(): Promise<CreditCard[]> {
  const res = await api.get<ApiListResponse<CreditCard>>(apiEndpoints.cards.list);
  return res.data;
}

export function useCards() {
  const query = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
    staleTime: 5 * 60 * 1000,
  });

  return {
    cards: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCardPayload) =>
      api.post<ApiItemResponse<CreditCard>>(apiEndpoints.cards.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<CreateCardPayload> & { id: string }) =>
      api.patch<ApiItemResponse<CreditCard>>(apiEndpoints.cards.update(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiItemResponse<{ removed: boolean }>>(apiEndpoints.cards.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
