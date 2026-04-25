import { useQuery } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import {
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export interface AdminStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
  color: string;
  bgColor: string;
}

export interface AdminRevenuePoint {
  month: string;
  receita: number;
  clientes: number;
}

export interface AdminPlanDistribution {
  name: string;
  value: number;
  color: string;
}

export interface AdminRecentClient {
  name: string;
  email: string;
  plan: string;
  status: string;
  date: string;
}

export interface AdminActivityItem {
  type: "signup" | "payment" | "upgrade" | "support";
  message: string;
  time: string;
}

export interface AdminDashboardData {
  stats: AdminStat[];
  revenueData: AdminRevenuePoint[];
  planDistribution: AdminPlanDistribution[];
  recentClients: AdminRecentClient[];
  recentActivity: AdminActivityItem[];
}

interface ApiAdminStats {
  mrr: number;
  mrrChange: string;
  mrrTrend: "up" | "down";
  totalClients: number;
  clientsChange: string;
  activeClients: number;
  activeChange: string;
  conversionRate: string;
  conversionChange: string;
  conversionTrend: "up" | "down";
}

const PLAN_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

interface ApiAdminPlanSummary { id: string; name: string; subscribers: number }

async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [statsRes, revenueRes, clientsRes, activityRes, plansRes] = await Promise.all([
    api.get<{ data: ApiAdminStats }>(apiEndpoints.admin.stats),
    api.get<{ data: AdminRevenuePoint[] }>(apiEndpoints.admin.revenue),
    api.get<{ data: AdminRecentClient[] }>(`${apiEndpoints.admin.clients}?limit=5`),
    api.get<{ data: AdminActivityItem[] }>(`${apiEndpoints.admin.activity}?limit=5`),
    api.get<{ data: ApiAdminPlanSummary[] }>(apiEndpoints.admin.plans).catch(() => ({ data: [] as ApiAdminPlanSummary[] })),
  ]);

  const s = statsRes.data;

  const planDistribution: AdminPlanDistribution[] = plansRes.data
    .filter((p) => p.subscribers > 0)
    .map((p, i) => ({
      name: p.name,
      value: p.subscribers,
      color: PLAN_COLORS[i % PLAN_COLORS.length],
    }));

  const stats: AdminStat[] = [
    {
      title: "Receita Mensal (MRR)",
      value: `R$ ${s.mrr.toLocaleString("pt-BR")}`,
      change: s.mrrChange,
      trend: s.mrrTrend,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total de Clientes",
      value: s.totalClients.toLocaleString("pt-BR"),
      change: s.clientsChange,
      trend: "up",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Clientes Ativos",
      value: s.activeClients.toLocaleString("pt-BR"),
      change: s.activeChange,
      trend: "up",
      icon: Sparkles,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Taxa de Conversão",
      value: s.conversionRate,
      change: s.conversionChange,
      trend: s.conversionTrend,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return {
    stats,
    revenueData: revenueRes.data,
    planDistribution,
    recentClients: clientsRes.data,
    recentActivity: activityRes.data,
  };
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 2 * 60 * 1000,
  });
}
