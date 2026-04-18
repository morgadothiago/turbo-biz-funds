import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { ExpenseByDay } from "../types";

interface ExpenseChartProps {
  data: ExpenseByDay[];
}

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pt-5 px-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              Gastos do mês
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">Evolução diária das despesas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {data.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center gap-2">
            <TrendingDown className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Nenhuma despesa registrada</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(220 13% 90%)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "hsl(220 9% 60%)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(220 9% 60%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "1px solid hsl(220 13% 90%)",
                  boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                  fontSize: 12,
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Despesa"]}
                cursor={{ stroke: "hsl(220 13% 88%)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
