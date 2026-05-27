import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown } from "lucide-react";
import { CategoryExpense } from "../types";
import { fmtBRL } from "@/lib/format";

interface CategoryChartProps {
  data: CategoryExpense[];
}

export const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <span className="text-[15px] font-bold text-gray-900">Gastos por Categoria</span>
        </div>
        <p className="text-xs text-gray-400 ml-9">Distribuição dos seus gastos</p>
      </div>

      <div className="px-5 pb-5">
        {data.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center gap-2">
            <TrendingDown className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Nenhuma categoria com despesas</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <RePieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  formatter={(value: number, name: string) => [fmtBRL(value), name]}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 justify-center">
              {data.map((cat, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate max-w-24">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
