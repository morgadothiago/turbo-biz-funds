import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAdminDashboard } from "./use-admin-dashboard";

const mockStats = {
  mrr: 15000,
  mrrChange: "+12%",
  mrrTrend: "up" as const,
  totalClients: 240,
  clientsChange: "+8",
  activeClients: 198,
  activeChange: "+5",
  conversionRate: "82%",
  conversionChange: "+3%",
  conversionTrend: "up" as const,
};

const mockRevenue = [
  { month: "Nov", receita: 12000, clientes: 210 },
  { month: "Dez", receita: 13500, clientes: 225 },
  { month: "Jan", receita: 15000, clientes: 240 },
];

const mockClients = [
  { name: "João Silva", email: "joao@email.com", plan: "Pro", status: "Ativo", date: "25/04/2026" },
  { name: "Maria Lima", email: "maria@email.com", plan: "Business", status: "Trial", date: "24/04/2026" },
];

const mockActivity = [
  { type: "signup" as const, message: "Novo cadastro: Pedro", time: "2 horas" },
  { type: "payment" as const, message: "Pagamento recebido: R$ 99", time: "3 horas" },
];

const mockPlans = [
  { id: "free", name: "Free", subscribers: 80 },
  { id: "pro", name: "Pro", subscribers: 120 },
  { id: "business", name: "Business", subscribers: 40 },
];

vi.mock("@/lib/api/client", () => ({
  api: {
    get: vi.fn((url: string) => {
      if (!url) return Promise.reject(new Error("No URL"));
      if (url.includes("/v1/admin/stats")) return Promise.resolve({ data: mockStats });
      if (url.includes("/v1/admin/revenue")) return Promise.resolve({ data: mockRevenue });
      if (url.includes("/v1/admin/clients")) return Promise.resolve({ data: mockClients });
      if (url.includes("/v1/admin/activity")) return Promise.resolve({ data: mockActivity });
      if (url.includes("/v1/admin/plans")) return Promise.resolve({ data: mockPlans });
      return Promise.reject(new Error("Unknown endpoint"));
    }),
  },
  apiEndpoints: {
    admin: {
      stats: "/v1/admin/stats",
      revenue: "/v1/admin/revenue",
      clients: "/v1/admin/clients",
      activity: "/v1/admin/activity",
      plans: "/v1/admin/plans",
    },
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe("useAdminDashboard", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve iniciar em loading", () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("deve retornar dados após fetch bem-sucedido", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar 4 stats cards", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.stats).toBeDefined());
    expect(result.current.data!.stats).toHaveLength(4);
  });

  it("deve formatar MRR corretamente", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.stats).toBeDefined());
    const mrrStat = result.current.data!.stats[0];
    expect(mrrStat.title).toBe("Receita Mensal (MRR)");
    expect(mrrStat.value).toContain("15");
    expect(mrrStat.trend).toBe("up");
  });

  it("deve retornar revenueData com os dados da API", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.revenueData).toBeDefined());
    expect(result.current.data!.revenueData).toHaveLength(3);
    expect(result.current.data!.revenueData[2].month).toBe("Jan");
  });

  it("deve retornar planDistribution derivado dos planos", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.planDistribution).toBeDefined());
    const dist = result.current.data!.planDistribution;
    expect(dist.length).toBe(3);
    expect(dist[0].name).toBe("Free");
    expect(dist[0].value).toBe(80);
    expect(dist[0].color).toBeDefined();
  });

  it("deve retornar recentClients", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.recentClients).toBeDefined());
    expect(result.current.data!.recentClients).toHaveLength(2);
    expect(result.current.data!.recentClients[0].name).toBe("João Silva");
  });

  it("deve retornar recentActivity", async () => {
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data?.recentActivity).toBeDefined());
    expect(result.current.data!.recentActivity).toHaveLength(2);
    expect(result.current.data!.recentActivity[0].type).toBe("signup");
  });

  it("deve ter planDistribution vazio se plans API falhar", async () => {
    const { api: mockApi } = await import("@/lib/api/client");
    vi.mocked(mockApi.get).mockImplementation((url: string) => {
      if (url.includes("/v1/admin/stats")) return Promise.resolve({ data: mockStats });
      if (url.includes("/v1/admin/revenue")) return Promise.resolve({ data: mockRevenue });
      if (url.includes("/v1/admin/clients")) return Promise.resolve({ data: mockClients });
      if (url.includes("/v1/admin/activity")) return Promise.resolve({ data: mockActivity });
      if (url.includes("/v1/admin/plans")) return Promise.reject(new Error("Plans unavailable"));
      return Promise.reject(new Error("Unknown endpoint"));
    });

    const { result } = renderHook(() => useAdminDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data!.planDistribution).toHaveLength(0);
    expect(result.current.isError).toBe(false);
  });
});
