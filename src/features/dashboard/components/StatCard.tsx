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
    <Card
      className={cn(
        "group relative overflow-hidden",
        "border-border/60 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-primary/5 before:to-transparent before:opacity-0",
        "before:transition-opacity hover:before:opacity-100"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          {stat.title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-3",
            stat.bgColor
          )}
        >
          <Icon className={cn("h-4 w-4 transition-colors", stat.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:text-primary">
          {stat.value}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendIcon
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              stat.trend === "up" ? "text-success" : "text-destructive",
              "group-hover:scale-110"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              stat.trend === "up" ? "text-success" : "text-destructive"
            )}
          >
            {stat.change}
          </span>
          <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/80">
            vs mês anterior
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatCard = memo(StatCardComponent);
StatCard.displayName = "StatCard";
