import { memo, useState } from "react";
import { PieChart, Plus, Wallet, Trash2, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/user/PageHeader";
import { PageHeaderSkeleton, StatsGridSkeleton } from "@/components/ui/page-skeletons";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiEndpoints } from "@/lib/api/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fmtBRL } from "@/lib/format";

interface ApiCategory {
  id: string;
  name: string;
}

interface CategorySummaryItem {
  categoryId: string;
  income: number;
  expense: number;
}

const CategoriesPageSkeleton = () => (
  <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
    <PageHeaderSkeleton />
    <StatsGridSkeleton />
    <div className="h-96 rounded-xl bg-muted" />
  </div>
);

const CATEGORY_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-red-500",
  "bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-orange-500",
];

const CategoriesPage = memo(() => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ApiCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null);
  const [name, setName] = useState("");

  const { data: categoriesRes, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<{ data: ApiCategory[] }>(apiEndpoints.categories.list),
    staleTime: 5 * 60 * 1000,
  });

  const { data: summaryRes } = useQuery({
    queryKey: ["summary-categories"],
    queryFn: () =>
      api.get<{ data: CategorySummaryItem[] }>(`${apiEndpoints.summary.categories}?period=30d`),
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesRes?.data ?? [];
  const summary = summaryRes?.data ?? [];
  const summaryMap = new Map(summary.map((s) => [s.categoryId, s]));

  const totalSpent = summary.reduce((acc, s) => acc + s.expense, 0);

  const createMutation = useMutation({
    mutationFn: (data: { name: string }) =>
      api.post<{ data: ApiCategory }>(apiEndpoints.categories.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada!");
      setIsCreateOpen(false);
      setName("");
    },
    onError: () => toast.error("Erro ao criar categoria"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch<{ data: ApiCategory }>(apiEndpoints.categories.update(id), { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada!");
      setEditTarget(null);
      setName("");
    },
    onError: () => toast.error("Erro ao atualizar categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete<{ data: { removed: boolean } }>(apiEndpoints.categories.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Categoria removida");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao remover categoria"),
  });

  const openEdit = (cat: ApiCategory) => {
    setEditTarget(cat);
    setName(cat.name);
  };

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Informe um nome"); return; }
    createMutation.mutate({ name: name.trim() });
  };

  const handleUpdate = () => {
    if (!editTarget || !name.trim()) { toast.error("Informe um nome"); return; }
    updateMutation.mutate({ id: editTarget.id, name: name.trim() });
  };

  if (isLoading) return <CategoriesPageSkeleton />;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Categorias"
        subtitle="Organize seus gastos por categoria"
        action={{
          label: "Nova Categoria",
          onClick: () => { setIsCreateOpen(true); setName(""); },
        }}
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Categorias</p>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gasto Total (30d)</p>
                <p className="text-2xl font-bold text-foreground">
                  {fmtBRL(totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Movimentação</p>
                <p className="text-2xl font-bold text-foreground">{summary.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6">Suas Categorias</h3>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma categoria criada ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat, i) => {
                const s = summaryMap.get(cat.id);
                const expense = s?.expense ?? 0;
                const income = s?.income ?? 0;
                const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="font-medium text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {expense > 0 && (
                        <span className="text-sm text-destructive">
                          -{fmtBRL(expense)}
                        </span>
                      )}
                      {income > 0 && (
                        <span className="text-sm text-success">
                          +{fmtBRL(income)}
                        </span>
                      )}
                      {!expense && !income && (
                        <span className="text-sm text-muted-foreground">Sem movimentação</span>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar categoria ${cat.name}`}
                          className="h-8 w-8"
                          onClick={() => openEdit(cat)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover categoria ${cat.name}`}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Nome</Label>
            <Input
              placeholder="Ex: Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Nome</Label>
            <Input
              placeholder="Ex: Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria <strong>{deleteTarget?.name}</strong> será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

CategoriesPage.displayName = "CategoriesPage";

export default CategoriesPage;
