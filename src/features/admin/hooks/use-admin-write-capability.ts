import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";

// Proba se o endpoint de escrita de usuários está implementado no backend.
// A API retorna message="Cannot PATCH ..." quando a rota não existe.
// Quando o backend implementar, qualquer outro status indica que está disponível.
async function probeAdminWriteEndpoint(): Promise<boolean> {
  try {
    await api.patch(apiEndpoints.admin.user("00000000-0000-0000-0000-000000000000"), {});
    return true;
  } catch (err: unknown) {
    const msg: string = (err as { response?: { data?: { message?: string } } })
      ?.response?.data?.message ?? "";
    // "Cannot PATCH ..." = rota não existe no backend
    if (/^Cannot (PATCH|PUT|DELETE)/i.test(msg)) return false;
    // Qualquer outro erro (422, 404 "not found", 403...) = rota existe
    return true;
  }
}

export function useAdminWriteCapability() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "write-capability"],
    queryFn: probeAdminWriteEndpoint,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    canWrite: data === true,
    isChecking: isLoading,
  };
}
