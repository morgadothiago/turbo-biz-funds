/**
 * Tipos específicos do dashboard.
 */

import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
}

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface ExpenseByDay {
  day: string;
  value: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
  deadline?: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  expensesByDay: ExpenseByDay[];
  categoryExpenses: CategoryExpense[];
  recentTransactions: Transaction[];
  goals: Goal[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
