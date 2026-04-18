import { memo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  StatCard,
  ExpenseChart,
  CategoryChart,
  TransactionList,
  GoalsProgress,
} from "@/features/dashboard/components";
import { useDashboardData } from "@/features/dashboard/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardSkeleton = () => (
  <div className="p-6 lg:p-8 space-y-6">
    <div className="space-y-1.5">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[88px] rounded-xl" />
      ))}
    </div>
    <div className="grid gap-5 lg:grid-cols-7">
      <Skeleton className="h-72 lg:col-span-4 rounded-xl" />
      <Skeleton className="h-72 lg:col-span-3 rounded-xl" />
    </div>
    <div className="grid gap-5 lg:grid-cols-3">
      <Skeleton className="h-60 lg:col-span-2 rounded-xl" />
      <Skeleton className="h-60 rounded-xl" />
    </div>
  </div>
);

const UserDashboard = memo(() => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, isError, refetch } = useDashboardData();

  const userName = user?.name?.split(" ")[0]?.trim() || "Usuário";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !dashboardData) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Falha ao carregar o dashboard</p>
          <p className="text-sm text-muted-foreground mt-1">Verifique sua conexão e tente novamente.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          {greeting}, {userName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Resumo das suas finanças deste mês
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ExpenseChart data={dashboardData.expensesByDay} />
        </div>
        <div className="lg:col-span-3">
          <CategoryChart data={dashboardData.categoryExpenses} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionList transactions={dashboardData.recentTransactions} />
        </div>
        <div>
          <GoalsProgress goals={dashboardData.goals} />
        </div>
      </div>
    </div>
  );
});

UserDashboard.displayName = "UserDashboard";

export default UserDashboard;
