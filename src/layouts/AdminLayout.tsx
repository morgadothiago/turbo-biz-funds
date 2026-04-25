import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebarContent, AdminMobileTrigger } from "@/components/admin/AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ADMIN_PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Visão geral da plataforma" },
  "/admin/clientes": { title: "Clientes", subtitle: "Gerencie os clientes" },
  "/admin/assinaturas": { title: "Assinaturas", subtitle: "Gerencie as assinaturas" },
  "/admin/planos": { title: "Planos", subtitle: "Configure os planos" },
  "/admin/notificacoes": { title: "Notificações", subtitle: "" },
  "/admin/configuracoes": { title: "Configurações", subtitle: "" },
  "/admin/suporte": { title: "Suporte", subtitle: "" },
};

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

function AdminHeaderLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const page = ADMIN_PAGE_TITLES[location.pathname] ?? { title: "Admin", subtitle: "" };

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
    <header className="rounded-2xl bg-white flex items-center justify-between px-4 py-3 gap-4 shadow-sm shrink-0">
      {/* Left: mobile trigger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="lg:hidden shrink-0">
          <AdminMobileTrigger />
        </div>
        <div className="min-w-0">
          <h1 className="text-[15px] font-bold text-gray-900 truncate leading-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xs text-gray-400 truncate leading-tight mt-0.5 hidden sm:block">
              {page.subtitle}
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
    </header>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider className="block">
      <div
        className="h-screen flex p-3 gap-3 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 80% 80% at 90% 70%, #2b00ff 0%, #08086e 30%, #06091c 62%)" }}
      >
        {/* Desktop sidebar flutuante */}
        <aside className="hidden lg:flex w-[260px] shrink-0">
          <AdminSidebarContent />
        </aside>

        {/* Coluna direita */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
          <AdminHeaderLayout />

          {/* Card branco principal com scroll */}
          <div className="flex-1 min-h-0 overflow-auto rounded-2xl bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
