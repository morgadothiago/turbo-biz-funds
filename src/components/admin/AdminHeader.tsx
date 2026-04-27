import { Bell, UserPlus, CreditCard, TrendingUp, Headphones, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdminMobileTrigger } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNotifications, type AdminNotification } from "@/features/admin/hooks/use-admin-notifications";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TYPE_CONFIG: Record<string, { icon: typeof UserPlus; color: string; bg: string }> = {
  signup:  { icon: UserPlus,    color: "text-blue-600",   bg: "bg-blue-50" },
  payment: { icon: CreditCard,  color: "text-green-600",  bg: "bg-green-50" },
  upgrade: { icon: TrendingUp,  color: "text-violet-600", bg: "bg-violet-50" },
  support: { icon: Headphones,  color: "text-amber-600",  bg: "bg-amber-50" },
};

function NotificationItem({ notification }: { notification: AdminNotification }) {
  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.signup;
  const Icon = cfg.icon;

  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors",
      !notification.read && "bg-blue-50/40"
    )}>
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
        <Icon className={cn("w-4 h-4", cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
      )}
    </div>
  );
}

function AdminNotificationsSheet() {
  const { notifications, unreadCount, markAllRead } = useAdminNotifications();

  return (
    <Sheet onOpenChange={(open) => open && unreadCount > 0 && markAllRead()}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-[#1a3799]/8 hover:bg-[#1a3799]/12 text-[#1a3799]"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 fill-[#1a3799] text-[#1a3799]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white leading-none px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm flex flex-col p-0 bg-background border-l overflow-x-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base font-semibold">Notificações</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground gap-1"
              onClick={markAllRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Nenhuma notificação</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Você está em dia com tudo!</p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user?.name) return "AD";
    return user.name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="bg-[#1a3799] px-3 py-2.5 sticky top-0 z-30">
      <div className="bg-white rounded-2xl flex items-center justify-between px-4 py-3 gap-4 shadow-sm">
        {/* Left: mobile trigger + page title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="lg:hidden shrink-0">
            <AdminMobileTrigger />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-gray-900 truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-400 truncate leading-tight mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: notifications + user info */}
        <div className="flex items-center gap-3 shrink-0">
          <AdminNotificationsSheet />

          <div className="w-px h-8 bg-gray-200" />

          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-[#1a3799] text-white text-sm font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight max-w-32">
                {user?.name || "Admin"}
              </p>
              <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5 max-w-32">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
