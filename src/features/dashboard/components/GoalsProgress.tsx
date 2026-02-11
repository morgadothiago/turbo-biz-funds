/**
 * Componente de progresso das metas financeiras.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { Goal } from "../types";

interface GoalsProgressProps {
  goals: Goal[];
}

export const GoalsProgress = ({ goals }: GoalsProgressProps) => {
  const calculateProgress = (current: number, target: number): number => {
    return Math.round((current / target) * 100);
  };

  return (
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
        {goals.map((goal) => {
          const percentage = calculateProgress(goal.current, goal.target);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground">
                  R$ {goal.current.toLocaleString()} / R${" "}
                  {goal.target.toLocaleString()}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {percentage}% completo
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
