import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import type { ApiCategory, ApiListResponse } from "@/shared/types";

export type { ApiCategory };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(raw: any): ApiCategory {
  return {
    id: raw.id ?? raw._id ?? raw.uuid ?? raw.categoryId ?? "",
    name: raw.name ?? raw.title ?? raw.label ?? "",
  };
}

async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await api.get<ApiListResponse<ApiCategory> | ApiCategory[]>(apiEndpoints.categories.list);
  const raw = Array.isArray(res) ? res : (res as ApiListResponse<ApiCategory>).data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (raw as any[]).map(mapCategory).filter((c) => c.id && c.name);
}

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
