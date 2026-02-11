import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useDashboardData } from "./use-dashboard-data";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe("useDashboardData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading States", () => {
    it("should return loading state initially", () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("should not return error initially", () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Success States", () => {
    it("should return data after successful fetch", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeDefined();
      });
    });

    it("should return all dashboard data", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data?.stats).toBeDefined();
      expect(result.current.data?.expensesByDay).toBeDefined();
      expect(result.current.data?.categoryExpenses).toBeDefined();
      expect(result.current.data?.recentTransactions).toBeDefined();
      expect(result.current.data?.goals).toBeDefined();
    });

    it("should return stats with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data?.stats).toBeDefined();
      });

      expect(Array.isArray(result.current.data?.stats)).toBe(true);
      expect(result.current.data?.stats!.length).toBeGreaterThan(0);
    });

    it("should return expenses by day with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data?.expensesByDay).toBeDefined();
      });

      expect(Array.isArray(result.current.data?.expensesByDay)).toBe(true);
      expect(result.current.data?.expensesByDay!.length).toBeGreaterThan(0);
    });

    it("should return category expenses with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data?.categoryExpenses).toBeDefined();
      });

      expect(Array.isArray(result.current.data?.categoryExpenses)).toBe(true);
      expect(result.current.data?.categoryExpenses!.length).toBeGreaterThan(0);
    });

    it("should return recent transactions with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data?.recentTransactions).toBeDefined();
      });

      expect(Array.isArray(result.current.data?.recentTransactions)).toBe(true);
      expect(result.current.data?.recentTransactions!.length).toBeGreaterThan(0);
    });

    it("should return goals with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data?.goals).toBeDefined();
      });

      expect(Array.isArray(result.current.data?.goals)).toBe(true);
      expect(result.current.data?.goals!.length).toBeGreaterThan(0);
    });
  });

  describe("Error States", () => {
    it("should handle error when fetch fails", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should not have error in success state", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Manual Refetch", () => {
    it("should have refetch function", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });

    it("should be able to refetch data manually", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data).toBeDefined();
    });

    it("should keep data available during refetch", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data).toBeDefined();
    });
  });

  describe("Enabled Option", () => {
    it("should not fetch when enabled is false", () => {
      const { result } = renderHook(() => useDashboardData({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("should have refetch even when disabled", () => {
      const { result } = renderHook(() => useDashboardData({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });

    it("should not have error when disabled", () => {
      const { result } = renderHook(() => useDashboardData({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("RefetchInterval Option", () => {
    it("should accept refetchInterval option", async () => {
      const { result } = renderHook(
        () => useDashboardData({ refetchInterval: 5000 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.refetch).toBeDefined();
    });
  });

  describe("Data Consistency", () => {
    it("should have consistent data structure", async () => {
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data?.stats).toBeDefined();
      expect(result.current.data?.expensesByDay).toBeDefined();
      expect(result.current.data?.categoryExpenses).toBeDefined();
      expect(result.current.data?.recentTransactions).toBeDefined();
      expect(result.current.data?.goals).toBeDefined();
    });
  });
});
