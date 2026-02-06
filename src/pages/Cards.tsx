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
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cartões</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Limite Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 8.000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Utilizado</p>
                <p className="text-2xl font-bold text-orange-600">R$ 3.500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map((card) => (
          <Card key={card.id} className="border border-gray-200 shadow-sm overflow-hidden">
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
                  <p className="text-sm text-gray-500">Limite Utilizado</p>
                  <p className="text-lg font-semibold text-gray-900">R$ {card.used.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Limite Total</p>
                  <p className="text-lg font-semibold text-gray-900">R$ {card.limit.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#25D366] rounded-full transition-all"
                    style={{ width: `${(card.used / card.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((card.used / card.limit) * 100)}% utilizado
                </p>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Badge variant="outline" className="border-gray-300 text-gray-600">
                  Vencimento: {card.dueDate}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#25D366] hover:text-[#128C7E] hover:bg-[#25D366]/10"
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
