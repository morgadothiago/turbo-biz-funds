import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { ApiCategory, ApiListResponse } from "@/shared/types";

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
