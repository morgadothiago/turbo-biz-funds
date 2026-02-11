/**
 * Tipos compartilhados relacionados ao dashboard e métricas financeiras.
 */

import { LucideIcon } from "lucide-react";

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

export interface GoalProgress {
  goalId: string;
  percentage: number;
  remaining: number;
  daysLeft?: number;
}

export interface DashboardData {
  stats: DashboardStat[];
  expensesByDay: ExpenseByDay[];
  categoryExpenses: CategoryExpense[];
  recentTransactions: import("./transaction.types").Transaction[];
  goals: Goal[];
  monthlySummary: import("./transaction.types").MonthlySummary;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
