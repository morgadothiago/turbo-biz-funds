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
  Sparkles
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

function MenuItemLink({ item, end = false, isCollapsed = false }: { item: MenuItem; end?: boolean; isCollapsed?: boolean }) {
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
          isActive && "bg-[#25D366]/15 font-semibold shadow-sm"
        )}
        title={item.title}
      >
        <Icon className={cn(
          "h-5 w-5",
          isActive ? "text-[#25D366]" : "text-white"
        )} />
      </NavLink>
    );
  }

  return (
    <NavLink 
      to={item.url} 
      end={end}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
        isActive && "bg-[#25D366]/15 font-semibold shadow-sm"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        isActive && "bg-[#25D366]/20"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          isActive ? "text-[#25D366]" : "text-white"
        )} />
      </div>
      <span className={cn(
        isActive ? "text-[#25D366]" : "text-white"
      )}>
        {item.title}
      </span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#25D366]" />
      )}
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
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-[#F6F4EF]">
                Organiza<span className="text-[#25D366]">AI</span>
              </h2>
              <p className="text-xs text-[#F6F4EF]/70">Minhas Finanças</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="mx-4 w-auto" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <MenuItemLink item={item} end={item.url === "/dashboard"} isCollapsed={isCollapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-[#F6F4EF]/70">
            Integrações
          </SidebarGroupLabel>
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
        <Separator className="mb-4" />
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent/10 text-accent font-medium">
              {user?.name?.split(" ").map(n => n[0] || "").join("").substring(0, 2) || "US"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
