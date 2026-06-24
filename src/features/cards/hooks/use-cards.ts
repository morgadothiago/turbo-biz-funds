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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCard(raw: any): CreditCard {
  return {
    id: raw.id,
    name: raw.name ?? "",
    number: raw.number ?? "",
    limit: raw.limit ?? 0,
    used: raw.used ?? 0,
    dueDate: ((d: string) => d ? d.slice(0, 10) : "")(raw.dueDate ?? raw.due_date ?? ""),
    color: raw.color ?? "",
    flag: raw.flag ?? "",
  };
}

async function fetchCards(): Promise<CreditCard[]> {
  try {
    const res = await api.get<ApiListResponse<CreditCard> | { data: CreditCard[] }>(apiEndpoints.cards.list);
    const raw = Array.isArray(res) ? res : (res as ApiListResponse<CreditCard>).data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return raw.map((r: any) => mapCard(r));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.status === 404 || error?.status === 500) {
      return [];
    }
    throw error;
  }
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
    mutationFn: ({ id, ...payload }: Partial<CreateCardPayload & { used: number }> & { id: string }) =>
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
