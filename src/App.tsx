import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { analytics } from "./lib/analytics";

const AppShell = lazy(() => import("./AppShell"));

const AppLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const PageLoading = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
);

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    analytics.viewPage(location.pathname);
  }, [location]);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/*" element={<Suspense fallback={<AppLoading />}><AppShell /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;

export { PageLoading };
