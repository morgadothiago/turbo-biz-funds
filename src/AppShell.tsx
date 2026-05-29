import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { storage } from "@/lib/storage";

const Login = lazy(() => import(/* webpackChunkName: "auth-login" */ "./pages/Login"));
const Cadastro = lazy(() => import(/* webpackChunkName: "auth-cadastro" */ "./pages/Cadastro"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "auth-forgot" */ "./pages/ForgotPassword"));
const ResetPassword = lazy(() => import(/* webpackChunkName: "auth-reset" */ "./pages/ResetPassword"));
const Pagamento = lazy(() => import(/* webpackChunkName: "auth-pagamento" */ "./pages/Pagamento"));
const PagamentoSucesso = lazy(() => import(/* webpackChunkName: "auth-pagamento-sucesso" */ "./pages/PagamentoSucesso"));
const NotFound = lazy(() => import(/* webpackChunkName: "pages-notfound" */ "./pages/NotFound"));
const UserDashboard = lazy(() => import(/* webpackChunkName: "dashboard-user" */ "./pages/UserDashboard"));
const NotificationsPage = lazy(() => import(/* webpackChunkName: "pages-notifications" */ "./pages/Notifications"));
const SupportPage = lazy(() => import(/* webpackChunkName: "pages-support" */ "./pages/Support"));
const AdminNotificationsPage = lazy(() => import(/* webpackChunkName: "admin-notifications" */ "./pages/admin/AdminNotifications"));
const AdminSettingsPage = lazy(() => import(/* webpackChunkName: "admin-settings" */ "./pages/admin/AdminSettings"));
const AdminReportsPage = lazy(() => import(/* webpackChunkName: "admin-reports" */ "./pages/admin/AdminReports"));
const AdminSupportPage = lazy(() => import(/* webpackChunkName: "admin-support" */ "./pages/admin/AdminSupport"));

const UserLayout = lazy(() => import(/* webpackChunkName: "layout-user" */ "./layouts/UserLayout"));
const AdminLayout = lazy(() => import(/* webpackChunkName: "layout-admin" */ "./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "dashboard-admin" */ "./pages/admin/AdminDashboard"));
const AdminClients = lazy(() => import(/* webpackChunkName: "pages-admin-clients" */ "./pages/admin/AdminUsers"));
  const AdminPlans = lazy(() => import(/* webpackChunkName: "pages-admin-plans" */ "./pages/admin/AdminPlans"));
const AdminSubscriptions = lazy(() => import(/* webpackChunkName: "pages-admin-subscriptions" */ "./pages/admin/AdminSubscriptions"));
const AdminCategoriesPage = lazy(() => import(/* webpackChunkName: "pages-admin-categories" */ "./pages/admin/AdminCategories"));

const TransactionsPage = lazy(() => import(/* webpackChunkName: "pages-transactions" */ "./pages/Transactions"));
const GoalsPage = lazy(() => import(/* webpackChunkName: "pages-goals" */ "./pages/Goals"));
const CardsPage = lazy(() => import(/* webpackChunkName: "pages-cards" */ "./pages/Cards"));
const WhatsAppPage = lazy(() => import(/* webpackChunkName: "pages-whatsapp" */ "./pages/WhatsApp"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "pages-settings" */ "./pages/Settings"));
const RecorrenciasPage = lazy(() => import(/* webpackChunkName: "pages-recorrencias" */ "./pages/Recorrencias"));
const RecorrenciaDetalhePage = lazy(() => import(/* webpackChunkName: "pages-recorrencia-detalhe" */ "./pages/RecorrenciaDetalhe"));
const RelatorioPage = lazy(() => import(/* webpackChunkName: "pages-relatorio" */ "./pages/Relatorio"));

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

  if (isLoading) return <AuthLoadingFallback />;

  // Token exists but state not yet committed (race condition after register/login)
  if (!isAuthenticated && storage.getToken()) return <AuthLoadingFallback />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingFallback />;

  // Token exists but state not yet committed (race condition after register/login)
  if (!isAuthenticated && storage.getToken()) return <AuthLoadingFallback />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

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
    const pending = sessionStorage.getItem("postRegisterRedirect");
    if (pending) {
      sessionStorage.removeItem("postRegisterRedirect");
      return <Navigate to={pending} replace />;
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
        <Route path="/cadastro" element={<Cadastro />} />
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
          <Route path="metas" element={<GoalsPage />} />
          <Route path="cartoes" element={<CardsPage />} />
          <Route path="recorrencias" element={<RecorrenciasPage />} />
          <Route path="recorrencias/:id" element={<RecorrenciaDetalhePage />} />
          <Route path="whatsapp" element={<WhatsAppPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="notificacoes" element={<NotificationsPage />} />
          <Route path="suporte" element={<SupportPage />} />
          <Route path="relatorio" element={<RelatorioPage />} />
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
          <Route path="configuracoes" element={<AdminSettingsPage />} />
          <Route path="relatorios" element={<AdminReportsPage />} />
          <Route path="notificacoes" element={<AdminNotificationsPage />} />
          <Route path="suporte" element={<AdminSupportPage />} />
          <Route path="categorias" element={<AdminCategoriesPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const AppShell = () => (
  <ThemeProvider storageKey="doutorcash-theme">
    <AuthProvider>
      <TooltipProvider>
        <OfflineBanner />
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default AppShell;
