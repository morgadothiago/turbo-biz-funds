import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  DollarSign,
  Zap,
  Crown,
  Sparkles,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminPlans,
  getAdminPlanIcon,
  getAdminPlanColor,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  type CreatePlanPayload,
} from "@/features/admin/hooks/use-admin-plans";
import { toast } from "@/components/ui/use-toast";

const statusColors: Record<string, string> = {
  Ativo: "bg-success/10 text-success",
  Trial: "bg-warning/10 text-warning",
  Inadimplente: "bg-destructive/10 text-destructive",
  Cancelado: "bg-muted text-muted-foreground",
};

export default function AdminPlans() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const { plans, subscriptions, isLoading, isError, error } = useAdminPlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  const [newPlan, setNewPlan] = useState<Partial<CreatePlanPayload>>({
    name: "",
    description: "",
    price: 0,
    billingPeriod: "mês",
    features: [],
    popular: false,
  });

  const [editPlanData, setEditPlanData] = useState<Partial<CreatePlanPayload>>({});

  const selectedPlan = plans.find((p) => p.id === editingPlanId) ?? null;
  const totalMRR = plans.reduce((sum, plan) => sum + plan.mrr, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);

  const openEditDialog = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setEditPlanData({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billingPeriod: plan.billingPeriod,
        features: plan.features,
        popular: plan.popular,
      });
    }
    setEditingPlanId(planId);
    setIsEditDialogOpen(true);
  };

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.description) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    createPlan.mutate(newPlan as CreatePlanPayload, {
      onSuccess: () => {
        toast({ title: "Plano criado com sucesso" });
        setIsCreateDialogOpen(false);
        setNewPlan({ name: "", description: "", price: 0, billingPeriod: "mês", features: [], popular: false });
      },
      onError: () => toast({ title: "Erro ao criar plano", variant: "destructive" }),
    });
  };

  const handleUpdatePlan = () => {
    if (!editingPlanId) return;
    updatePlan.mutate(
      { id: editingPlanId, ...editPlanData } as CreatePlanPayload & { id: string },
      {
        onSuccess: () => {
          toast({ title: "Plano atualizado com sucesso" });
          setIsEditDialogOpen(false);
        },
        onError: () => toast({ title: "Erro ao atualizar plano", variant: "destructive" }),
      }
    );
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan.mutate(planId, {
      onSuccess: () => toast({ title: "Plano desativado com sucesso" }),
      onError: () => toast({ title: "Erro ao desativar plano", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando planos...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive font-medium">Falha ao carregar planos</p>
          <p className="text-sm text-muted-foreground">{msg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ {totalMRR.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">MRR Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalSubscribers}</div>
                  <p className="text-sm text-muted-foreground">Total de assinantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ {totalSubscribers > 0 ? (totalMRR / totalSubscribers).toFixed(0) : "0"}</div>
                  <p className="text-sm text-muted-foreground">Ticket médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const PlanIcon = getAdminPlanIcon(plan.id);
                const planColor = getAdminPlanColor(plan.id);
                return (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${planColor}`}>
                        <PlanIcon className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(plan.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={deletePlan.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletePlan.isPending ? "Desativando..." : "Desativar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.billingPeriod}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{plan.subscribers}</div>
                        <p className="text-xs text-muted-foreground">Assinantes</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">R$ {plan.mrr.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">MRR</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Plano
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Plano</DialogTitle>
                    <DialogDescription>
                      Configure os detalhes do novo plano
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="plan-name">Nome do plano</Label>
                      <Input
                        id="plan-name"
                        placeholder="Ex: Enterprise"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="plan-description">Descrição</Label>
                      <Textarea
                        id="plan-description"
                        placeholder="Descreva o plano..."
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="plan-price">Preço (R$)</Label>
                        <Input
                          id="plan-price"
                          type="number"
                          placeholder="0"
                          value={newPlan.price}
                          onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="plan-period">Período</Label>
                        <Input
                          id="plan-period"
                          placeholder="mês"
                          value={newPlan.billingPeriod}
                          onChange={(e) => setNewPlan({ ...newPlan, billingPeriod: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="plan-popular">Plano popular</Label>
                      <Switch
                        id="plan-popular"
                        checked={newPlan.popular}
                        onCheckedChange={(checked) => setNewPlan({ ...newPlan, popular: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreatePlan} disabled={createPlan.isPending}>
                      {createPlan.isPending ? "Criando..." : "Criar Plano"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Assinaturas Ativas</CardTitle>
                <CardDescription>Todas as assinaturas da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Próxima cobrança</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.client}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[sub.status]}>{sub.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{sub.startDate}</TableCell>
                        <TableCell className="text-muted-foreground">{sub.nextBilling}</TableCell>
                        <TableCell className="text-right font-medium">
                          {sub.amount > 0 ? `R$ ${sub.amount}` : '-'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Alterar plano</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Plano: {selectedPlan?.name}</DialogTitle>
              <DialogDescription>
                Modifique os detalhes do plano
              </DialogDescription>
            </DialogHeader>
            {selectedPlan && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nome do plano</Label>
                  <Input
                    id="edit-name"
                    value={editPlanData.name ?? selectedPlan.name}
                    onChange={(e) => setEditPlanData({ ...editPlanData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={editPlanData.description ?? selectedPlan.description}
                    onChange={(e) => setEditPlanData({ ...editPlanData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Preço (R$)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editPlanData.price ?? selectedPlan.price}
                      onChange={(e) => setEditPlanData({ ...editPlanData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-period">Período</Label>
                    <Input
                      id="edit-period"
                      value={editPlanData.billingPeriod ?? selectedPlan.billingPeriod}
                      onChange={(e) => setEditPlanData({ ...editPlanData, billingPeriod: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-popular">Plano popular</Label>
                  <Switch
                    id="edit-popular"
                    checked={editPlanData.popular ?? selectedPlan.popular}
                    onCheckedChange={(checked) => setEditPlanData({ ...editPlanData, popular: checked })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdatePlan} disabled={updatePlan.isPending}>
                {updatePlan.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
