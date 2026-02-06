import { lazy, Suspense, Component } from "react";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load secondary pages (not needed on first load)
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages (heavy bundle with Recharts)
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCompanies = lazy(() => import("./pages/admin/AdminCompanies"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));

const queryClient = new QueryClient();

// Error boundary to prevent blank screens
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F4EF', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3F7F6B', marginBottom: '1rem' }}>OrganizaAI</h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Algo deu errado. Tente recarregar a página.</p>
            <button onClick={() => window.location.reload()} style={{ background: '#3F7F6B', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
            <Route path="/cadastro" element={<Suspense fallback={null}><Cadastro /></Suspense>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Suspense fallback={null}><AdminLayout /></Suspense>}>
              <Route index element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
              <Route path="usuarios" element={<Suspense fallback={null}><AdminUsers /></Suspense>} />
              <Route path="empresas" element={<Suspense fallback={null}><AdminCompanies /></Suspense>} />
              <Route path="planos" element={<Suspense fallback={null}><AdminPlans /></Suspense>} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
