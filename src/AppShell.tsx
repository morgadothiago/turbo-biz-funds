import { lazy, Suspense, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthLoading } from "@/components/AuthLoading";
import { ThemeProvider } from "@/components/ui/theme-provider";

const Login = lazy(() => import(/* webpackChunkName: "auth-login" */ "./pages/Login"));
const Cadastro = lazy(() => import(/* webpackChunkName: "auth-cadastro" */ "./pages/Cadastro"));
const NotFound = lazy(() => import(/* webpackChunkName: "pages-notfound" */ "./pages/NotFound"));
const UserDashboard = lazy(() => import(/* webpackChunkName: "dashboard-user" */ "./pages/UserDashboard"));

const UserLayout = lazy(() => import(/* webpackChunkName: "layout-user" */ "./layouts/UserLayout"));
const AdminLayout = lazy(() => import(/* webpackChunkName: "layout-admin" */ "./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "dashboard-admin" */ "./pages/admin/AdminDashboard"));
const AdminClients = lazy(() => import(/* webpackChunkName: "pages-admin-clients" */ "./pages/admin/AdminUsers"));
const AdminPlans = lazy(() => import(/* webpackChunkName: "pages-admin-plans" */ "./pages/admin/AdminPlans"));
const AdminSubscriptions = lazy(() => import(/* webpackChunkName: "pages-admin-subscriptions" */ "./pages/admin/AdminSubscriptions"));

const TransactionsPage = lazy(() => import(/* webpackChunkName: "pages-transactions" */ "./pages/Transactions"));
const CategoriesPage = lazy(() => import(/* webpackChunkName: "pages-categories" */ "./pages/Categories"));
const GoalsPage = lazy(() => import(/* webpackChunkName: "pages-goals" */ "./pages/Goals"));
const CardsPage = lazy(() => import(/* webpackChunkName: "pages-cards" */ "./pages/Cards"));
const WhatsAppPage = lazy(() => import(/* webpackChunkName: "pages-whatsapp" */ "./pages/WhatsApp"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "pages-settings" */ "./pages/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const PageLoading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const DashboardLoading = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-muted rounded-lg"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 bg-muted rounded-lg"></div>
      <div className="h-80 bg-muted rounded-lg"></div>
    </div>
  </div>
);

const AuthLoadingPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const AuthLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <AuthLoadingPage />
  </div>
);

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/cadastro" element={
          <PublicRoute>
            <Cadastro />
          </PublicRoute>
        } />

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="transacoes" element={<TransactionsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="metas" element={<GoalsPage />} />
          <Route path="cartoes" element={<CardsPage />} />
          <Route path="whatsapp" element={<WhatsAppPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="assinaturas" element={<AdminSubscriptions />} />
          <Route path="planos" element={<AdminPlans />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const AppShell = () => (
  <ThemeProvider defaultTheme="system" storageKey="organizaai-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default AppShell;
