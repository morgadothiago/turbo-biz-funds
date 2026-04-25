import { memo } from "react";
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
  const barColor = goal.color || "#10b981";

  return (
    <div className="space-y-1.5 pb-4 border-b border-border/60 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 truncate">{goal.name}</span>
        <span className="text-sm font-semibold text-gray-500 shrink-0 ml-2">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span className="font-medium">{formatCurrency(goal.current)}</span>
        <span>{formatCurrency(goal.target)}</span>
      </div>
    </div>
  );
});

const GoalsProgressComponent = memo(({ goals }: GoalsProgressProps) => {
  return (
    <div className="rounded-2xl border border-[#1a3799] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Blue banner header */}
      <div className="bg-[#1a3799] px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-tight">Metas</p>
          <p className="text-white/75 text-xs leading-tight mt-0.5">Progresso das suas economias</p>
        </div>
      </div>

      {/* Goals list */}
      <div className="bg-white px-5 py-4">
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
      </div>
    </div>
  );
});

GoalsProgressComponent.displayName = "GoalsProgress";

export const GoalsProgress = GoalsProgressComponent;
