/**
 * Componente de lista de transações recentes.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import type { Transaction } from "@/shared/types";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transações
          </CardTitle>
          <CardDescription>Suas movimentações recentes</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{transaction.icon}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "font-semibold text-sm flex-shrink-0",
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
};
