import { memo, useState } from "react";
import { CreditCard, Plus, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/user/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCards, useCreateCard, useDeleteCard } from "@/features/cards/hooks/use-cards";

const CARD_COLORS = [
  "from-blue-500 to-blue-700",
  "from-slate-700 to-slate-900",
  "from-emerald-500 to-emerald-700",
  "from-purple-500 to-purple-700",
  "from-rose-500 to-rose-700",
];

const CardsPage = memo(() => {
  const { cards, isLoading, isError, error } = useCards();
  const createCard = useCreateCard();
  const deleteCard = useDeleteCard();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    number: "",
    limit: "",
    dueDate: "",
    flag: "Visa",
    color: CARD_COLORS[0],
  });

  const handleCreate = () => {
    if (!form.name.trim() || !form.number || !form.limit || !form.dueDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    createCard.mutate(
      {
        name: form.name.trim(),
        number: form.number.replace(/\s/g, "").slice(-4).padStart(16, "*"),
        limit: parseFloat(form.limit),
        dueDate: form.dueDate,
        flag: form.flag,
        color: form.color,
      },
      {
        onSuccess: () => {
          toast.success("Cartão adicionado!");
          setIsDialogOpen(false);
          setForm({ name: "", number: "", limit: "", dueDate: "", flag: "Visa", color: CARD_COLORS[0] });
        },
        onError: () => toast.error("Erro ao adicionar cartão"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando cartões...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    // Endpoint ainda não implementado no backend — exibe tela funcional com lista vazia
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Cartões de Crédito"
        subtitle="Gerencie seus cartões e limites"
        action={{
          label: "Adicionar Cartão",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum cartão cadastrado</h3>
          <p className="text-muted-foreground mb-4">Adicione seu primeiro cartão de crédito</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Cartão
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Card key={card.id} className="border-border shadow-sm overflow-hidden group">
              <div className={`h-36 bg-gradient-to-br ${card.color} p-6 flex flex-col justify-between relative`}>
                <div className="flex justify-between items-start">
                  <span className="text-white font-semibold">{card.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">{card.flag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/20"
                      onClick={() => {
                        deleteCard.mutate(String(card.id), {
                          onSuccess: () => toast.success("Cartão removido"),
                          onError: () => toast.error("Erro ao remover cartão"),
                        });
                      }}
                      disabled={deleteCard.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-white text-xl tracking-widest font-mono">{card.number}</p>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Limite Utilizado</p>
                    <p className="text-lg font-semibold text-foreground">
                      R$ {card.used.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Limite Total</p>
                    <p className="text-lg font-semibold text-foreground">
                      R$ {card.limit.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, (card.used / card.limit) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.min(100, Math.round((card.used / card.limit) * 100))}% utilizado
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Badge variant="outline">Vencimento: {card.dueDate}</Badge>
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Cartão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do cartão</Label>
              <Input
                placeholder="Ex: Nubank Platinum"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Número do cartão (últimos 4 dígitos)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0000"
                maxLength={4}
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Limite (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Dia de vencimento</Label>
                <Input
                  type="text"
                  placeholder="Ex: 10"
                  maxLength={2}
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <div className="flex gap-2">
                {["Visa", "Mastercard", "Elo", "Amex"].map((flag) => (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => setForm({ ...form, flag })}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                      form.flag === flag
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {CARD_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} border-2 transition-all ${
                      form.color === color ? "border-foreground scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createCard.isPending}>
              {createCard.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CardsPage.displayName = "CardsPage";

export default CardsPage;
