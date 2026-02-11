import { memo } from "react";
import { Settings, User, Bell, Shield, Moon, Globe, CreditCard, Smartphone, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const SettingsPage = memo(() => {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e dados</p>
      </div>

      {/* Profile Section */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Perfil</h3>
              <p className="text-sm text-muted-foreground">Suas informações pessoais</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="space-y-2">
              <Label className="text-foreground">Nome</Label>
              <div className="p-3 rounded-lg bg-accent border border-input text-foreground">João Silva</div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <div className="p-3 rounded-lg bg-accent border border-input text-foreground">joao@email.com</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="hover:bg-accent"
            onClick={() => toast.info("Em breve: editar perfil")}
          >
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notificações</h3>
              <p className="text-sm text-muted-foreground">Configure como deseja receber alertas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Receba resumos diários</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Vencimentos</p>
                  <p className="text-sm text-muted-foreground">Alertas de contas a pagar</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">Relatórios semanais</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Preferências</h3>
              <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Moon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Tema escuro padrão</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Globe className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Idioma</p>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => toast.info("Em breve: mudar idioma")}
              >
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Segurança</h3>
              <p className="text-sm text-muted-foreground">Proteja sua conta</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-accent"
              onClick={() => toast.info("Em breve: alterar senha")}
            >
              <span className="text-foreground">Alterar Senha</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400"
              onClick={() => toast.info("Em breve: excluir conta")}
            >
              <span>Excluir Conta</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

SettingsPage.displayName = "SettingsPage";

export default SettingsPage;
