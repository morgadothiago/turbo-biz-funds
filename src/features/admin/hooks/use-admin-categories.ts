import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface AdminCategory {
  id: string;
  name: string;
}

async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await api.get<{ data: AdminCategory[] }>(apiEndpoints.categories.list);
  return Array.isArray(res) ? (res as unknown as AdminCategory[]) : res.data ?? [];
}

export function useAdminCategories() {
  const query = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchAdminCategories,
    staleTime: 2 * 60 * 1000,
  });
  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api.post<{ data: AdminCategory }>(apiEndpoints.categories.create, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch<{ data: AdminCategory }>(apiEndpoints.categories.update(id), { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ data: { removed: boolean } }>(apiEndpoints.categories.delete(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });
}
