import { memo } from "react";
import { ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import type { Transaction } from "@/shared/types";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = memo(({ transactions }: TransactionListProps) => {
  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
      {/* Green banner header */}
      <div className="bg-[#25D366] px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Receipt className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-tight">Transações</p>
          <p className="text-white/75 text-xs leading-tight mt-0.5">Suas movimentações recentes</p>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-white">
        {transactions.length === 0 ? (
          <div className="py-12 text-center px-5">
            <Receipt className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma transação neste período</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {transactions.map((transaction) => {
              const isIncome = transaction.amount > 0;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors duration-100"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    isIncome ? "bg-emerald-50" : "bg-rose-50"
                  )}>
                    {isIncome
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      : <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                      {transaction.description}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                  <span className={cn(
                    "text-sm font-semibold shrink-0",
                    isIncome ? "text-emerald-600" : "text-gray-800"
                  )}>
                    {isIncome ? "+" : ""}R${" "}
                    {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

TransactionList.displayName = "TransactionList";
