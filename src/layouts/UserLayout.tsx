import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/UserSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsSheet } from "@/components/user/NotificationsSheet";
import { useState, useEffect, useRef } from "react";

const useScrollDirection = () => {
  const [hideBalloon, setHideBalloon] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideBalloon(true);
      } else {
        setHideBalloon(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hideBalloon;
};

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Visão geral das suas finanças" },
  "/dashboard/transacoes": { title: "Transações", subtitle: "Suas movimentações" },
  "/dashboard/categorias": { title: "Categorias", subtitle: "Organize seus gastos" },
  "/dashboard/metas": { title: "Metas", subtitle: "Acompanhe seus objetivos" },
  "/dashboard/cartoes": { title: "Cartões", subtitle: "Seus cartões de crédito" },
  "/dashboard/whatsapp": { title: "WhatsApp", subtitle: "Integração via mensagem" },
  "/dashboard/configuracoes": { title: "Configurações", subtitle: "Sua conta" },
};

function Header() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();

  const page = PAGE_TITLES[location.pathname] ?? { title: "doutorcash", subtitle: "" };

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
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-5 sticky top-0 z-40 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-foreground truncate leading-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xs text-muted-foreground/70 truncate leading-tight hidden sm:block">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsSheet />

        <div className="flex items-center gap-2.5 pl-2.5 border-l border-border">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate max-w-28 leading-tight">
              {user?.name || "Usuário"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate max-w-28 leading-tight">
              {user?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout() {
  const hideBalloon = useScrollDirection();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar />
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header />
          <div className="flex-1 overflow-auto scrollbar-thin">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        <div className={`bg-white text-gray-800 px-3.5 py-2 rounded-xl shadow-md text-sm font-medium whitespace-nowrap border border-gray-100 transition-all duration-200 ${hideBalloon ? "opacity-0 translate-y-1 pointer-events-none" : "opacity-100 translate-y-0"}`}>
          Como posso ajudar?
        </div>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="p-0.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          aria-label="Falar no WhatsApp"
        >
          <img src="/whatsapp.png" alt="WhatsApp" className="w-11 h-11" />
        </a>
      </div>
    </SidebarProvider>
  );
}
