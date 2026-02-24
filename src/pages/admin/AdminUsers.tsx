import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  Ban,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  X
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
import { AdminUsersSkeleton } from "@/components/ui/admin-skeletons";

const mockUsers = [
  { id: "1", name: "João Silva", email: "joao.silva@email.com", plan: "Pro", status: "Ativo", lastLogin: "5 min", createdAt: "10/01/2025" },
  { id: "2", name: "Maria Santos", email: "maria.santos@email.com", plan: "Business", status: "Ativo", lastLogin: "1 hora", createdAt: "15/01/2025" },
  { id: "3", name: "Pedro Costa", email: "pedro.costa@email.com", plan: "Free", status: "Pendente", lastLogin: "2 dias", createdAt: "20/01/2025" },
  { id: "4", name: "Ana Oliveira", email: "ana.oliveira@email.com", plan: "Pro", status: "Ativo", lastLogin: "30 min", createdAt: "05/01/2025" },
  { id: "5", name: "Carlos Mendes", email: "carlos.mendes@email.com", plan: "Free", status: "Bloqueado", lastLogin: "1 semana", createdAt: "12/01/2025" },
  { id: "6", name: "Fernanda Lima", email: "fernanda.lima@email.com", plan: "Business", status: "Ativo", lastLogin: "Hoje", createdAt: "18/01/2025" },
  { id: "7", name: "Roberto Alves", email: "roberto.alves@email.com", plan: "Pro", status: "Ativo", lastLogin: "3 horas", createdAt: "08/01/2025" },
  { id: "8", name: "Juliana Reis", email: "juliana.reis@email.com", plan: "Free", status: "Ativo", lastLogin: "Ontem", createdAt: "22/01/2025" },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || user.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPlan("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchTerm || selectedPlan !== "all" || selectedStatus !== "all";

  return (
    <div className="flex flex-col h-full">
      <AdminHeader 
        title="Clientes" 
        subtitle="Gerencie os clientes da plataforma"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading ? (
          <AdminUsersSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">1.429</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-emerald-500">1.256</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-amber-500">145</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-card/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Bloqueados</p>
                  <p className="text-2xl font-bold text-red-500">28</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                      aria-label="Buscar clientes"
                    />
                  </div>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger className="w-[140px]" aria-label="Filtrar por plano">
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
                    <SelectTrigger className="w-[140px]" aria-label="Filtrar por status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearFilters}
                      aria-label="Limpar filtros"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {filteredUsers.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {hasActiveFilters
                      ? "Tente ajustar os filtros de busca"
                      : "Ainda não há clientes cadastrados"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted/50 hover:bg-transparent">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        Cliente
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Plano</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Último acesso</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Criado em</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-muted/50 hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.plan === "Business"
                                ? "bg-violet-500/10 text-violet-600 border-violet-200"
                                : user.plan === "Pro"
                                ? "bg-blue-500/10 text-blue-600 border-blue-200"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.status === "Ativo"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                : user.status === "Pendente"
                                ? "bg-amber-500/10 text-amber-600 border-amber-200"
                                : "bg-red-500/10 text-red-600 border-red-200"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{user.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ações do cliente">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Alterar papel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-amber-500">
                                <Ban className="h-4 w-4 mr-2" />
                                Bloquear
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between p-4 border-t border-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {filteredUsers.length} de {mockUsers.length} clientes
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 bg-muted">1</Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
