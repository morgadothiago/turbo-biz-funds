import { memo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStat } from "../types";
import { cn } from "@/lib/utils";

interface StatCardProps {
  stat: DashboardStat;
}

const StatCardComponent = ({ stat }: StatCardProps) => {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg transition-transform group-hover:scale-110",
            stat.bgColor
          )}
        >
          <Icon className={cn("h-4 w-4", stat.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendIcon
            className={cn(
              "h-3.5 w-3.5",
              stat.trend === "up" ? "text-success" : "text-destructive"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              stat.trend === "up" ? "text-success" : "text-destructive"
            )}
          >
            {stat.change}
          </span>
          <span className="text-xs text-muted-foreground">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatCard = memo(StatCardComponent);
StatCard.displayName = "StatCard";
