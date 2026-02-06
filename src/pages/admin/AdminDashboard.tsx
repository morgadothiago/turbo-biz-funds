import { memo } from "react";
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  UserPlus,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  Bar
} from "recharts";

// Dados estáticos memoizados para evitar recriação
const STATS_CARDS = [
  {
    title: "Receita Mensal (MRR)",
    value: "R$ 47.890",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Total de Clientes",
    value: "1.234",
    change: "+45",
    trend: "up" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Clientes Ativos",
    value: "1.089",
    change: "+67",
    trend: "up" as const,
    icon: Sparkles,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    title: "Taxa de Conversão",
    value: "24.8%",
    change: "-2.1%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

const REVENUE_DATA = [
  { month: "Jan", receita: 32000, clientes: 980 },
  { month: "Fev", receita: 35000, clientes: 1050 },
  { month: "Mar", receita: 38500, clientes: 1120 },
  { month: "Abr", receita: 41200, clientes: 1150 },
  { month: "Mai", receita: 44800, clientes: 1190 },
  { month: "Jun", receita: 47890, clientes: 1234 },
];

const PLAN_DISTRIBUTION = [
  { name: "Free", value: 89, color: "#94a3b8" },
  { name: "Pro", value: 98, color: "#3b82f6" },
  { name: "Business", value: 47, color: "#10b981" },
];

const RECENT_CLIENTS = [
  { name: "João Silva", email: "joao.silva@email.com", plan: "Pro", status: "Ativo", date: "Hoje" },
  { name: "Maria Santos", email: "maria.santos@email.com", plan: "Business", status: "Ativo", date: "Hoje" },
  { name: "Pedro Costa", email: "pedro.costa@email.com", plan: "Free", status: "Trial", date: "Ontem" },
  { name: "Ana Oliveira", email: "ana.oliveira@email.com", plan: "Pro", status: "Ativo", date: "Ontem" },
  { name: "Carlos Mendes", email: "carlos.mendes@email.com", plan: "Business", status: "Pendente", date: "2 dias" },
];

const RECENT_ACTIVITY = [
  { type: "signup" as const, message: "Novo cliente: João Silva", time: "5 min" },
  { type: "payment" as const, message: "Pagamento recebido: R$ 199,00", time: "1h" },
  { type: "upgrade" as const, message: "Upgrade de plano: Maria Santos (Free → Pro)", time: "2h" },
  { type: "support" as const, message: "Novo ticket de suporte #1234", time: "3h" },
  { type: "signup" as const, message: "Novo cliente: Ana Oliveira", time: "4h" },
];

function AdminDashboard() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader 
        title="Dashboard" 
        subtitle="Visão geral da plataforma FinanceAI"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_CARDS.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                      <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Evolução da Receita</CardTitle>
              <CardDescription>MRR dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `R$${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Receita"]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição de Planos</CardTitle>
              <CardDescription>Clientes por tipo de plano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PLAN_DISTRIBUTION} layout="vertical">
                    <XAxis type="number" className="text-xs" />
                    <YAxis type="category" dataKey="name" className="text-xs" width={70} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} clientes`, "Total"]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Clients */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Clientes Recentes</CardTitle>
                <CardDescription>Últimos cadastros na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm">Ver todos</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_CLIENTS.map((client) => (
                    <TableRow key={client.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {client.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.plan === "Business" ? "default" : client.plan === "Pro" ? "secondary" : "outline"}>
                          {client.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === "Ativo" ? "default" : client.status === "Trial" ? "secondary" : "outline"} className={client.status === "Ativo" ? "bg-success/10 text-success hover:bg-success/20" : ""}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {client.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "signup" ? "bg-primary/10" :
                      activity.type === "payment" ? "bg-success/10" :
                      activity.type === "upgrade" ? "bg-accent/10" :
                      "bg-warning/10"
                    }`}>
                      {activity.type === "signup" && <UserPlus className="h-4 w-4 text-primary" />}
                      {activity.type === "payment" && <CreditCard className="h-4 w-4 text-success" />}
                      {activity.type === "upgrade" && <TrendingUp className="h-4 w-4 text-accent" />}
                      {activity.type === "support" && <AlertCircle className="h-4 w-4 text-warning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">Há {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default memo(AdminDashboard);
