import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { ApiCategory, ApiListResponse, ApiItemResponse } from "@/shared/types";

export type { ApiCategory };

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<ApiListResponse<ApiCategory>>(apiEndpoints.categories.list),
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) =>
      api.post<ApiItemResponse<ApiCategory>>(apiEndpoints.categories.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch<ApiItemResponse<ApiCategory>>(apiEndpoints.categories.update(id), { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiItemResponse<{ removed: boolean }>>(apiEndpoints.categories.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["summary-categories"] });
    },
  });
}
