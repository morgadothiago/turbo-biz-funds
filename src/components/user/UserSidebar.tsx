import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  LogOut,
  MessageCircle,
  CreditCard,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const mainMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transações", url: "/dashboard/transacoes", icon: Receipt },
  { title: "Categorias", url: "/dashboard/categorias", icon: PieChart },
  { title: "Metas", url: "/dashboard/metas", icon: Target },
  { title: "Cartões", url: "/dashboard/cartoes", icon: CreditCard },
];

const secondaryMenuItems: MenuItem[] = [
  { title: "WhatsApp", url: "/dashboard/whatsapp", icon: MessageCircle },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
];

interface MenuItemLinkProps {
  item: MenuItem;
  end?: boolean;
  isCollapsed?: boolean;
}

function MenuItemLink({ item, end = false, isCollapsed = false }: MenuItemLinkProps) {
  const location = useLocation();
  const isActive = end
    ? location.pathname === item.url
    : location.pathname.startsWith(item.url);
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <NavLink
        to={item.url}
        end={end}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 mx-auto",
          isActive
            ? "bg-primary/20 text-primary font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
        title={item.title}
        aria-label={item.title}
      >
        <Icon className="h-5 w-5" />
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.url}
      end={end}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary/20 text-primary font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
          isActive ? "bg-primary/20" : "bg-sidebar-accent/50"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-sidebar-foreground/70")} />
      </div>
      <span className={cn("flex-1", isActive ? "text-primary" : "text-sidebar-foreground/70")}>
        {item.title}
      </span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
    </NavLink>
  );
}

export function UserSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada");
    navigate("/login");
  };

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
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
                <h2 className="font-bold text-lg text-sidebar-foreground truncate">
                  Planeja<span className="text-primary"> Aí</span>
                </h2>
              <p className="text-xs text-sidebar-foreground/60 truncate">Minhas Finanças</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="mx-4 w-auto bg-sidebar-border" />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-3 px-3">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <MenuItemLink
                      item={item}
                      end={item.url === "/dashboard"}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-3 px-3">
              Integrações
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <MenuItemLink item={item} isCollapsed={isCollapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Avatar className="h-9 w-9 bg-primary/20">
            <AvatarFallback className="bg-primary/20 text-primary font-medium text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleLogout}
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
