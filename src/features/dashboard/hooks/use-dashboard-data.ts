/**
 * Hook customizado para buscar dados do dashboard.
 * Gerencia estado de loading, erro e dados.
 */

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DASHBOARD_STATS,
  EXPENSE_DATA,
  CATEGORY_DATA,
  RECENT_TRANSACTIONS,
  GOALS,
} from "../data/mock-data";
import type { DashboardData } from "../types";

interface UseDashboardOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export const useDashboardData = (options: UseDashboardOptions = {}) => {
  const { enabled = true, refetchInterval } = options;

  const fetchDashboardData = useCallback(async (): Promise<DashboardData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      stats: DASHBOARD_STATS,
      expensesByDay: EXPENSE_DATA,
      categoryExpenses: CATEGORY_DATA,
      recentTransactions: RECENT_TRANSACTIONS,
      goals: GOALS,
    };
  }, []);

  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    enabled,
    refetchInterval,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
