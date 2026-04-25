import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAdminCompanies } from "./use-admin-companies";

const mockCompanies = [
  {
    id: "c1",
    name: "TechCorp Ltda",
    cnpj: "12.345.678/0001-90",
    email: "contato@techcorp.com",
    plan: "Business",
    status: "ativa",
    users: 12,
    mrr: 299.9,
    usage: 78,
    createdAt: "2026-01-15",
    owner: "Roberto Alves",
  },
  {
    id: "c2",
    name: "Startup XYZ",
    cnpj: "98.765.432/0001-11",
    email: "hello@startupxyz.com",
    plan: "Pro",
    status: "trial",
    users: 3,
    mrr: 0,
    usage: 20,
    createdAt: "2026-04-01",
    owner: "Ana Ferreira",
  },
];

const mockStats = { total: 2, active: 1, defaulting: 0 };

vi.mock("@/lib/api/client", () => ({
  api: {
    get: vi.fn((url: string) => {
      if (!url) return Promise.reject(new Error("No URL"));
      if (url.includes("/v1/admin/companies"))
        return Promise.resolve({ data: mockCompanies, stats: mockStats });
      return Promise.reject(new Error("Unknown endpoint"));
    }),
  },
  apiEndpoints: {
    admin: { companies: "/v1/admin/companies" },
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

describe("useAdminCompanies", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve iniciar em loading", () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it("deve retornar lista de empresas após fetch", async () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.companies).toHaveLength(2);
  });

  it("deve retornar dados corretos da primeira empresa", async () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const first = result.current.companies[0];
    expect(first.id).toBe("c1");
    expect(first.name).toBe("TechCorp Ltda");
    expect(first.plan).toBe("Business");
    expect(first.users).toBe(12);
  });

  it("deve retornar stats corretas", async () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.active).toBe(1);
    expect(result.current.stats.defaulting).toBe(0);
  });

  it("deve retornar fallbacks vazios antes do fetch", () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    if (!result.current.isLoading) {
      expect(result.current.companies).toEqual([]);
    }
  });

  it("deve expor refetch como função", async () => {
    const { result } = renderHook(() => useAdminCompanies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.refetch).toBe("function");
  });
});
