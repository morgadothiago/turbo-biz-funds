import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Goal } from "../types";

interface GoalsProgressProps {
  goals: Goal[];
}

const calculateProgress = (current: number, target: number): number =>
  Math.min(Math.round((current / target) * 100), 100);

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const GoalItem = memo(function GoalItem({ goal }: { goal: Goal }) {
  const percentage = calculateProgress(goal.current, goal.target);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{goal.icon}</span>
          <span className="text-sm font-medium text-foreground truncate">{goal.name}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground shrink-0 ml-2">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: goal.color?.replace("bg-", "") || "#10b981" }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{formatCurrency(goal.current)}</span>
        <span>{formatCurrency(goal.target)}</span>
      </div>
    </div>
  );
});

const GoalsProgressComponent = memo(({ goals }: GoalsProgressProps) => {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pt-5 px-5 pb-3">
        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Metas
        </CardTitle>
        <CardDescription className="text-xs mt-0.5">
          {goals.length > 0 ? "Progresso das suas economias" : "Nenhuma meta configurada"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {goals.length === 0 ? (
          <div className="py-8 text-center">
            <Target className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Adicione metas na tela de Metas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

GoalsProgressComponent.displayName = "GoalsProgress";

export const GoalsProgress = GoalsProgressComponent;
