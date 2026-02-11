import { memo, useState } from "react";
import { PieChart, Plus, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/user/PageHeader";
import {
  PageHeaderSkeleton,
  StatsGridSkeleton,
  CategoriesListSkeleton
} from "@/components/ui/page-skeletons";
import { toast } from "sonner";

const CATEGORIES = [
  { name: "Alimentação", budget: 800, spent: 650, color: "bg-emerald-500", icon: "🍽️" },
  { name: "Transporte", budget: 400, spent: 280, color: "bg-blue-500", icon: "🚗" },
  { name: "Lazer", budget: 500, spent: 350, color: "bg-amber-500", icon: "🎮" },
  { name: "Contas", budget: 600, spent: 520, color: "bg-red-500", icon: "💡" },
  { name: "Saúde", budget: 300, spent: 150, color: "bg-purple-500", icon: "🏥" },
  { name: "Educação", budget: 200, spent: 180, color: "bg-pink-500", icon: "📚" },
];

const CategoriesPageSkeleton = () => (
  <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
    <PageHeaderSkeleton />
    <StatsGridSkeleton />
    <div className="h-96 rounded-xl bg-muted" />
  </div>
);

const CategoriesPage = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES);

  const totalBudget = categories.reduce((acc, c) => acc + c.budget, 0);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Categorias atualizadas");
    }, 1000);
  };

  if (isLoading) {
    return <CategoriesPageSkeleton />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Categorias"
        subtitle="Organize seus gastos por categoria"
        action={{
          label: "Nova Categoria",
          onClick: () => toast.info("Em breve: criar categoria")
        }}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Categorias</p>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-2xl font-bold text-foreground">R$ {totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center transition-transform hover:scale-110">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gasto Total</p>
                <p className="text-2xl font-bold text-foreground">R$ {totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6">Suas Categorias</h3>
          <div className="space-y-6">
            {categories.map((category) => {
              const percentage = Math.round((category.spent / category.budget) * 100);
              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-transform hover:scale-125">{category.icon}</span>
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">
                        R$ {category.spent.toFixed(2)} / R$ {category.budget.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{percentage}% utilizado</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CategoriesPage.displayName = "CategoriesPage";

export default CategoriesPage;
