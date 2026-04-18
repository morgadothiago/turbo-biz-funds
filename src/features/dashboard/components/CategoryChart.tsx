import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { CategoryExpense } from "../types";

interface CategoryChartProps {
  data: CategoryExpense[];
}

export const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pt-5 px-5 pb-3">
        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Gastos por categoria
        </CardTitle>
        <CardDescription className="text-xs mt-0.5">Distribuição das despesas</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {data.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center gap-2">
            <PieChart className="h-8 w-8 text-muted-foreground/20" />
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
                  outerRadius={72}
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
                    border: "1px solid hsl(220 13% 90%)",
                    boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  formatter={(value: number, name: string) => [
                    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    name,
                  ]}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
              {data.map((cat, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate max-w-24">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
