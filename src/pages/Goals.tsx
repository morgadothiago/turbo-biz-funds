import { memo } from "react";
import { Target, Plus, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/user/PageHeader";
import { toast } from "sonner";

const GOALS = [
  { 
    id: 1, 
    name: "Reserva de Emergência", 
    current: 8000, 
    target: 15000, 
    deadline: "Dez/2026",
    color: "bg-[#25D366]",
    icon: "🛡️",
    category: "Segurança"
  },
  { 
    id: 2, 
    name: "Viagem de Férias", 
    current: 3500, 
    target: 8000, 
    deadline: "Jul/2026",
    color: "bg-blue-500",
    icon: "✈️",
    category: "Lazer"
  },
  { 
    id: 3, 
    name: "Novo Notebook", 
    current: 2000, 
    target: 6000, 
    deadline: "Ago/2026",
    color: "bg-amber-500",
    icon: "💻",
    category: "Tecnologia"
  },
  { 
    id: 4, 
    name: "Curso de Inglês", 
    current: 1200, 
    target: 3000, 
    deadline: "Jun/2026",
    color: "bg-purple-500",
    icon: "📚",
    category: "Educação"
  },
];

const GoalsPage = memo(() => {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Metas Financeiras"
        subtitle="Acompanhe seus objetivos de economia"
        action={{
          label: "Nova Meta",
          onClick: () => toast.info("Em breve: criar meta")
        }}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Metas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Economizado</p>
                <p className="text-2xl font-bold text-[#25D366]">R$ 14.700</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Progresso Médio</p>
                <p className="text-2xl font-bold text-gray-900">48%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {GOALS.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          return (
            <Card key={goal.id} className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                      <Badge variant="outline" className="border-gray-300 text-gray-600 mt-1">
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{goal.deadline}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progresso</span>
                    <span className="font-medium text-gray-900">{percentage.toFixed(0)}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${goal.color} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-[#25D366] font-medium">R$ {goal.current.toLocaleString()}</span>
                    <span className="text-gray-500">R$ {goal.target.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
});

GoalsPage.displayName = "GoalsPage";

export default GoalsPage;
