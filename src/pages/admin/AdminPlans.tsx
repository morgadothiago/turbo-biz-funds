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
  TrendingUp
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
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

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Para começar a organizar suas finanças",
    price: 0,
    billingPeriod: "mês",
    subscribers: 89,
    mrr: 0,
    icon: Sparkles,
    color: "bg-muted",
    features: [
      { name: "Até 100 lançamentos/mês", included: true },
      { name: "1 conta", included: true },
      { name: "Relatórios básicos", included: true },
      { name: "Chat com IA (5 msgs/dia)", included: true },
      { name: "Integração WhatsApp", included: false },
      { name: "Suporte prioritário", included: false },
    ]
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para quem quer mais controle",
    price: 99,
    billingPeriod: "mês",
    subscribers: 98,
    mrr: 9702,
    icon: Zap,
    color: "bg-primary/10",
    popular: true,
    features: [
      { name: "Lançamentos ilimitados", included: true },
      { name: "Até 3 contas", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Chat com IA ilimitado", included: true },
      { name: "Integração WhatsApp", included: true },
      { name: "Suporte prioritário", included: false },
    ]
  },
  {
    id: "business",
    name: "Business",
    description: "Para famílias e pequenos grupos",
    price: 249,
    billingPeriod: "mês",
    subscribers: 47,
    mrr: 11703,
    icon: Crown,
    color: "bg-success/10",
    features: [
      { name: "Tudo do Pro", included: true },
      { name: "Contas ilimitadas", included: true },
      { name: "Usuários ilimitados", included: true },
      { name: "API personalizada", included: true },
      { name: "White-label", included: true },
      { name: "Suporte prioritário 24/7", included: true },
    ]
  }
];

const subscriptions = [
  { id: "1", client: "João Silva", plan: "Pro", status: "Ativo", startDate: "10/01/2025", nextBilling: "10/02/2025", amount: 99 },
  { id: "2", client: "Maria Santos", plan: "Business", status: "Ativo", startDate: "15/01/2025", nextBilling: "15/02/2025", amount: 249 },
  { id: "3", client: "Pedro Costa", plan: "Free", status: "Trial", startDate: "20/01/2025", nextBilling: "-", amount: 0 },
  { id: "4", client: "Ana Oliveira", plan: "Pro", status: "Ativo", startDate: "05/01/2025", nextBilling: "05/02/2025", amount: 99 },
  { id: "5", client: "Carlos Mendes", plan: "Business", status: "Inadimplente", startDate: "12/01/2025", nextBilling: "12/02/2025", amount: 249 },
  { id: "6", client: "Fernanda Lima", plan: "Pro", status: "Ativo", startDate: "18/01/2025", nextBilling: "18/02/2025", amount: 99 },
];

const statusColors: Record<string, string> = {
  Ativo: "bg-success/10 text-success",
  Trial: "bg-warning/10 text-warning",
  Inadimplente: "bg-destructive/10 text-destructive",
  Cancelado: "bg-muted text-muted-foreground",
};

export default function AdminPlans() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const totalMRR = plans.reduce((sum, plan) => sum + plan.mrr, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);

  const openEditDialog = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader 
        title="Gestão de Planos" 
        subtitle="Configure planos e gerencie assinaturas"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
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
                  <div className="text-2xl font-bold">R$ {(totalMRR / totalSubscribers).toFixed(0)}</div>
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
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${plan.color}`}>
                        <plan.icon className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(plan)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Desativar
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
              ))}
            </div>

            <div className="flex justify-center">
              <Dialog>
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
                      <Input id="plan-name" placeholder="Ex: Enterprise" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="plan-description">Descrição</Label>
                      <Textarea id="plan-description" placeholder="Descreva o plano..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="plan-price">Preço (R$)</Label>
                        <Input id="plan-price" type="number" placeholder="0" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="plan-period">Período</Label>
                        <Input id="plan-period" placeholder="mês" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="plan-active">Plano ativo</Label>
                      <Switch id="plan-active" defaultChecked />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button>Criar Plano</Button>
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
                  <Input id="edit-name" defaultValue={selectedPlan.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea id="edit-description" defaultValue={selectedPlan.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Preço (R$)</Label>
                    <Input id="edit-price" type="number" defaultValue={selectedPlan.price} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-period">Período</Label>
                    <Input id="edit-period" defaultValue={selectedPlan.billingPeriod} />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => setIsEditDialogOpen(false)}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
