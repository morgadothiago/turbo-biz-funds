import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/UserSidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return { title: "Dashboard", subtitle: "Visão geral" };
    if (path.includes("/dashboard/transacoes"))
      return { title: "Transações", subtitle: "Seus registros" };
    if (path.includes("/dashboard/categorias"))
      return { title: "Categorias", subtitle: "Organize seus gastos" };
    if (path.includes("/dashboard/metas"))
      return { title: "Metas", subtitle: "Suas economias" };
    if (path.includes("/dashboard/cartoes"))
      return { title: "Cartões", subtitle: "Seus cartões" };
    if (path.includes("/dashboard/whatsapp"))
      return { title: "WhatsApp", subtitle: "Conexão" };
    if (path.includes("/dashboard/configuracoes"))
      return { title: "Configurações", subtitle: "Sua conta" };
    return { title: "OrganizaAI", subtitle: "" };
  };

  const page = getPageTitle();
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-foreground truncate">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xs text-muted-foreground truncate">{page.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3 pl-3 border-l border-border/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-32">
              {user?.name || "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-32">
              {user?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
