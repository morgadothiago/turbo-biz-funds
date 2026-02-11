import { memo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  StatCard,
  ExpenseChart,
  CategoryChart,
  TransactionList,
  GoalsProgress,
  WhatsAppCTA,
} from "@/features/dashboard/components";
import { useDashboardData } from "@/features/dashboard/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="p-6 lg:p-8 space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-72" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-36 rounded-xl" />
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-7">
      <Skeleton className="h-80 lg:col-span-4 rounded-xl" />
      <Skeleton className="h-80 lg:col-span-3 rounded-xl" />
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

const UserDashboard = memo(() => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardData();

  const userName = user?.name?.split(" ")[0]?.trim() || "Usuário";

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Olá, {userName}! 👋
        </h2>
        <p className="text-muted-foreground">
          Aqui está o resumo das suas finanças deste mês
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ExpenseChart data={dashboardData.expensesByDay} />
        </div>
        <div className="lg:col-span-3">
          <CategoryChart data={dashboardData.categoryExpenses} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionList transactions={dashboardData.recentTransactions} />
        </div>
        <div>
          <GoalsProgress goals={dashboardData.goals} />
        </div>
      </div>

      <WhatsAppCTA />
    </div>
  );
});

UserDashboard.displayName = "UserDashboard";

export default UserDashboard;
