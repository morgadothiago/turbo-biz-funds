/**
 * Dados mockados para o dashboard.
 * Em produção, estes dados viriam de uma API.
 */

import {
  DashboardStat,
  ExpenseByDay,
  CategoryExpense,
  Goal,
} from "../types";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
} from "lucide-react";
import type { Transaction } from "@/shared/types";

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "monthly-balance",
    title: "Saldo do Mês",
    value: "R$ 3.450,00",
    change: "+12%",
    trend: "up",
    icon: Wallet,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "income",
    title: "Receitas",
    value: "R$ 5.200,00",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "expenses",
    title: "Despesas",
    value: "R$ 1.750,00",
    change: "-5%",
    trend: "down",
    icon: TrendingDown,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    id: "categories",
    title: "Categorias",
    value: "12",
    change: "+2",
    trend: "up",
    icon: PieChart,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export const EXPENSE_DATA: ExpenseByDay[] = [
  { day: "01", value: 120 },
  { day: "05", value: 350 },
  { day: "10", value: 80 },
  { day: "15", value: 520 },
  { day: "20", value: 200 },
  { day: "25", value: 180 },
  { day: "30", value: 300 },
];

export const CATEGORY_DATA: CategoryExpense[] = [
  { name: "Alimentação", value: 450, color: "#10b981" },
  { name: "Transporte", value: 280, color: "#3b82f6" },
  { name: "Lazer", value: 350, color: "#f59e0b" },
  { name: "Contas", value: 520, color: "#ef4444" },
  { name: "Outros", value: 150, color: "#94a3b8" },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    description: "Supermercado Extra",
    category: "Alimentação",
    amount: -245.50,
    type: "expense",
    date: "Hoje",
    icon: "🛒",
  },
  {
    id: 2,
    description: "Uber - Viagem",
    category: "Transporte",
    amount: -28.90,
    type: "expense",
    date: "Hoje",
    icon: "🚗",
  },
  {
    id: 3,
    description: "Salário",
    category: "Renda",
    amount: 5200.00,
    type: "income",
    date: "Ontem",
    icon: "💰",
  },
  {
    id: 4,
    description: "Netflix",
    category: "Lazer",
    amount: -39.90,
    type: "expense",
    date: "Ontem",
    icon: "🎬",
  },
  {
    id: 5,
    description: "Conta de Luz",
    category: "Contas",
    amount: -180.00,
    type: "expense",
    date: "2 dias",
    icon: "💡",
  },
];

export const GOALS: Goal[] = [
  {
    id: "emergency-fund",
    name: "Reserva de Emergência",
    current: 8000,
    target: 15000,
    color: "bg-success",
  },
  {
    id: "vacation",
    name: "Viagem de Férias",
    current: 3500,
    target: 8000,
    color: "bg-primary",
  },
  {
    id: "notebook",
    name: "Novo Notebook",
    current: 2000,
    target: 6000,
    color: "bg-accent",
  },
];

export const getDashboardData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    stats: DASHBOARD_STATS,
    expensesByDay: EXPENSE_DATA,
    categoryExpenses: CATEGORY_DATA,
    recentTransactions: RECENT_TRANSACTIONS,
    goals: GOALS,
  };
};
