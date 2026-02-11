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

const UserDashboard = memo(() => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardData();

  const userName = user?.name?.split(" ")[0]?.trim() || "Usuário";

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Olá, {userName}! 👋
        </h2>
        <p className="text-muted-foreground">
          Aqui está o resumo das suas finanças deste mês.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <ExpenseChart data={dashboardData.expensesByDay} />
        <CategoryChart data={dashboardData.categoryExpenses} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TransactionList transactions={dashboardData.recentTransactions} />
        <GoalsProgress goals={dashboardData.goals} />
      </div>

      <WhatsAppCTA />
    </div>
  );
});

UserDashboard.displayName = "UserDashboard";

export default UserDashboard;
