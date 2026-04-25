import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  LogOut,
  MessageCircle,
  CreditCard,
  RefreshCw,
  LucideIcon,
  Menu,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  whatsapp?: boolean;
}

const mainMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transações", url: "/dashboard/transacoes", icon: Receipt },
  { title: "Categorias", url: "/dashboard/categorias", icon: PieChart },
  { title: "Metas", url: "/dashboard/metas", icon: Target },
  { title: "Recorrências", url: "/dashboard/recorrencias", icon: RefreshCw },
  { title: "Cartões", url: "/dashboard/cartoes", icon: CreditCard },
];

const integrationItems: MenuItem[] = [
  { title: "WhatsApp", url: "/dashboard/whatsapp", icon: MessageCircle, whatsapp: true },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
];

function NavItem({ item, end = false, onClick }: { item: MenuItem; end?: boolean; onClick?: () => void }) {
  const location = useLocation();
  const isActive = end
    ? location.pathname === item.url
    : location.pathname.startsWith(item.url);
  const Icon = item.icon;

  return (
    <NavLink
      to={item.url}
      end={end}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium",
        item.whatsapp
          ? "bg-[#25D366] text-white hover:bg-[#1da851]"
          : isActive
          ? "bg-white/15 text-white"
          : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
          item.whatsapp
            ? "bg-white/20"
            : isActive
            ? "bg-white/15"
            : "bg-white/10"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <span className="flex-1 truncate">{item.title}</span>
      {isActive && !item.whatsapp && (
        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
      )}
    </NavLink>
  );
}

function SidebarLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 shrink-0">
        <span className="text-white font-black text-base tracking-tight">DC</span>
      </div>
      <div className="leading-tight">
        <p className="text-white font-bold text-base leading-none">Doutor</p>
        <p className="text-white font-bold text-base leading-none">Cash</p>
      </div>
    </div>
  );
}

function UserFooter({ onLogout, user }: { onLogout: () => void; user: { name?: string; email?: string } | null }) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0] || "").join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex items-center gap-3 px-1">
      <Avatar className="h-9 w-9 shrink-0 border-2 border-white/20">
        <AvatarFallback className="bg-white/20 text-white text-sm font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate leading-tight">
          {user?.name || "Usuário"}
        </p>
        <p className="text-white/50 text-xs truncate leading-tight mt-0.5">
          {user?.email || ""}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-white/50 hover:text-white hover:bg-white/10"
        onClick={onLogout}
        aria-label="Sair"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada");
    navigate("/login");
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-[#1a3799] px-4 py-5 gap-0 rounded-3xl">
      {/* Logo */}
      <div className="mb-5">
        <SidebarLogo />
      </div>

      <div className="h-px bg-white/15 mb-5" />

      {/* Menu Principal */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 scrollbar-none">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-1 mb-2">
          Menu Principal
        </p>
        <div className="space-y-1">
          {mainMenuItems.map((item) => (
            <NavItem
              key={item.url}
              item={item}
              end={item.url === "/dashboard"}
              onClick={onClose}
            />
          ))}
        </div>

        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-1 mb-2">
            Integrações
          </p>
          <div className="space-y-1">
            {integrationItems.map((item) => (
              <NavItem key={item.url} item={item} onClick={onClose} />
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-white/15 mt-5 mb-4" />

      {/* Footer */}
      <UserFooter onLogout={handleLogout} user={user} />
    </div>
  );
}

/* Mobile sidebar — Sheet drawer */
export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 border-r-0">
        <SidebarInner onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

/* Static desktop sidebar content — used directly in UserLayout */
export function UserSidebarContent() {
  return <SidebarInner />;
}

/** @deprecated Use UserSidebarContent in the layout's aside instead */
export function UserSidebar() {
  return null;
}
