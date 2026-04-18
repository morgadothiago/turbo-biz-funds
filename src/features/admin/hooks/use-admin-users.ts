import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  lastLogin: string;
  createdAt: string;
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
