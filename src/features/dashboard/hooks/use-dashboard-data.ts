import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import { Wallet, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import type { DashboardData, DashboardStat, ExpenseByDay, CategoryExpense, Goal } from "../types";
import type { Transaction } from "@/shared/types";
import { fmtBRL } from "@/lib/format";

const CHART_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#94a3b8", "#8b5cf6", "#ec4899", "#14b8a6",
];

interface BalanceData { income: number; expense: number; balance: number }
interface CategorySummaryItem { categoryId: string; income: number; expense: number }
interface CategoryItem { id: string; name: string }
interface ApiTransaction {
  id: string;
  categoryId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string | null;
  occurredAt: string;
}
interface ApiGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  color?: string;
  icon?: string;
  category?: string;
}

async function fetchDashboard(): Promise<DashboardData> {
  const [balanceRes, transactionsRes, categoriesRes, catSummaryRes, goalsRes] = await Promise.all([
    api.get<{ data: BalanceData }>(`${apiEndpoints.summary.balance}?period=30d`),
    api.get<{ data: ApiTransaction[] }>(`${apiEndpoints.transactions.list}?period=30d`),
    api.get<{ data: CategoryItem[] }>(apiEndpoints.categories.list),
    api.get<{ data: CategorySummaryItem[] }>(`${apiEndpoints.summary.categories}?period=30d`),
    api.get<{ data: ApiGoal[] }>(apiEndpoints.goals.list).catch(() => ({ data: [] as ApiGoal[] })),
  ]);

  const balance = balanceRes.data;
  const transactions = transactionsRes.data;
  const categories = categoriesRes.data;
  const catSummary = catSummaryRes.data;
  const apiGoals = goalsRes.data;

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const stats: DashboardStat[] = [
    {
      id: "balance",
      title: "Saldo do Mês",
      value: fmtBRL(balance.balance),
      change: balance.balance >= 0 ? "positivo" : "negativo",
      trend: balance.balance >= 0 ? "up" : "down",
      icon: Wallet,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: "income",
      title: "Receitas",
      value: fmtBRL(balance.income),
      change: "",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "expenses",
      title: "Despesas",
      value: fmtBRL(balance.expense),
      change: "",
      trend: "down",
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      id: "categories",
      title: "Categorias",
      value: String(categories.length),
      change: "",
      trend: "up",
      icon: PieChart,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const dayMap = new Map<string, number>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const day = new Date(t.occurredAt).getDate().toString().padStart(2, "0");
      dayMap.set(day, (dayMap.get(day) ?? 0) + t.amount);
    });
  const expensesByDay: ExpenseByDay[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({ day, value }));

  const categoryExpenses: CategoryExpense[] = catSummary
    .filter((item) => item.expense > 0)
    .map((item, i) => ({
      name: catMap.get(item.categoryId) ?? "Sem categoria",
      value: item.expense,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  const recentTransactions: Transaction[] = transactions.slice(0, 5).map((t) => ({
    id: t.id,
    description: t.description ?? "Sem descrição",
    amount: t.type === "EXPENSE" ? -t.amount : t.amount,
    date: new Date(t.occurredAt).toLocaleDateString("pt-BR"),
    category: catMap.get(t.categoryId) ?? "Sem categoria",
    type: t.type === "INCOME" ? "income" : "expense",
  }));

  const goals: Goal[] = apiGoals.slice(0, 4).map((g) => ({
    id: g.id,
    name: g.name,
    current: g.current,
    target: g.target,
    deadline: g.deadline,
    color: g.color ?? "#10b981",
    icon: g.icon ?? "🎯",
    category: g.category ?? "Geral",
  }));

  return {
    stats,
    expensesByDay,
    categoryExpenses,
    recentTransactions,
    goals,
  };
}

interface UseDashboardOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export const useDashboardData = (options: UseDashboardOptions = {}) => {
  const { enabled = true, refetchInterval } = options;

  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
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
