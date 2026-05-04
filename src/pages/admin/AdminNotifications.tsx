import { 
  Bell, CheckCheck, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAdminNotifications, type AdminNotification } from "@/features/admin/hooks/use-admin-notifications";

const severityConfig = {
  signup: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", label: "Novo Cadastro" },
  payment: { icon: AlertCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Pagamento" },
  upgrade: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", label: "Upgrade" },
  support: { icon: Bell, color: "text-violet-500", bg: "bg-violet-500/10", label: "Suporte" },
};

export default function AdminNotifications() {
  const { notifications, isLoading, markRead, markAllRead } = useAdminNotifications();

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notificações Admin
          </h1>
          <p className="text-muted-foreground text-sm">
            {notifications.filter(n => !n.read).length > 0
              ? `Você tem ${notifications.filter(n => !n.read).length} não lida${notifications.filter(n => !n.read).length !== 1 ? "s" : ""}`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
        {notifications.filter(n => !n.read).length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhuma notificação</p>
            <p className="text-sm text-muted-foreground">Aqui aparecerão notificações de novos cadastros, pagamentos e upgrades.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: AdminNotification) => {
            const config = severityConfig[notification.type] ?? severityConfig.support;
            const Icon = config.icon;
            const isRead = notification.read;

            return (
              <Card
                key={notification.id}
                className={`transition-all ${isRead ? "opacity-60" : "border-primary/20 shadow-sm"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{config.label}</CardTitle>
                          {!isRead && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0 bg-primary" />
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {notification.message}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.time).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markRead(notification.id)}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
