import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: "free" | "pro" | "business" | string;
  status: "Ativo" | "Pendente" | "Bloqueado" | string;
  role: "user" | "admin" | string;
  lastLogin: string;
  createdAt: string;
  totalTransactions?: number;
  planExpiresAt?: string;
}

export interface AdminUsersStats {
  total: number;
  active: number;
  pending: number;
  blocked: number;
}

interface ApiAdminUsersResponse {
  data: AdminUser[];
  stats: AdminUsersStats;
}

export interface UpdateAdminUserPayload {
  plan?: string;
  status?: string;
  role?: string;
}

async function fetchAdminUsers(): Promise<ApiAdminUsersResponse> {
  const res = await api.get<ApiAdminUsersResponse>(apiEndpoints.admin.users);
  return res;
}

export function useAdminUsers() {
  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
    staleTime: 2 * 60 * 1000,
  });

  return {
    users: query.data?.data ?? [],
    stats: query.data?.stats ?? { total: 0, active: 0, pending: 0, blocked: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateAdminUserPayload & { id: string }) =>
      api.patch<{ data: AdminUser }>(apiEndpoints.admin.user(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ data: { removed: boolean } }>(apiEndpoints.admin.user(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
