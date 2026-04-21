import { memo, useState } from "react";
import { RefreshCw, Plus, Repeat, TrendingUp, TrendingDown, Trash2, Loader2, Zap, Lock } from "lucide-react";
import { usePlanGuard } from "@/hooks/use-plan-guard";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useActiveRecurrences,
  useCreateRecurrence,
  useUpdateRecurrence,
  useGenerateRecurrences,
} from "@/features/recurrences/hooks/use-recurrences";
import { useCategories } from "@/features/categories/hooks/use-categories";
import type { RecurrencePayload } from "@/shared/types";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

const defaultForm = (): RecurrencePayload => ({
  categoryId: "",
  type: "EXPENSE",
  amount: 0,
  description: "",
  frequency: "monthly",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
});

const RecorrenciasPage = memo(() => {
  const { recurrences, isLoading } = useActiveRecurrences();
  const { categories } = useCategories();
  const createRecurrence = useCreateRecurrence();
  const updateRecurrence = useUpdateRecurrence();
  const generateRecurrences = useGenerateRecurrences();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const planGuard = usePlanGuard("recurrences", recurrences.length);

  const [form, setForm] = useState<RecurrencePayload & { amount: string }>(
    { ...defaultForm(), amount: "" } as RecurrencePayload & { amount: string }
  );

  const totalIncome = recurrences
    .filter((r) => r.type === "INCOME")
    .reduce((acc, r) => acc + r.amount, 0);

  const totalExpense = recurrences
    .filter((r) => r.type === "EXPENSE")
    .reduce((acc, r) => acc + r.amount, 0);

  const handleCreate = () => {
    if (!form.categoryId || !form.amount || !form.startDate) {
      toast.error("Preencha categoria, valor e data de início");
      return;
    }
    const payload: RecurrencePayload = {
      categoryId: form.categoryId,
      type: form.type,
      amount: parseFloat(String(form.amount)),
      description: form.description?.trim() || undefined,
      frequency: form.frequency,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };
    createRecurrence.mutate(payload, {
      onSuccess: () => {
        toast.success("Recorrência criada!");
        setIsDialogOpen(false);
        setForm({ ...defaultForm(), amount: "" } as RecurrencePayload & { amount: string });
      },
      onError: () => toast.error("Erro ao criar recorrência"),
    });
  };

  const handleDeactivate = (id: string) => {
    updateRecurrence.mutate(
      { id, active: false } as Partial<RecurrencePayload> & { id: string; active: boolean },
      {
        onSuccess: () => toast.success("Recorrência desativada"),
        onError: () => toast.error("Erro ao desativar recorrência"),
      }
    );
  };

  const handleGenerate = () => {
    generateRecurrences.mutate(undefined, {
      onSuccess: () => toast.success("Lançamentos futuros gerados!"),
      onError: () => toast.error("Erro ao gerar lançamentos"),
    });
  };

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <UpgradeModal
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        resource="recurrences"
        limit={planGuard.limit}
      />
      <PageHeader
        title="Recorrências"
        subtitle="Gerencie receitas e despesas fixas"
        action={{
          label: planGuard.limitReached ? "Fazer upgrade" : "Nova Recorrência",
          icon: planGuard.limitReached ? <Lock className="w-3.5 h-3.5" /> : undefined,
          variant: planGuard.limitReached ? "outline" : "default",
          onClick: () => planGuard.limitReached ? setIsUpgradeOpen(true) : setIsDialogOpen(true),
        }}
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Repeat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recorrências Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "—" : recurrences.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receitas Fixas</p>
                <p className="text-2xl font-bold text-emerald-500">R$ {fmt(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesas Fixas</p>
                <p className="text-2xl font-bold text-red-500">R$ {fmt(totalExpense)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={generateRecurrences.isPending}
        >
          {generateRecurrences.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          Gerar Lançamentos Futuros
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : recurrences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma recorrência cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Cadastre contas fixas como aluguel, salário ou assinaturas
          </p>
          <Button onClick={() => planGuard.limitReached ? setIsUpgradeOpen(true) : setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Recorrência
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recurrences.map((rec) => {
            const category = categories.find((c) => c.id === rec.categoryId);
            const isIncome = rec.type === "INCOME";
            return (
              <Card
                key={rec.id}
                className="border-border shadow-sm transition-all duration-200 hover:shadow-md group"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {rec.description || category?.name || "Sem descrição"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {FREQUENCY_LABELS[rec.frequency]}
                      </Badge>
                      {category && (
                        <span className="text-xs text-muted-foreground">{category.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        desde {new Date(rec.startDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-semibold text-base ${
                        isIncome ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}R$ {fmt(rec.amount)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Desativar recorrência"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeactivate(rec.id)}
                    disabled={updateRecurrence.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Recorrência</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as "INCOME" | "EXPENSE" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequência</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) =>
                    setForm({ ...form, frequency: v as RecurrencePayload["frequency"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value as unknown as number })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Aluguel"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de início</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de término (opcional)</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createRecurrence.isPending}>
              {createRecurrence.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

RecorrenciasPage.displayName = "RecorrenciasPage";

export default RecorrenciasPage;
