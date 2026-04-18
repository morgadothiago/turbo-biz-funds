import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { ApiTransaction, ApiListResponse, ApiItemResponse } from "@/shared/types";

export type { ApiTransaction };

export interface CreateTransactionPayload {
  categoryId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string;
  occurredAt: string;
}

export type TransactionPeriod = "weekly" | "15d" | "30d";

export function useTransactions(period: TransactionPeriod = "30d") {
  const query = useQuery({
    queryKey: ["transactions", period],
    queryFn: () =>
      api.get<ApiListResponse<ApiTransaction>>(
        `${apiEndpoints.transactions.list}?period=${period}`
      ),
    staleTime: 2 * 60 * 1000,
  });

  return {
    transactions: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      api.post<ApiItemResponse<ApiTransaction>>(apiEndpoints.transactions.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["summary-categories"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiItemResponse<{ removed: boolean }>>(apiEndpoints.transactions.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["summary-categories"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: Partial<CreateTransactionPayload> & { id: string }) =>
      api.patch<ApiItemResponse<ApiTransaction>>(
        apiEndpoints.transactions.update(id),
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
