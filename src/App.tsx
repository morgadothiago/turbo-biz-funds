import { lazy, Suspense, Component } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";

// Lazy load everything that the landing page doesn't need
const AppShell = lazy(() => import("./AppShell"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/*" element={<Suspense fallback={<AppLoading />}><AppShell /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
