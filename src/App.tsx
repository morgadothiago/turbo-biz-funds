import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { analytics } from "./lib/analytics";
import { I18nProvider } from "./lib/i18n-provider";

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
    <I18nProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/*" element={<Suspense fallback={<AppLoading />}><AppShell /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </ErrorBoundary>
);

export default App;

export { PageLoading };
