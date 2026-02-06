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
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e dados</p>
      </div>

      {/* Profile Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Perfil</h3>
              <p className="text-sm text-gray-500">Suas informações pessoais</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Nome</Label>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900">João Silva</div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900">joao@email.com</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => toast.info("Em breve: editar perfil")}
          >
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              <p className="text-sm text-gray-500">Configure como deseja receber alertas</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Receba resumos diários</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#25D366]" />
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vencimentos</p>
                  <p className="text-sm text-gray-500">Alertas de contas a pagar</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#25D366]" />
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">Relatórios semanais</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-[#25D366]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Preferências</h3>
              <p className="text-sm text-gray-500">Personalize sua experiência</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Modo Escuro</p>
                  <p className="text-sm text-gray-500">Tema escuro padrão</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#25D366]" />
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Idioma</p>
                  <p className="text-sm text-gray-500">Português (Brasil)</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#25D366] hover:text-[#128C7E] hover:bg-[#25D366]/10"
                onClick={() => toast.info("Em breve: mudar idioma")}
              >
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Segurança</h3>
              <p className="text-sm text-gray-500">Proteja sua conta</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-between"
              onClick={() => toast.info("Em breve: alterar senha")}
            >
              <span>Alterar Senha</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 justify-between"
              onClick={() => toast.info("Em breve: excluir conta")}
            >
              <span>Excluir Conta</span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

SettingsPage.displayName = "SettingsPage";

export default SettingsPage;
