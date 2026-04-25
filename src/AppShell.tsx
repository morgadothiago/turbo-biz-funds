import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { PlanLimitListener } from "@/components/upgrade/PlanLimitListener";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";

const Login = lazy(() => import(/* webpackChunkName: "auth-login" */ "./pages/Login"));
const Cadastro = lazy(() => import(/* webpackChunkName: "auth-cadastro" */ "./pages/Cadastro"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "auth-forgot" */ "./pages/ForgotPassword"));
const ResetPassword = lazy(() => import(/* webpackChunkName: "auth-reset" */ "./pages/ResetPassword"));
const Pagamento = lazy(() => import(/* webpackChunkName: "auth-pagamento" */ "./pages/Pagamento"));
const PagamentoSucesso = lazy(() => import(/* webpackChunkName: "auth-pagamento-sucesso" */ "./pages/PagamentoSucesso"));
const NotFound = lazy(() => import(/* webpackChunkName: "pages-notfound" */ "./pages/NotFound"));
const UserDashboard = lazy(() => import(/* webpackChunkName: "dashboard-user" */ "./pages/UserDashboard"));

const UserLayout = lazy(() => import(/* webpackChunkName: "layout-user" */ "./layouts/UserLayout"));
const AdminLayout = lazy(() => import(/* webpackChunkName: "layout-admin" */ "./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "dashboard-admin" */ "./pages/admin/AdminDashboard"));
const AdminClients = lazy(() => import(/* webpackChunkName: "pages-admin-clients" */ "./pages/admin/AdminUsers"));
const AdminCompanies = lazy(() => import(/* webpackChunkName: "pages-admin-companies" */ "./pages/admin/AdminCompanies"));
const AdminPlans = lazy(() => import(/* webpackChunkName: "pages-admin-plans" */ "./pages/admin/AdminPlans"));
const AdminSubscriptions = lazy(() => import(/* webpackChunkName: "pages-admin-subscriptions" */ "./pages/admin/AdminSubscriptions"));

const TransactionsPage = lazy(() => import(/* webpackChunkName: "pages-transactions" */ "./pages/Transactions"));
const CategoriesPage = lazy(() => import(/* webpackChunkName: "pages-categories" */ "./pages/Categories"));
const GoalsPage = lazy(() => import(/* webpackChunkName: "pages-goals" */ "./pages/Goals"));
const CardsPage = lazy(() => import(/* webpackChunkName: "pages-cards" */ "./pages/Cards"));
const WhatsAppPage = lazy(() => import(/* webpackChunkName: "pages-whatsapp" */ "./pages/WhatsApp"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "pages-settings" */ "./pages/Settings"));
const RecorrenciasPage = lazy(() => import(/* webpackChunkName: "pages-recorrencias" */ "./pages/Recorrencias"));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
      },
    },
  });
}

const PageLoading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => navigate("/login", { replace: true });
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, [navigate]);

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
        <Route path="/recuperar-senha" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/redefinir-senha" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        <Route path="/pagamento" element={
          <PrivateRoute><Pagamento /></PrivateRoute>
        } />
        <Route path="/pagamento-sucesso" element={
          <PrivateRoute><PagamentoSucesso /></PrivateRoute>
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
          <Route path="recorrencias" element={<RecorrenciasPage />} />
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
          <Route path="empresas" element={<AdminCompanies />} />
          <Route path="assinaturas" element={<AdminSubscriptions />} />
          <Route path="planos" element={<AdminPlans />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const AppShell = () => {
  const [queryClient] = useState(createQueryClient);
  return (
  <ThemeProvider storageKey="doutorcash-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <OfflineBanner />
          <PlanLimitListener />
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
  );
};

export default AppShell;
