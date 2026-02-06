import { memo } from "react";
import { Receipt, Plus, Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/user/PageHeader";
import { toast } from "sonner";

const TRANSACTIONS = [
  { id: 1, description: "Supermercado Extra", category: "Alimentação", date: "06/02/2026", amount: -245.50, type: "expense", icon: "🛒" },
  { id: 2, description: "Salário", category: "Renda", date: "05/02/2026", amount: 5200.00, type: "income", icon: "💰" },
  { id: 3, description: "Uber - Centro", category: "Transporte", date: "05/02/2026", amount: -28.90, type: "expense", icon: "🚗" },
  { id: 4, description: "Netflix", category: "Lazer", date: "04/02/2026", amount: -39.90, type: "expense", icon: "🎬" },
  { id: 5, description: "Conta de Luz", category: "Contas", date: "03/02/2026", amount: -180.00, type: "expense", icon: "💡" },
  { id: 6, description: "Freelance Design", category: "Renda", date: "02/02/2026", amount: 850.00, type: "income", icon: "💻" },
];

const TransactionsPage = memo(() => {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas movimentações"
        action={{
          label: "Nova Transação",
          onClick: () => toast.info("Em breve: adicionar transação")
        }}
      />

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar transações..." 
                className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-[#25D366]" />
            <h3 className="font-semibold text-gray-900">Histórico de Transações</h3>
          </div>
          
          <div className="space-y-3">
            {TRANSACTIONS.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white">
                        {transaction.category}
                      </Badge>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {transaction.type === "income" ? "+" : ""}R$ {transaction.amount.toFixed(2)}
                  </span>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

TransactionsPage.displayName = "TransactionsPage";

export default TransactionsPage;
