import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, apiEndpoints } from "@/lib/api/client";
import { fmtBRL } from "@/lib/format";
import { BarChart2, Loader2, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApiTransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  occurredAt: string;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const LINE_COLORS = { a: "#3b82f6", b: "#f59e0b" };

function buildOptions() {
  const now = new Date();
  const opts: { label: string; value: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opts.push({ label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, value: val });
  }
  return opts;
}

/** Compute minimum period=Xd to cover both selected months from today */
function computePeriod(monthA: string, monthB: string): string {
  const today = new Date();
  const parseStart = (ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1);
  };
  const startA = parseStart(monthA);
  const startB = parseStart(monthB);
  const earliest = startA < startB ? startA : startB;
  const diffDays = Math.ceil((today.getTime() - earliest.getTime()) / 86_400_000) + 1;
  return `${Math.max(diffDays, 1)}d`;
}

function getDailyTotals(
  transactions: ApiTransaction[],
  yearMonth: string
): Record<number, number> {
  const [y, m] = yearMonth.split("-").map(Number);
  const totals: Record<number, number> = {};
  transactions.forEach((t) => {
    if (t.type !== "EXPENSE") return;
    const d = new Date(t.occurredAt);
    if (d.getFullYear() !== y || d.getMonth() + 1 !== m) return;
    const day = d.getDate();
    totals[day] = (totals[day] ?? 0) + t.amount;
  });
  return totals;
}

function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

/** Seeded pseudo-random so same month always gets same curve */
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildMockData(monthA: string, monthB: string) {
  const maxDay = Math.max(daysInMonth(monthA), daysInMonth(monthB));
  const [ya, ma] = monthA.split("-").map(Number);
  const [yb, mb] = monthB.split("-").map(Number);
  const randA = seededRand(ya * 100 + ma);
  const randB = seededRand(yb * 100 + mb);

  return Array.from({ length: maxDay }, (_, i) => {
    const day = i + 1;
    const hasA = day <= daysInMonth(monthA) && randA() > 0.5;
    const hasB = day <= daysInMonth(monthB) && randB() > 0.5;
    return {
      dia: day,
      [monthA]: hasA ? Math.round(50 + randA() * 950) : null,
      [monthB]: hasB ? Math.round(50 + randB() * 950) : null,
    };
  });
}

function buildChartData(
  transactions: ApiTransaction[],
  monthA: string,
  monthB: string
) {
  const totalsA = getDailyTotals(transactions, monthA);
  const totalsB = getDailyTotals(transactions, monthB);
  const maxDay = Math.max(daysInMonth(monthA), daysInMonth(monthB));

  return Array.from({ length: maxDay }, (_, i) => {
    const day = i + 1;
    const a = totalsA[day];
    const b = totalsB[day];
    return {
      dia: day,
      [monthA]: a != null ? a : null,
      [monthB]: b != null ? b : null,
    };
  });
}

const CustomTooltip = ({
  active,
  payload,
  label,
  monthLabels,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: number;
  monthLabels: Record<string, string>;
}) => {
  if (!active || !payload?.length) return null;
  const visible = payload.filter((p) => p.value != null);
  if (!visible.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">Dia {label}</p>
      {visible.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {monthLabels[p.dataKey]}: {fmtBRL(p.value)}
        </p>
      ))}
    </div>
  );
};

export function MonthComparisonChart() {
  const opts = useMemo(buildOptions, []);
  const [monthA, setMonthA] = useState(opts[1]?.value ?? opts[0].value);
  const [monthB, setMonthB] = useState(opts[0].value);
  const [simulating, setSimulating] = useState(false);

  const toggleSim = useCallback(() => setSimulating((v) => !v), []);

  // API only accepts known periods; use period=30d as real data fallback
  const { data: txRes, isLoading } = useQuery({
    queryKey: ["transactions", "30d"],
    queryFn: () =>
      api.get<{ data: ApiTransaction[] }>(
        `${apiEndpoints.transactions.list}?period=30d`
      ),
    staleTime: 5 * 60 * 1000,
    enabled: !simulating,
  });

  const transactions = txRes?.data ?? [];

  // Determine if selected months are outside the 30d window
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
  const isOutsideWindow = useCallback((ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    const monthEnd = new Date(y, m, 0); // last day of month
    return monthEnd < thirtyDaysAgo;
  }, [thirtyDaysAgo]);

  // Auto-enable sim when both months are outside data window
  const needsSim = isOutsideWindow(monthA) && isOutsideWindow(monthB);

  const chartData = useMemo(
    () =>
      simulating || needsSim
        ? buildMockData(monthA, monthB)
        : buildChartData(transactions, monthA, monthB),
    [transactions, monthA, monthB, simulating, needsSim]
  );

  const monthLabels: Record<string, string> = {
    [monthA]: opts.find((o) => o.value === monthA)?.label ?? monthA,
    [monthB]: opts.find((o) => o.value === monthB)?.label ?? monthB,
  };

  const isEmpty = !simulating && !needsSim && chartData.every((d) => d[monthA] == null && d[monthB] == null);
  const showingSim = simulating || needsSim;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Comparativo Mensal</CardTitle>
            <button
              onClick={toggleSim}
              className="ml-1"
              title={simulating ? "Desativar simulação" : "Simular dados"}
            >
              <Badge
                variant={showingSim ? "default" : "outline"}
                className={`text-[10px] gap-1 cursor-pointer select-none ${
                  showingSim
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                    : "hover:bg-muted"
                }`}
              >
                <FlaskConical className="w-2.5 h-2.5" />
                {showingSim ? "Simulando" : "Simular"}
              </Badge>
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={monthA} onValueChange={setMonthA}>
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opts.map((o) => (
                  <SelectItem key={o.value} value={o.value} disabled={o.value === monthB}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-xs font-medium">vs</span>
            <Select value={monthB} onValueChange={setMonthB}>
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opts.map((o) => (
                  <SelectItem key={o.value} value={o.value} disabled={o.value === monthA}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showingSim && (
          <p className="text-[11px] text-amber-500 flex items-center gap-1 mb-2">
            <FlaskConical className="w-3 h-3" />
            Dados simulados — valores ilustrativos
          </p>
        )}
        {!showingSim && isLoading ? (
          <div className="h-64 flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando...
          </div>
        ) : !showingSim && isEmpty ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
            <BarChart2 className="w-10 h-10 opacity-25" />
            <p>Sem despesas nos meses selecionados</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={64}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v}`
                }
              />
              <Tooltip content={<CustomTooltip monthLabels={monthLabels} />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-foreground">{monthLabels[value]}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey={monthA}
                name={monthA}
                stroke={LINE_COLORS.a}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey={monthB}
                name={monthB}
                stroke={LINE_COLORS.b}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
