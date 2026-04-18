import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

export interface AdminCompany {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  plan: string;
  status: string;
  users: number;
  mrr: number;
  usage: number;
  createdAt: string;
  owner: string;
}

interface ApiAdminCompaniesResponse {
  data: AdminCompany[];
  stats: {
    total: number;
    active: number;
    defaulting: number;
  };
}

async function fetchAdminCompanies(): Promise<ApiAdminCompaniesResponse> {
  const res = await api.get<ApiAdminCompaniesResponse>(apiEndpoints.admin.companies);
  return res;
}

export function useAdminCompanies() {
  const query = useQuery({
    queryKey: ["admin", "companies"],
    queryFn: fetchAdminCompanies,
    staleTime: 2 * 60 * 1000,
  });

  return {
    companies: query.data?.data ?? [],
    stats: query.data?.stats ?? { total: 0, active: 0, defaulting: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
