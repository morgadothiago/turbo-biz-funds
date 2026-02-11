import { memo, useState } from "react";
import { Target, Plus, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/user/PageHeader";
import {
  PageHeaderSkeleton,
  StatsGridSkeleton,
  GoalsGridSkeleton
} from "@/components/ui/page-skeletons";
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

const GoalsPageSkeleton = () => (
  <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
    <PageHeaderSkeleton />
    <StatsGridSkeleton />
    <GoalsGridSkeleton />
  </div>
);

const GoalsPage = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState(GOALS);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Metas atualizadas");
    }, 1000);
  };

  if (isLoading) {
    return <GoalsPageSkeleton />;
  }

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
        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Economizado</p>
                <p className="text-2xl font-bold text-primary">R$ {goals.reduce((acc, g) => acc + g.current, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <Card key={goal.id} className="border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl transition-transform hover:scale-125">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.name}</h3>
                      <Badge variant="outline" className="mt-1 transition-colors hover:bg-accent">
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium text-foreground">{percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-primary font-medium">R$ {goal.current.toLocaleString()}</span>
                    <span className="text-muted-foreground">R$ {goal.target.toLocaleString()}</span>
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
