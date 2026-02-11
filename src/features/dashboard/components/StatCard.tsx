/**
 * Componente de card de estatística do dashboard.
 * Exibe título, valor, variação percentual e ícone.
 */

import { memo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStat } from "../types";

interface StatCardProps {
  stat: DashboardStat;
}

/**
 * Componente de card de estatística do dashboard.
 * Exibe título, valor, variação percentual e ícone.
 *
 * @component
 * @example
 * ```tsx
 * <StatCard stat={dashboardStat} />
 * ```
 *
 * @param stat - Dados da estatística (ver DashboardStat type)
 * @returns Card estilizado com cores dinâmicas baseadas no trend
 */

const StatCardComponent = ({ stat }: StatCardProps) => {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <Icon className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="flex items-center text-xs mt-1">
          <TrendIcon
            className={`h-3 w-3 mr-1 ${
              stat.trend === "up" ? "text-success" : "text-destructive"
            }`}
          />
          <span
            className={stat.trend === "up" ? "text-success" : "text-destructive"}
          >
            {stat.change}
          </span>
          <span className="text-muted-foreground ml-1">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatCard = memo(StatCardComponent);
StatCard.displayName = "StatCard";
