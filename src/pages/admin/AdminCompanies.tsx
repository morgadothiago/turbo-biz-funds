import { useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Building2,
  Users,
  CreditCard,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const mockCompanies = [
  { 
    id: "1", 
    name: "Tech Solutions LTDA", 
    cnpj: "12.345.678/0001-90",
    email: "contato@techsolutions.com", 
    plan: "Pro", 
    status: "Ativo",
    users: 12,
    mrr: 199,
    usage: 78,
    createdAt: "10/01/2025",
    owner: "João Silva"
  },
  { 
    id: "2", 
    name: "Inovação Digital ME", 
    cnpj: "98.765.432/0001-10",
    email: "admin@inovdigital.com", 
    plan: "Business", 
    status: "Ativo",
    users: 25,
    mrr: 499,
    usage: 92,
    createdAt: "15/01/2025",
    owner: "Maria Santos"
  },
  { 
    id: "3", 
    name: "Startup Hub", 
    cnpj: "11.222.333/0001-44",
    email: "hello@startuphub.io", 
    plan: "Free", 
    status: "Trial",
    users: 3,
    mrr: 0,
    usage: 45,
    createdAt: "20/01/2025",
    owner: "Pedro Costa"
  },
  { 
    id: "4", 
    name: "Finance Corp", 
    cnpj: "55.666.777/0001-88",
    email: "suporte@financecorp.com", 
    plan: "Pro", 
    status: "Ativo",
    users: 8,
    mrr: 199,
    usage: 65,
    createdAt: "05/01/2025",
    owner: "Ana Oliveira"
  },
  { 
    id: "5", 
    name: "E-commerce Plus", 
    cnpj: "33.444.555/0001-22",
    email: "vendas@ecommerceplus.com", 
    plan: "Business", 
    status: "Inadimplente",
    users: 18,
    mrr: 499,
    usage: 88,
    createdAt: "12/01/2025",
    owner: "Carlos Mendes"
  },
  { 
    id: "6", 
    name: "Digital Marketing Co", 
    cnpj: "77.888.999/0001-55",
    email: "contato@digitalmkt.com", 
    plan: "Pro", 
    status: "Ativo",
    users: 6,
    mrr: 199,
    usage: 52,
    createdAt: "18/01/2025",
    owner: "Fernanda Lima"
  },
];

const planColors: Record<string, string> = {
  Free: "bg-muted text-muted-foreground",
  Pro: "bg-primary/10 text-primary",
  Business: "bg-success/10 text-success",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-success/10 text-success",
  Trial: "bg-warning/10 text-warning",
  Inadimplente: "bg-destructive/10 text-destructive",
  Cancelado: "bg-muted text-muted-foreground",
};

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.cnpj.includes(searchTerm);
    const matchesPlan = selectedPlan === "all" || company.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const toggleAllCompanies = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(c => c.id));
    }
  };

  const totalMRR = filteredCompanies.reduce((sum, c) => sum + c.mrr, 0);
  const totalUsers = filteredCompanies.reduce((sum, c) => sum + c.users, 0);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader 
        title="Gestão de Empresas" 
        subtitle="Gerencie todas as empresas cadastradas"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-sm text-muted-foreground">Total de empresas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">198</div>
                  <p className="text-sm text-muted-foreground">Empresas ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-sm text-muted-foreground">Total de usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">12</div>
                  <p className="text-sm text-muted-foreground">Inadimplentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-[150px]">
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
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Inadimplente">Inadimplente</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                      onCheckedChange={toggleAllCompanies}
                    />
                  </TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedCompanies.includes(company.id)}
                        onCheckedChange={() => toggleCompanySelection(company.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {company.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.cnpj}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={planColors[company.plan]}>
                        {company.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[company.status]}>
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.users}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {company.mrr > 0 ? `R$ ${company.mrr}` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={company.usage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{company.usage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{company.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Alterar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredCompanies.length} de {mockCompanies.length} empresas
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
