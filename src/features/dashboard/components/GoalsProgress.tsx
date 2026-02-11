/**
 * Componente de progresso das metas financeiras.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { Goal } from "../types";
import { cn } from "@/lib/utils";

interface GoalsProgressProps {
  goals: Goal[];
}

export const GoalsProgress = ({ goals }: GoalsProgressProps) => {
  const calculateProgress = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (goals.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Metas
          </CardTitle>
          <CardDescription>Configure suas metas financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma meta configurada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Metas
        </CardTitle>
        <CardDescription>Progresso das suas economias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal) => {
          const percentage = calculateProgress(goal.current, goal.target);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate pr-2">
                  {goal.name}
                </span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {percentage}%
                </span>
              </div>
              <Progress
                value={percentage}
                className={cn("h-2", goal.color)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {goal.current.toLocaleString("pt-BR")}</span>
                <span>R$ {goal.target.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
