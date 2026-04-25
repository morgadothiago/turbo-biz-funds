import { memo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Loader2,
  Users,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAdminDashboard, AdminStat } from "@/features/admin/hooks/use-admin-dashboard";
import { cn } from "@/lib/utils";

const AdminStatCard = memo(function AdminStatCard({ stat }: { stat: AdminStat }) {
  const Icon = stat.icon;
  return (
    <div className="rounded-2xl bg-[#1a3799] p-4 flex flex-col gap-3 min-h-[110px]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-white/70 leading-tight">{stat.title}</p>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", stat.bgColor)}>
          <Icon className={cn("h-4 w-4", stat.color)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white leading-none tracking-tight">{stat.value}</p>
      <div className="flex items-center gap-1">
        {stat.trend === "up" ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-green-400 shrink-0" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-red-400 shrink-0" />
        )}
        <p className={cn("text-xs font-medium", stat.trend === "up" ? "text-green-400" : "text-red-400")}>
          {stat.change}
        </p>
        <span className="text-xs text-white/40">vs mês anterior</span>
      </div>
    </div>
  );
});

function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 overflow-auto p-5 flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Carregando dados...</span>
      </div>
    </div>
  );
}

function AdminDashboardError({ message }: { message: string }) {
  return (
    <div className="flex-1 overflow-auto p-5 flex items-center justify-center">
      <div className="text-center space-y-2">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-destructive font-medium">Falha ao carregar dados</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  if (isLoading) return <AdminDashboardSkeleton />;
  if (isError || !data) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return <AdminDashboardError message={msg} />;
  }

  const { stats, revenueData, planDistribution, recentClients, recentActivity } = data;

  return (
    <div className="p-5 lg:p-7 space-y-5">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Painel Admin 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aqui está o resumo da plataforma DoutorCash
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <AdminStatCard key={stat.title} stat={stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-[15px] font-bold text-gray-900">Evolução da Receita</span>
              </div>
              <p className="text-xs text-gray-400 ml-9">MRR dos últimos 6 meses</p>
            </div>
            <div className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueData} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]}
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: 12, padding: "8px 12px" }}
                  />
                  <Line type="monotone" dataKey="receita" stroke="#1a3799" strokeWidth={2.5}
                    dot={{ fill: "#1a3799", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#1a3799", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-[#1a3799]" />
                </div>
                <span className="text-[15px] font-bold text-gray-900">Distribuição de Planos</span>
              </div>
              <p className="text-xs text-gray-400 ml-9">Clientes por tipo de plano</p>
            </div>
            <div className="px-2 pb-4">
              {planDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={planDistribution} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} width={60} />
                    <Tooltip
                      formatter={(value: number) => [`${value} clientes`, "Total"]}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: 12, padding: "8px 12px" }}
                    />
                    <Bar dataKey="value" fill="#1a3799" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">
                  Sem dados de distribuição
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Clients */}
          <div className="lg:col-span-2 rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
            <div className="bg-[#1a3799] px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg leading-tight">Clientes Recentes</p>
                <p className="text-white/75 text-xs leading-tight mt-0.5">Últimos cadastros na plataforma</p>
              </div>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 shrink-0 text-xs">
                Ver todos
              </Button>
            </div>
            <div className="bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Cliente</TableHead>
                    <TableHead className="text-xs">Plano</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClients.map((client) => (
                    <TableRow key={client.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#1a3799]/10 text-[#1a3799] text-xs font-bold">
                              {client.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-400">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.plan === "Business" ? "default" : client.plan === "Pro" ? "secondary" : "outline"} className="text-xs">
                          {client.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", client.status === "Ativo" ? "bg-green-50 text-green-700 border-green-200" : "")}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-gray-400">{client.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
            <div className="bg-[#25D366] px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Atividade</p>
                <p className="text-white/75 text-xs leading-tight mt-0.5">Últimas ações na plataforma</p>
              </div>
            </div>
            <div className="bg-white divide-y divide-border/60">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 px-5 py-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    activity.type === "signup" ? "bg-blue-50"
                    : activity.type === "payment" ? "bg-green-50"
                    : activity.type === "upgrade" ? "bg-purple-50"
                    : "bg-amber-50"
                  )}>
                    {activity.type === "signup" && <UserPlus className="h-4 w-4 text-[#1a3799]" />}
                    {activity.type === "payment" && <CreditCard className="h-4 w-4 text-green-600" />}
                    {activity.type === "upgrade" && <TrendingUp className="h-4 w-4 text-purple-600" />}
                    {activity.type === "support" && <AlertCircle className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-tight">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Há {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default memo(AdminDashboard);
