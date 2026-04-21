import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const homeLink = isAuthenticated ? "/dashboard" : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-xl font-semibold text-foreground mb-2">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground mb-8">
          O endereço que você tentou acessar não existe ou foi removido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to={homeLink}>
              <Home className="w-4 h-4 mr-2" />
              {isAuthenticated ? "Ir para o Dashboard" : "Voltar para o início"}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
