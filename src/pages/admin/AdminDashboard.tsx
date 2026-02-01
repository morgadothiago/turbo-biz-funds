import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  UserPlus,
  AlertCircle
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

const statsCards = [
  {
    title: "Receita Mensal (MRR)",
    value: "R$ 47.890",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Total de Empresas",
    value: "234",
    change: "+8",
    trend: "up",
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Usuários Ativos",
    value: "1.429",
    change: "+23",
    trend: "up",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    title: "Taxa de Conversão",
    value: "24.8%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

const revenueData = [
  { month: "Jan", receita: 32000, empresas: 180 },
  { month: "Fev", receita: 35000, empresas: 195 },
  { month: "Mar", receita: 38500, empresas: 208 },
  { month: "Abr", receita: 41200, empresas: 215 },
  { month: "Mai", receita: 44800, empresas: 225 },
  { month: "Jun", receita: 47890, empresas: 234 },
];

const planDistribution = [
  { name: "Free", value: 89, color: "#94a3b8" },
  { name: "Pro", value: 98, color: "#3b82f6" },
  { name: "Business", value: 47, color: "#10b981" },
];

const recentCompanies = [
  { name: "Tech Solutions LTDA", email: "contato@techsolutions.com", plan: "Pro", status: "Ativo", date: "Hoje" },
  { name: "Inovação Digital ME", email: "admin@inovdigital.com", plan: "Business", status: "Ativo", date: "Hoje" },
  { name: "Startup Hub", email: "hello@startuphub.io", plan: "Free", status: "Trial", date: "Ontem" },
  { name: "Finance Corp", email: "suporte@financecorp.com", plan: "Pro", status: "Ativo", date: "Ontem" },
  { name: "E-commerce Plus", email: "vendas@ecommerceplus.com", plan: "Business", status: "Pendente", date: "2 dias" },
];

const recentActivity = [
  { type: "signup", message: "Nova empresa: Tech Solutions LTDA", time: "5 min" },
  { type: "payment", message: "Pagamento recebido: R$ 199,00", time: "1h" },
  { type: "upgrade", message: "Upgrade de plano: Startup Hub (Free → Pro)", time: "2h" },
  { type: "support", message: "Novo ticket de suporte #1234", time: "3h" },
  { type: "signup", message: "Nova empresa: Digital Marketing Co", time: "4h" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader 
        title="Dashboard" 
        subtitle="Visão geral da plataforma FinanceAI"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
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
                  <LineChart data={revenueData}>
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
              <CardDescription>Empresas por tipo de plano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planDistribution} layout="vertical">
                    <XAxis type="number" className="text-xs" />
                    <YAxis type="category" dataKey="name" className="text-xs" width={70} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} empresas`, "Total"]}
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
          {/* Recent Companies */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Empresas Recentes</CardTitle>
                <CardDescription>Últimos cadastros na plataforma</CardDescription>
              </div>
              <Button variant="outline" size="sm">Ver todas</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCompanies.map((company) => (
                    <TableRow key={company.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {company.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-xs text-muted-foreground">{company.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.plan === "Business" ? "default" : company.plan === "Pro" ? "secondary" : "outline"}>
                          {company.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.status === "Ativo" ? "default" : company.status === "Trial" ? "secondary" : "outline"} className={company.status === "Ativo" ? "bg-success/10 text-success hover:bg-success/20" : ""}>
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {company.date}
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
                {recentActivity.map((activity, index) => (
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
