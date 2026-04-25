import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminMobileTrigger } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NOTIFICATION_COUNT = 0;

function AdminNotificationsSheet() {
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
          {NOTIFICATION_COUNT > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white leading-none px-1">
              {NOTIFICATION_COUNT}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l overflow-x-hidden"
      >
        <div className="flex items-center p-4 border-b shrink-0">
          <SheetTitle className="text-lg font-semibold">Notificações</SheetTitle>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Nenhuma notificação</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Você está em dia com tudo!</p>
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
