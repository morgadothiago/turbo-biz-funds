import { memo } from "react";
import { CreditCard, Plus, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/user/PageHeader";
import { toast } from "sonner";

const CARDS = [
  {
    id: 1,
    name: "Nubank",
    number: "**** **** **** 1234",
    limit: 5000,
    used: 2300,
    dueDate: "15/02",
    color: "from-purple-500 to-purple-700",
    flag: "Mastercard"
  },
  {
    id: 2,
    name: "Inter",
    number: "**** **** **** 5678",
    limit: 3000,
    used: 1200,
    dueDate: "20/02",
    color: "from-orange-400 to-red-500",
    flag: "Visa"
  },
];

const CardsPage = memo(() => {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Cartões de Crédito"
        subtitle="Gerencie seus cartões e limites"
        action={{
          label: "Adicionar Cartão",
          onClick: () => toast.info("Em breve: adicionar cartão")
        }}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cartões</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Limite Total</p>
                <p className="text-2xl font-bold text-foreground">R$ 8.000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilizado</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">R$ 3.500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map((card) => (
          <Card key={card.id} className="border-border shadow-sm overflow-hidden">
            {/* Card Visual */}
            <div className={`h-36 bg-gradient-to-br ${card.color} p-6 flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <span className="text-white font-semibold">{card.name}</span>
                <span className="text-white/80 text-sm">{card.flag}</span>
              </div>
              <p className="text-white text-xl tracking-widest font-mono">{card.number}</p>
            </div>

            {/* Card Details */}
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Limite Utilizado</p>
                  <p className="text-lg font-semibold text-foreground">R$ {card.used.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Limite Total</p>
                  <p className="text-lg font-semibold text-foreground">R$ {card.limit.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(card.used / card.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((card.used / card.limit) * 100)}% utilizado
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge variant="outline">
                  Vencimento: {card.dueDate}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => toast.info("Em breve: ver fatura")}
                >
                  Ver fatura
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

CardsPage.displayName = "CardsPage";

export default CardsPage;
