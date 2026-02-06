import { memo } from "react";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  PieChart,
  Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const STATS_CARDS = [
  {
    title: "Saldo do Mês",
    value: "R$ 3.450,00",
    change: "+12%",
    trend: "up" as const,
    icon: Wallet,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Receitas",
    value: "R$ 5.200,00",
    change: "+8%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Despesas",
    value: "R$ 1.750,00",
    change: "-5%",
    trend: "down" as const,
    icon: TrendingDown,
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  {
    title: "Categorias",
    value: "12",
    change: "+2",
    trend: "up" as const,
    icon: PieChart,
    color: "text-accent",
    bgColor: "bg-accent/10"
  }
];

const EXPENSE_DATA = [
  { day: "01", valor: 120 },
  { day: "05", valor: 350 },
  { day: "10", valor: 80 },
  { day: "15", valor: 520 },
  { day: "20", valor: 200 },
  { day: "25", valor: 180 },
  { day: "30", valor: 300 },
];

const CATEGORY_DATA = [
  { name: "Alimentação", value: 450, color: "#10b981" },
  { name: "Transporte", value: 280, color: "#3b82f6" },
  { name: "Lazer", value: 350, color: "#f59e0b" },
  { name: "Contas", value: 520, color: "#ef4444" },
  { name: "Outros", value: 150, color: "#94a3b8" },
];

const RECENT_TRANSACTIONS = [
  { id: 1, description: "Supermercado Extra", category: "Alimentação", amount: -245.50, date: "Hoje", icon: "🛒" },
  { id: 2, description: "Uber - Viagem", category: "Transporte", amount: -28.90, date: "Hoje", icon: "🚗" },
  { id: 3, description: "Salário", category: "Renda", amount: 5200.00, date: "Ontem", icon: "💰" },
  { id: 4, description: "Netflix", category: "Lazer", amount: -39.90, date: "Ontem", icon: "🎬" },
  { id: 5, description: "Conta de Luz", category: "Contas", amount: -180.00, date: "2 dias", icon: "💡" },
];

const GOALS = [
  { name: "Reserva de Emergência", current: 8000, target: 15000, color: "bg-success" },
  { name: "Viagem de Férias", current: 3500, target: 8000, color: "bg-primary" },
  { name: "Novo Notebook", current: 2000, target: 6000, color: "bg-accent" },
];

const StatCard = memo(({ stat }: { stat: typeof STATS_CARDS[0] }) => {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <Icon className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="flex items-center text-xs mt-1">
          <TrendIcon className={`h-3 w-3 mr-1 ${stat.trend === "up" ? "text-success" : "text-destructive"}`} />
          <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
            {stat.change}
          </span>
          <span className="text-muted-foreground ml-1">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = "StatCard";

const UserDashboard = memo(() => {
  const { user } = useAuth();

  return (
    <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Olá, {user?.name?.split(" ")[0] || "Usuário"}! 👋
          </h2>
          <p className="text-muted-foreground">
            Aqui está o resumo das suas finanças deste mês.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STATS_CARDS.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Expense Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Gastos do Mês
              </CardTitle>
              <CardDescription>
                Evolução dos seus gastos ao longo do mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={EXPENSE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#888888" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    formatter={(value: number) => [`R$ ${value}`, "Valor"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-accent" />
                Gastos por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição dos seus gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    formatter={(value: number, name: string) => [`R$ ${value}`, name]}
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {CATEGORY_DATA.map((cat, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Últimas Transações
                </CardTitle>
                <CardDescription>
                  Suas movimentações recentes
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_TRANSACTIONS.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{transaction.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? "text-success" : "text-destructive"}`}>
                      {transaction.amount > 0 ? "+" : ""}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-warning" />
                Minhas Metas
              </CardTitle>
              <CardDescription>
                Progresso das suas economias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {GOALS.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      R$ {goal.current.toLocaleString()} / R$ {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((goal.current / goal.target) * 100)}% completo
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp CTA */}
        <Card className="bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border-[#25D366]/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Registre pelo WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Envie áudio, foto ou texto e nossa IA categoriza automaticamente
                </p>
              </div>
            </div>
            <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white whitespace-nowrap">
              Conectar WhatsApp
            </Button>
          </CardContent>
        </Card>
    </div>
  );
});

UserDashboard.displayName = "UserDashboard";

export default UserDashboard;
