import { useCallback } from "react";
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUserNotifications } from "@/features/dashboard/hooks/use-user-notifications";
import { useAuth } from "@/contexts/AuthContext";

const severityConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", label: "Informação" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", label: "Aviso" },
  error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Erro" },
  success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Sucesso" },
};

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, readIds, unreadCount, isLoading, markRead, markAllRead } = useUserNotifications();

  const handleMarkRead = useCallback((id: string) => {
    markRead(id);
  }, [markRead]);

  if (!user) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Faça login para ver notificações</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount !== 1 ? "ões" : ""} não lida${unreadCount !== 1 ? "s" : ""}`
              : "Todas as notificações foram lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
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
            <p className="text-sm text-muted-foreground">Quando houver novidades, elas aparecerão aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = severityConfig[notification.severity] ?? severityConfig.info;
            const Icon = config.icon;
            const isRead = readIds.includes(notification.id);

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
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!isRead && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0 bg-primary" />
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {notification.body}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleDateString("pt-BR", {
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
                          onClick={() => handleMarkRead(notification.id)}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {notification.action && (
                    <>
                      <Separator className="my-3" />
                      <Button variant="outline" size="sm" asChild>
                        <a href={notification.action.href} target="_blank" rel="noopener noreferrer">
                          {notification.action.label}
                        </a>
                      </Button>
                    </>
                  )}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
