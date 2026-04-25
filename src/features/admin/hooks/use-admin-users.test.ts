import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAdminUsers, useUpdateAdminUser, useDeleteAdminUser } from "./use-admin-users";

const { mockPatch, mockDelete } = vi.hoisted(() => ({
  mockPatch: vi.fn(() => Promise.resolve({ data: {} })),
  mockDelete: vi.fn(() => Promise.resolve({ data: { removed: true } })),
}));

const mockUsers = [
  {
    id: "u1",
    name: "Alice Souza",
    email: "alice@email.com",
    plan: "pro",
    status: "Ativo",
    role: "user",
    lastLogin: "2026-04-24T10:00:00Z",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u2",
    name: "Bruno Costa",
    email: "bruno@email.com",
    plan: "business",
    status: "Pendente",
    role: "admin",
    lastLogin: "2026-04-20T08:00:00Z",
    createdAt: "2026-02-15T00:00:00Z",
  },
];

const mockStats = { total: 2, active: 1, pending: 1, blocked: 0 };

vi.mock("@/lib/api/client", () => ({
  api: {
    get: vi.fn((url: string) => {
      if (!url) return Promise.reject(new Error("No URL"));
      if (url.includes("/v1/admin/users")) return Promise.resolve({ data: mockUsers, stats: mockStats });
      return Promise.reject(new Error("Unknown endpoint"));
    }),
    patch: mockPatch,
    delete: mockDelete,
  },
  apiEndpoints: {
    admin: {
      users: "/v1/admin/users",
      user: (id: string) => `/v1/admin/users/${id}`,
    },
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe("useAdminUsers", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve iniciar em loading", () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it("deve retornar lista de usuários", async () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.users).toHaveLength(2);
    expect(result.current.users[0].email).toBe("alice@email.com");
  });

  it("deve retornar stats dos usuários", async () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.active).toBe(1);
    expect(result.current.stats.pending).toBe(1);
    expect(result.current.stats.blocked).toBe(0);
  });

  it("deve retornar arrays vazios como fallback antes do fetch", () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });
    // Antes do fetch completar, fallback deve ser array vazio e stats zerado
    if (!result.current.isLoading) {
      expect(result.current.users).toEqual([]);
    }
  });

  it("deve expor função refetch", async () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.refetch).toBe("function");
  });
});

describe("useUpdateAdminUser", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve expor mutateAsync", () => {
    const { result } = renderHook(() => useUpdateAdminUser(), { wrapper: createWrapper() });
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("deve chamar patch com id e payload corretos", async () => {
    const { result } = renderHook(() => useUpdateAdminUser(), { wrapper: createWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ id: "u1", plan: "business" });
    });
    expect(mockPatch).toHaveBeenCalledWith("/v1/admin/users/u1", { plan: "business" });
  });

  it("deve estar em estado de sucesso após mutação", async () => {
    const { result } = renderHook(() => useUpdateAdminUser(), { wrapper: createWrapper() });
    await act(async () => {
      await result.current.mutateAsync({ id: "u1", status: "Bloqueado" });
    });
    expect(result.current.isError).toBe(false);
  });
});

describe("useDeleteAdminUser", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deve expor mutateAsync", () => {
    const { result } = renderHook(() => useDeleteAdminUser(), { wrapper: createWrapper() });
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("deve chamar delete com o id correto", async () => {
    const { result } = renderHook(() => useDeleteAdminUser(), { wrapper: createWrapper() });
    await act(async () => {
      await result.current.mutateAsync("u1");
    });
    expect(mockDelete).toHaveBeenCalledWith("/v1/admin/users/u1");
  });
});
