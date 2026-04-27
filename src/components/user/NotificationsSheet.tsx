import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUserNotifications, type UserNotification, type NotificationSeverity } from "@/features/dashboard/hooks/use-user-notifications";

const SEVERITY_CONFIG: Record<NotificationSeverity, {
  icon: typeof AlertCircle;
  iconClass: string;
  dotClass: string;
  bgClass: string;
  borderClass: string;
}> = {
  error: {
    icon: AlertCircle,
    iconClass: "text-red-500",
    dotClass: "bg-red-500",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800/50",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800/50",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    dotClass: "bg-blue-500",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800/50",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    dotClass: "bg-emerald-500",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800/50",
  },
};

const BADGE_COLOR: Record<NotificationSeverity, string> = {
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  success: "bg-emerald-500",
};

function NotificationCard({
  notification,
  isRead,
  onRead,
}: {
  notification: UserNotification;
  isRead: boolean;
  onRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const cfg = SEVERITY_CONFIG[notification.severity];
  const Icon = cfg.icon;

  const handleAction = () => {
    onRead(notification.id);
    if (notification.action) navigate(notification.action.href);
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 transition-all",
        cfg.bgClass,
        cfg.borderClass,
        isRead && "opacity-60"
      )}
    >
      <div className="flex gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          "bg-white/70 dark:bg-white/10"
        )}>
          <Icon className={cn("w-4 h-4", cfg.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
              {notification.title}
            </p>
            {!isRead && (
              <span className={cn("w-2 h-2 rounded-full shrink-0 mt-1", cfg.dotClass)} />
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
            {notification.body}
          </p>
          {notification.action && (
            <button
              onClick={handleAction}
              className={cn(
                "mt-2 text-xs font-semibold underline-offset-2 hover:underline transition-colors",
                cfg.iconClass
              )}
            >
              {notification.action.label} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsSheet() {
  const { notifications, readIds, unreadCount, isLoading, markRead, markAllRead } = useUserNotifications();

  // Badge color based on most severe unread notification
  const topSeverity: NotificationSeverity = notifications
    .filter((n) => !readIds.includes(n.id))
    .reduce<NotificationSeverity | null>((acc, n) => {
      const order: NotificationSeverity[] = ["error", "warning", "info", "success"];
      if (!acc) return n.severity;
      return order.indexOf(n.severity) < order.indexOf(acc) ? n.severity : acc;
    }, null) ?? "info";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-[#1a3799]/8 hover:bg-[#1a3799]/12 text-[#1a3799]"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 fill-[#1a3799] text-[#1a3799]" />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full text-[10px] font-bold text-white leading-none px-1",
              BADGE_COLOR[topSeverity]
            )}>
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l overflow-x-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg font-semibold">Notificações</SheetTitle>
            {unreadCount > 0 && (
              <span className={cn(
                "flex min-w-[20px] h-5 items-center justify-center rounded-full text-[10px] font-bold text-white px-1.5",
                BADGE_COLOR[topSeverity]
              )}>
                {unreadCount}
              </span>
            )}
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todas
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Nenhuma notificação</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Você está em dia com tudo!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Unread first */}
              {notifications
                .slice()
                .sort((a, b) => {
                  const aRead = readIds.includes(a.id);
                  const bRead = readIds.includes(b.id);
                  if (aRead !== bRead) return aRead ? 1 : -1;
                  const order: NotificationSeverity[] = ["error", "warning", "info", "success"];
                  return order.indexOf(a.severity) - order.indexOf(b.severity);
                })
                .map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    isRead={readIds.includes(n.id)}
                    onRead={markRead}
                  />
                ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
