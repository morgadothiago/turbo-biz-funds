import { memo, useState } from "react";
import { Target, Plus, Trophy, TrendingUp, Trash2, Loader2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/user/PageHeader";
import {
  PageHeaderSkeleton,
  StatsGridSkeleton,
  GoalsGridSkeleton
} from "@/components/ui/page-skeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGoals, useCreateGoal, useDeleteGoal, useUpdateGoal } from "@/features/goals/hooks/use-goals";
import { fmtBRL } from "@/lib/format";

const GOAL_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500",
  "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-red-500",
];

const GOAL_ICONS = ["🎯", "🏠", "✈️", "🚗", "💰", "📱", "🎓", "💊"];

const GoalsPageSkeleton = () => (
  <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
    <PageHeaderSkeleton />
    <StatsGridSkeleton />
    <GoalsGridSkeleton />
  </div>
);

const GoalsPage = memo(() => {
  const { goals, isLoading, isError, error, refetch } = useGoals();
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();
  const updateGoal = useUpdateGoal();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<{ id: string; name: string; current: number; target: number } | null>(null);
  const [editCurrentValue, setEditCurrentValue] = useState("");
  const [form, setForm] = useState({
    name: "",
    target: "",
    current: "0",
    deadline: "",
    category: "",
    color: GOAL_COLORS[0],
    icon: GOAL_ICONS[0],
  });

  const handleCreate = () => {
    if (!form.name.trim() || !form.target || !form.deadline) {
      toast.error("Preencha nome, valor alvo e prazo");
      return;
    }
    
    const targetValue = parseFloat(form.target);
    if (isNaN(targetValue) || targetValue <= 0) {
      toast.error("Valor alvo inválido");
      return;
    }
    
    const currentValue = parseFloat(form.current) || 0;

    if (currentValue > targetValue) {
      toast.error("Valor já economizado não pode ser maior que o valor alvo");
      return;
    }

    createGoal.mutate(
      {
        name: form.name.trim(),
        target: targetValue,
        current: currentValue,
        deadline: form.deadline, // Enviar no formato YYYY-MM-DD que o input date retorna
        category: form.category.trim() || "Geral",
      },
      {
        onSuccess: () => {
          toast.success("Meta criada!");
          setIsDialogOpen(false);
          setForm({ name: "", target: "", current: "0", deadline: "", category: "", color: GOAL_COLORS[0], icon: GOAL_ICONS[0] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          console.error("[Goals] Erro ao criar meta:", error);
          // Se for 422, mostra mensagem de validação
          if (error?.status === 422) {
            const code = error?.code;
            if (code === "GOAL_INVALID_VALUES") {
              toast.error("Valor já economizado não pode ser maior que o valor alvo");
            } else {
              toast.error("Dados inválidos. Verifique os campos.");
            }
          } else if (error?.status === 500) {
            toast.error("Erro no servidor. Tente novamente mais tarde.");
          } else if (error?.status === 404) {
            toast.error("Funcionalidade em desenvolvimento.");
          } else {
            toast.error("Erro ao criar meta");
          }
        },
      }
    );
  };

  const handleUpdateProgress = () => {
    if (!editGoal) return;
    const value = parseFloat(editCurrentValue.replace(",", "."));
    if (isNaN(value) || value < 0) {
      toast.error("Valor inválido");
      return;
    }
    if (value > editGoal.target) {
      toast.error("Valor não pode ser maior que o objetivo");
      return;
    }
    updateGoal.mutate(
      { id: editGoal.id, current: value },
      {
        onSuccess: () => {
          toast.success("Progresso atualizado!");
          setEditGoal(null);
          setEditCurrentValue("");
        },
        onError: () => toast.error("Erro ao atualizar progresso"),
      }
    );
  };

  if (isLoading) {
    return <GoalsPageSkeleton />;
  }

  if (isError) {
    // Endpoint ainda não implementado no backend — exibe tela funcional com lista vazia
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Metas Financeiras"
        subtitle="Acompanhe seus objetivos de economia"
        action={{
          label: "Nova Meta",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8">
        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Economizado</p>
                <p className="text-2xl font-bold text-primary">
                  {fmtBRL(goals.reduce((acc, g) => acc + g.current, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform hover:scale-110">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  {goals.length > 0
                    ? Math.round(
                        goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) /
                          goals.length
                      )
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Target className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma meta cadastrada</h3>
          <p className="text-muted-foreground mb-4">Crie sua primeira meta financeira</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
            return (
              <Card
                key={goal.id}
                className="border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{goal.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Atualizar progresso de ${goal.name}`}
                        className="h-7 w-7 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setEditGoal({ id: String(goal.id), name: goal.name, current: goal.current, target: goal.target });
                          setEditCurrentValue(String(goal.current));
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover meta ${goal.name}`}
                        className="h-7 w-7 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          deleteGoal.mutate(String(goal.id), {
                            onSuccess: () => toast.success("Meta removida"),
                            onError: () => toast.error("Erro ao remover meta"),
                          });
                        }}
                        disabled={deleteGoal.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium text-foreground">{percentage}%</span>
                    </div>

                    <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm pt-1">
                      <span className="text-primary font-medium">
                        {fmtBRL(goal.current)}
                      </span>
                      <span className="text-muted-foreground">
                        {fmtBRL(goal.target)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal atualizar progresso */}
      <Dialog open={!!editGoal} onOpenChange={(open) => { if (!open) { setEditGoal(null); setEditCurrentValue(""); } }}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm">
          <DialogHeader>
            <DialogTitle>Atualizar Progresso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Meta: <span className="font-medium text-foreground">{editGoal?.name}</span>
            </p>
            <div className="space-y-2">
              <Label>Valor já economizado (R$)</Label>
              <Input
                type="number"
                placeholder="0,00"
                value={editCurrentValue}
                onChange={(e) => setEditCurrentValue(e.target.value)}
                min="0"
                max={editGoal?.target}
                step="0.01"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Objetivo: {fmtBRL(editGoal?.target ?? 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditGoal(null); setEditCurrentValue(""); }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProgress} disabled={updateGoal.isPending}>
              {updateGoal.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da meta</Label>
              <Input
                placeholder="Ex: Viagem para Europa"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor alvo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Já economizado (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={form.current}
                  onChange={(e) => setForm({ ...form, current: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prazo</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Ex: Viagem"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="flex gap-2 flex-wrap">
                {GOAL_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition-colors ${
                      form.icon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createGoal.isPending}>
              {createGoal.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Meta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

GoalsPage.displayName = "GoalsPage";

export default GoalsPage;
