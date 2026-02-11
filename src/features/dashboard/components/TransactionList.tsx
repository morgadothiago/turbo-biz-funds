/**
 * Componente de lista de transações recentes.
 */

import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import type { Transaction } from "@/shared/types";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = memo(({ transactions }: TransactionListProps) => {
  return (
    <Card className="border-border/60 transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary transition-transform hover:scale-110" />
            Transações
          </CardTitle>
          <CardDescription className="transition-colors">Suas movimentações recentes</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary transition-all hover:bg-primary/10"
        >
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                "bg-muted/30 hover:bg-muted/60",
                "transition-all duration-300",
                "cursor-pointer border border-transparent",
                "hover:scale-[1.02] hover:shadow-sm hover:border-primary/20",
                "group"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0 transition-transform group-hover:scale-125">
                  {transaction.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-foreground transition-colors group-hover:text-primary">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate transition-colors group-hover:text-foreground/80">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "font-semibold text-sm flex-shrink-0 transition-all",
                  "group-hover:scale-105",
                  transaction.amount > 0 ? "text-success" : "text-foreground"
                )}
              >
                {transaction.amount > 0 ? "+" : ""}
                R$ {Math.abs(transaction.amount).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

TransactionList.displayName = "TransactionList";
