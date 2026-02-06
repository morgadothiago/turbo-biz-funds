import { lazy, Suspense } from "react";
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

const App = () => (
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
);

export default App;
