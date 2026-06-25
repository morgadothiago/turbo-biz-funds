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
    <div className="rounded-2xl p-4 xl:p-5 flex flex-col gap-3 min-h-[110px] xl:min-h-[120px] relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a3799 0%, #142d7a 100%)" }}
    >
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ background: "#4a7fff", transform: "translate(30%, -30%)" }} />
      <div className="flex items-start justify-between gap-2 relative z-10">
        <p className="text-xs xl:text-[13px] font-medium text-white/70 leading-tight">{stat.title}</p>
        <div className={cn("w-8 h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center shrink-0 bg-white/15")}>
          <Icon className={cn("h-4 w-4", stat.color)} />
        </div>
      </div>
      <p className="text-2xl xl:text-3xl font-bold text-white leading-none tracking-tight relative z-10">{stat.value}</p>
      {stat.change && (
        <div className="flex items-center gap-1 relative z-10 flex-wrap">
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
