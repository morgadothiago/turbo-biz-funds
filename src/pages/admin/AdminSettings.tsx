import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, Bell, Shield, Moon, Sun, Crown, LogOut, Check, X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/theme-provider";

export default function AdminSettings() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada");
    window.location.href = "/login";
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Configurações do Admin
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua conta e preferências da plataforma
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Perfil do Administrador</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-[#1a3799] text-white text-xl font-bold">
                    {user?.name?.substring(0, 2).toUpperCase() ?? "AD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name ?? "Admin"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
                  <Badge variant="secondary" className="mt-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrador
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Nome</Label>
                  <Input
                    id="admin-name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">E-mail</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Telefone</Label>
                  <Input
                    id="admin-phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Altere sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button 
                onClick={async () => {
                  const current = (document.getElementById("current-password") as HTMLInputElement)?.value;
                  const newPass = (document.getElementById("new-password") as HTMLInputElement)?.value;
                  const confirm = (document.getElementById("confirm-password") as HTMLInputElement)?.value;
                  
                  if (!current || !newPass || !confirm) {
                    toast.error("Preencha todos os campos");
                    return;
                  }
                  if (newPass !== confirm) {
                    toast.error("Novas senhas não coincidem");
                    return;
                  }
                  try {
                    await changePassword({ currentPassword: current, newPassword: newPass });
                    toast.success("Senha alterada com sucesso!");
                    (document.getElementById("current-password") as HTMLInputElement).value = "";
                    (document.getElementById("new-password") as HTMLInputElement).value = "";
                    (document.getElementById("confirm-password") as HTMLInputElement).value = "";
                  } catch {
                    toast.error("Erro ao alterar senha");
                  }
                }}
              >
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          {/* Theme */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {isDark ? "Modo escuro ativo" : "Modo claro ativo"}
                    </p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Notificações do Sistema</CardTitle>
              <CardDescription>
                Configure notificações administrativas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Novos Cadastros</p>
                    <p className="text-xs text-muted-foreground">Notificar quando novos usuários se cadastrarem</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Pagamentos</p>
                    <p className="text-xs text-muted-foreground">Notificar sobre pagamentos e upgrades</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Alertas de Segurança</p>
                    <p className="text-xs text-muted-foreground">Notificar sobre atividades suspeitas</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-sm border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis da conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sair da Conta</p>
                  <p className="text-xs text-muted-foreground">Encerrar sessão atual</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
