/**
 * Componente de progresso das metas financeiras.
 * Exibe lista de metas com barra de progresso.
 */

import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { Goal } from "../types";
import { cn } from "@/lib/utils";

interface GoalsProgressProps {
  goals: Goal[];
}

const calculateProgress = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const GoalItem = memo(function GoalItem({ goal, index }: { goal: Goal; index: number }) {
  const percentage = calculateProgress(goal.current, goal.target);

  return (
    <div
      className="space-y-2 transition-all duration-300 hover:opacity-90"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground truncate pr-2 transition-colors hover:text-primary">
          {goal.name}
        </span>
        <span className="text-muted-foreground text-xs whitespace-nowrap transition-transform hover:scale-105">
          {percentage}%
        </span>
      </div>
      <Progress
        value={percentage}
        className={cn("h-2 transition-all duration-1000 ease-out", goal.color)}
      />
      <div className="flex justify-between text-xs text-muted-foreground transition-colors hover:text-foreground">
        <span>{formatCurrency(goal.current)}</span>
        <span>{formatCurrency(goal.target)}</span>
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center py-8">
      <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3 transition-transform hover:scale-110" />
      <p className="text-sm text-muted-foreground">Nenhuma meta configurada</p>
    </div>
  );
});

const GoalsProgressComponent = memo(({ goals }: GoalsProgressProps) => {
  if (goals.length === 0) {
    return (
      <Card className="border-border/60 transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary transition-transform hover:scale-110" />
            Metas
          </CardTitle>
          <CardDescription>Configure suas metas financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary transition-transform hover:scale-110" />
          Metas
        </CardTitle>
        <CardDescription>Progresso das suas economias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal, index) => (
          <GoalItem key={goal.id} goal={goal} index={index} />
        ))}
      </CardContent>
    </Card>
  );
});

GoalsProgressComponent.displayName = "GoalsProgress";

export const GoalsProgress = GoalsProgressComponent;
