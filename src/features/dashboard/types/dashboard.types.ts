/**
 * Tipos específicos do dashboard.
 */

import { LucideIcon } from "lucide-react";
import type { Transaction } from "@/shared/types";

export type TrendDirection = "up" | "down";

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
