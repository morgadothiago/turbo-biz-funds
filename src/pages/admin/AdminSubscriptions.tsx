import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Pause,
  Play,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockSubscriptions = [
  {
    id: "sub_1",
    user: { name: "João Silva", email: "joao.silva@email.com", avatar: "JS" },
    plan: "Pro",
    amount: 29.90,
    interval: "mensal",
    status: "ativa",
    startDate: "10/01/2025",
    nextBilling: "10/02/2025",
    paymentMethod: "Cartão ****4242",
    autoRenew: true
  },
  {
    id: "sub_2",
    user: { name: "Maria Santos", email: "maria.santos@email.com", avatar: "MS" },
    plan: "Business",
    amount: 99.90,
    interval: "mensal",
    status: "ativa",
    startDate: "15/01/2025",
    nextBilling: "15/02/2025",
    paymentMethod: "Pix",
    autoRenew: true
  },
  {
    id: "sub_3",
    user: { name: "Pedro Costa", email: "pedro.costa@email.com", avatar: "PC" },
    plan: "Pro",
    amount: 29.90,
    interval: "mensal",
    status: "cancelada",
    startDate: "20/12/2024",
    nextBilling: "-",
    paymentMethod: "Cartão ****1234",
    autoRenew: false
  },
  {
    id: "sub_4",
    user: { name: "Ana Oliveira", email: "ana.oliveira@email.com", avatar: "AO" },
    plan: "Business",
    amount: 99.90,
    interval: "mensal",
    status: "trial",
    startDate: "05/02/2025",
    nextBilling: "12/02/2025",
    paymentMethod: "Cartão ****5678",
    autoRenew: true
  },
  {
    id: "sub_5",
    user: { name: "Carlos Mendes", email: "carlos.mendes@email.com", avatar: "CM" },
    plan: "Free",
    amount: 0,
    interval: "-",
    status: "inativa",
    startDate: "12/01/2025",
    nextBilling: "-",
    paymentMethod: "-",
    autoRenew: false
  },
  {
    id: "sub_6",
    user: { name: "Fernanda Lima", email: "fernanda.lima@email.com", avatar: "FL" },
    plan: "Pro",
    amount: 29.90,
    interval: "mensal",
    status: "atrasada",
    startDate: "18/01/2025",
    nextBilling: "18/01/2025",
    paymentMethod: "Cartão ****9012",
    autoRenew: true
  },
];

const totalRevenue = mockSubscriptions
  .filter(s => s.status === "ativa" && s.amount > 0)
  .reduce((acc, s) => acc + s.amount, 0);

const statusConfig = {
  ativa: { label: "Ativa", color: "emerald", bg: "emerald-500/10", border: "emerald-200", icon: CheckCircle },
  cancelada: { label: "Cancelada", color: "slate", bg: "slate-500/10", border: "slate-200", icon: XCircle },
  trial: { label: "Trial", color: "blue", bg: "blue-500/10", border: "blue-200", icon: RefreshCw },
  inativa: { label: "Inativa", color: "slate", bg: "slate-500/10", border: "slate-200", icon: Pause },
  atrasada: { label: "Atrasada", color: "red", bg: "red-500/10", border: "red-200", icon: AlertCircle },
};

export default function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesSearch = sub.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || sub.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || sub.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Assinaturas"
        subtitle="Gerencie as assinaturas da plataforma"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <p className="text-xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-xl font-bold">{mockSubscriptions.filter(s => s.status === "ativa").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Trial</p>
                  <p className="text-xl font-bold">{mockSubscriptions.filter(s => s.status === "trial").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atrasadas</p>
                  <p className="text-xl font-bold text-red-500">{mockSubscriptions.filter(s => s.status === "atrasada").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-muted/50 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Plano</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Valor</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Próxima cobrança</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => {
                const status = statusConfig[sub.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <TableRow key={sub.id} className="border-muted/50 hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                            {sub.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{sub.user.name}</p>
                          <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          sub.plan === "Business"
                            ? "bg-violet-500/10 text-violet-600 border-violet-200"
                            : sub.plan === "Pro"
                            ? "bg-blue-500/10 text-blue-600 border-blue-200"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {sub.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {sub.amount > 0 ? `R$ ${sub.amount.toFixed(2)}` : "Gratuito"}
                      </span>
                      {sub.amount > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">/mês</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`bg-${status.bg} text-${status.color} border-${status.border}`}
                      >
                        <StatusIcon className={`h-3 w-3 mr-1.5`} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{sub.nextBilling}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Alterar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Renovar manualmente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {sub.status === "ativa" && (
                            <DropdownMenuItem className="text-amber-500">
                              <Pause className="h-4 w-4 mr-2" />
                              Pausar
                            </DropdownMenuItem>
                          )}
                          {sub.status === "pausada" && (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Reativar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t border-muted/50">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredSubscriptions.length} de {mockSubscriptions.length} assinaturas
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
