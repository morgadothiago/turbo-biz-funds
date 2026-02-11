import { Bell, Check, CreditCard, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Pagamento aprovado",
    message: "Sua fatura de R$ 299,00 foi paga com sucesso",
    time: "5 min",
    read: false,
    icon: CreditCard,
  },
  {
    id: 2,
    type: "user",
    title: "Novo usuário cadastrado",
    message: "João Silva se registrou no plano Pro",
    time: "1 hora",
    read: false,
    icon: User,
  },
  {
    id: 3,
    type: "alert",
    title: "Meta alcançada",
    message: "Você atingiu 80% da meta de economia do mês!",
    time: "3 horas",
    read: true,
    icon: AlertCircle,
  },
  {
    id: 4,
    type: "payment",
    title: "Pagamento recebido",
    message: "R$ 1.500,00 foi adicionado ao seu saldo",
    time: "1 dia",
    read: true,
    icon: CreditCard,
  },
];

const typeStyles = {
  payment: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-500",
  },
  user: {
    bg: "bg-blue-500/10",
    icon: "text-blue-500",
  },
  alert: {
    bg: "bg-amber-500/10",
    icon: "text-amber-500",
  },
};

export function NotificationsSheet() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 hover:bg-accent"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l overflow-x-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0 min-w-0">
          <div className="min-w-0">
            <SheetTitle className="text-lg font-semibold truncate">Notificações</SheetTitle>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 shrink-0 ml-2"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Marcar todas</span>
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="divide-y divide-border/50 min-w-0">
            {notifications.map((notification) => {
              const styles = typeStyles[notification.type as keyof typeof typeStyles];
              return (
                <div
                  key={notification.id}
                  className={`group p-4 hover:bg-accent/50 transition-all duration-200 cursor-pointer ${
                    !notification.read ? "bg-accent/30" : ""
                  }`}
                >
                  <div className="flex gap-3.5">
                    <div
                      className={`mt-0.5 h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        styles.bg
                      }`}
                    >
                      <notification.icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${styles.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <p className={`text-sm font-medium truncate min-w-0 ${!notification.read ? "" : "text-muted-foreground"}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Você está em dia com tudo!
              </p>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t bg-muted/30 shrink-0">
          <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm">
            Ver todas as notificações
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
