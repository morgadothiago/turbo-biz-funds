import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStat } from "../types";
import { cn } from "@/lib/utils";

interface StatCardProps {
  stat: DashboardStat;
}

const StatCardComponent = ({ stat }: StatCardProps) => {
  const Icon = stat.icon;

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)] hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1.5 truncate">
              {stat.value}
            </p>
            {stat.change && (
              <p className={cn(
                "text-xs mt-1.5 font-medium",
                stat.trend === "up" ? "text-success" : "text-destructive"
              )}>
                {stat.change}
              </p>
            )}
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            stat.bgColor
          )}>
            <Icon className={cn("h-5 w-5", stat.color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatCard = memo(StatCardComponent);
StatCard.displayName = "StatCard";
