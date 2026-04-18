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
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
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
          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 mx-auto",
          isActive
            ? "bg-primary/15 text-primary"
            : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
        title={item.title}
        aria-label={item.title}
      >
        <Icon className="h-[18px] w-[18px]" />
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.url}
      end={end}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group/item",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground/90"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover/item:text-sidebar-foreground/80")} />
      <span className="flex-1 truncate">{item.title}</span>
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
    <Sidebar collapsible="icon" className="border-r-0 border-sidebar-border bg-sidebar">
      <SidebarHeader className={cn("pt-5 pb-4", isCollapsed ? "px-3" : "px-4")}>
        <div className={cn("flex items-center gap-2.5", isCollapsed && "justify-center")}>
          <img
            src="/logoweb.png"
            alt="doutorcash"
            className="h-7 w-auto shrink-0 object-contain"
          />
          {!isCollapsed && (
            <span className="text-[13px] font-medium text-sidebar-foreground/70 truncate">
              doutorcash
            </span>
          )}
        </div>
      </SidebarHeader>

      <div className={cn("h-px bg-sidebar-border", isCollapsed ? "mx-3" : "mx-4")} />

      <SidebarContent className={cn("py-4", isCollapsed ? "px-2" : "px-3")}>
        <SidebarGroup className="p-0">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/30 mb-1 px-3 h-auto pb-1.5">
              Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto p-0">
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

        <SidebarGroup className="mt-5 p-0">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/30 mb-1 px-3 h-auto pb-1.5">
              Mais
            </SidebarGroupLabel>
          )}
          {isCollapsed && <div className="h-px bg-sidebar-border mx-1 mb-3" />}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto p-0">
                    <MenuItemLink item={item} isCollapsed={isCollapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("pb-4", isCollapsed ? "px-2" : "px-3")}>
        <div className="h-px bg-sidebar-border mb-3" />
        <div className={cn("flex items-center gap-2.5", isCollapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-sidebar-foreground/90 truncate leading-tight">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-[11px] text-sidebar-foreground/40 truncate leading-tight mt-0.5">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-sidebar-foreground/35 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent"
                onClick={handleLogout}
                aria-label="Sair"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
