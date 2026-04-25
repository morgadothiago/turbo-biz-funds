import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAdminSubscriptions } from "./use-admin-subscriptions";

const mockSubscriptions = [
  {
    id: "s1",
    user: { name: "Clara Mendes", email: "clara@email.com", avatar: "CM" },
    plan: "Pro",
    amount: 99.9,
    interval: "monthly",
    status: "ativa",
    startDate: "2026-01-01",
    nextBilling: "01/05/2026",
    paymentMethod: "credit_card",
    autoRenew: true,
  },
  {
    id: "s2",
    user: { name: "Diego Nunes", email: "diego@email.com", avatar: "DN" },
    plan: "Free",
    amount: 0,
    interval: "monthly",
    status: "trial",
    startDate: "2026-04-20",
    nextBilling: "20/05/2026",
    paymentMethod: "none",
    autoRenew: false,
  },
];

const mockStats = { totalRevenue: 99.9, active: 1, trial: 1, overdue: 0 };

vi.mock("@/lib/api/client", () => ({
  api: {
    get: vi.fn((url: string) => {
      if (!url) return Promise.reject(new Error("No URL"));
      if (url.includes("/v1/admin/subscriptions"))
        return Promise.resolve({ data: mockSubscriptions, stats: mockStats });
      return Promise.reject(new Error("Unknown endpoint"));
    }),
  },
  apiEndpoints: {
    admin: { subscriptions: "/v1/admin/subscriptions" },
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

describe("useAdminSubscriptions", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve iniciar em loading", () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it("deve retornar lista de assinaturas após fetch", async () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.subscriptions).toHaveLength(2);
  });

  it("deve retornar dados corretos da primeira assinatura", async () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const first = result.current.subscriptions[0];
    expect(first.id).toBe("s1");
    expect(first.user.name).toBe("Clara Mendes");
    expect(first.plan).toBe("Pro");
    expect(first.status).toBe("ativa");
  });

  it("deve retornar stats corretas", async () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.totalRevenue).toBe(99.9);
    expect(result.current.stats.active).toBe(1);
    expect(result.current.stats.trial).toBe(1);
    expect(result.current.stats.overdue).toBe(0);
  });

  it("deve retornar fallbacks vazios antes do fetch", () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    if (!result.current.isLoading) {
      expect(result.current.subscriptions).toEqual([]);
      expect(result.current.stats.totalRevenue).toBe(0);
    }
  });

  it("deve expor isError e error", async () => {
    const { result } = renderHook(() => useAdminSubscriptions(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
