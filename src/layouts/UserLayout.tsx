import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/UserSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Mapear rotas para títulos
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/dashboard/transacoes")) return "Transações";
    if (path.includes("/dashboard/categorias")) return "Categorias";
    if (path.includes("/dashboard/metas")) return "Metas";
    if (path.includes("/dashboard/cartoes")) return "Cartões";
    if (path.includes("/dashboard/whatsapp")) return "WhatsApp";
    if (path.includes("/dashboard/configuracoes")) return "Configurações";
    return "OrganizaAI";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#25D366]/10 text-[#25D366] text-sm font-medium">
              {user?.name?.split(" ").map(n => n[0] || "").join("").substring(0, 2) || "US"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || "Usuário"}</p>
            <p className="text-xs text-gray-500">{user?.email || "-"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F6F4EF]">
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
