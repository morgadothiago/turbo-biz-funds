import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import type { Transaction } from "@/shared/types";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = memo(({ transactions }: TransactionListProps) => {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
        <div>
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Transações recentes
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">Últimas movimentações</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary hover:text-primary hover:bg-primary/8 h-7 px-2.5"
        >
          Ver todas
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {transactions.length === 0 ? (
          <div className="py-10 text-center">
            <Receipt className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma transação neste período</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((transaction) => {
              const isIncome = transaction.amount > 0;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors duration-100 group"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    isIncome ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10"
                  )}>
                    {isIncome
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      : <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {transaction.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                  <span className={cn(
                    "text-sm font-semibold shrink-0",
                    isIncome ? "text-emerald-600" : "text-foreground"
                  )}>
                    {isIncome ? "+" : "−"}R${" "}
                    {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TransactionList.displayName = "TransactionList";
