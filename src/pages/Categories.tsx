import { memo } from "react";
import { PieChart, Plus, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/user/PageHeader";
import { toast } from "sonner";

const CATEGORIES = [
  { name: "Alimentação", budget: 800, spent: 650, color: "bg-emerald-500", icon: "🍽️" },
  { name: "Transporte", budget: 400, spent: 280, color: "bg-blue-500", icon: "🚗" },
  { name: "Lazer", budget: 500, spent: 350, color: "bg-amber-500", icon: "🎮" },
  { name: "Contas", budget: 600, spent: 520, color: "bg-red-500", icon: "💡" },
  { name: "Saúde", budget: 300, spent: 150, color: "bg-purple-500", icon: "🏥" },
  { name: "Educação", budget: 200, spent: 180, color: "bg-pink-500", icon: "📚" },
];

const CategoriesPage = memo(() => {
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
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Categorias</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orçamento Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2.800</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-500 rotate-180" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gasto Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2.130</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Suas Categorias</h3>
          <div className="space-y-6">
            {CATEGORIES.map((category) => {
              const percentage = (category.spent / category.budget) * 100;
              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        R$ {category.spent.toFixed(2)} / R$ {category.budget.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(0)}% utilizado</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.color} rounded-full transition-all`}
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
