import { memo } from "react";
import { DashboardStat } from "../types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  stat: DashboardStat;
}

const StatCardComponent = ({ stat }: StatCardProps) => {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl bg-[#1a3799] p-4 flex flex-col gap-3 min-h-[110px]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-white/70 leading-tight">{stat.title}</p>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", stat.bgColor)}>
          <Icon className={cn("h-4 w-4", stat.color)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white leading-none tracking-tight">{stat.value}</p>
      {stat.change && (
        <div className="flex items-center gap-1">
          {stat.trend === "up" ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-green-400 shrink-0" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-400 shrink-0" />
          )}
          <p className={cn(
            "text-xs font-medium",
            stat.trend === "up" ? "text-green-400" : "text-red-400"
          )}>
            {stat.change}
          </p>
          <span className="text-xs text-white/40">vs mês anterior</span>
        </div>
      )}
    </div>
  );
};

export const StatCard = memo(StatCardComponent);
StatCard.displayName = "StatCard";
