import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import UserDashboard from "./UserDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("UserDashboard Integration", () => {
  it("should render dashboard with welcome message", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/olá,/i)).toBeInTheDocument();
    expect(screen.getByText(/aqui está o resumo das suas finanças/i)).toBeInTheDocument();
  });

  it("should display all stat cards", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/saldo do mês/i)).toBeInTheDocument();
    expect(screen.getByText(/receitas/i)).toBeInTheDocument();
    expect(screen.getByText(/despesas/i)).toBeInTheDocument();
    expect(screen.getByText(/categorias/i)).toBeInTheDocument();
  });

  it("should display financial values", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/r\$ 3\.450,00/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$ 5\.200,00/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$ 1\.750,00/i)).toBeInTheDocument();
  });

  it("should display percentage changes", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/\+12%/i)).toBeInTheDocument();
    expect(screen.getByText(/\+8%/i)).toBeInTheDocument();
    expect(screen.getByText(/-5%/i)).toBeInTheDocument();
  });

  it("should display expense chart section", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/gastos do mês/i)).toBeInTheDocument();
    expect(screen.getByText(/evolução dos seus gastos/i)).toBeInTheDocument();
  });

  it("should display category chart section", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/gastos por categoria/i)).toBeInTheDocument();
    expect(screen.getByText(/distribuição dos seus gastos/i)).toBeInTheDocument();
  });

  it("should display recent transactions section", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/últimas transações/i)).toBeInTheDocument();
    expect(screen.getByText(/supermercado extra/i)).toBeInTheDocument();
    expect(screen.getByText(/uber - viagem/i)).toBeInTheDocument();
    expect(screen.getByText(/salário/i)).toBeInTheDocument();
  });

  it("should display transaction amounts", () => {
    renderWithProviders(<UserDashboard />);
    
    // Test looking for formatted amounts with proper spacing
    expect(screen.getByText(/r\$ 245\.50/i)).toBeInTheDocument();
    expect(screen.getByText(/\+r\$ 5200\.00/i)).toBeInTheDocument();
  });

  it("should display goals section", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/minhas metas/i)).toBeInTheDocument();
    expect(screen.getByText(/reserva de emergência/i)).toBeInTheDocument();
    expect(screen.getByText(/viagem de férias/i)).toBeInTheDocument();
  });

  it("should display goal progress", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/53%/i)).toBeInTheDocument();
    expect(screen.getByText(/44%/i)).toBeInTheDocument();
  });

  it("should display WhatsApp CTA section", () => {
    renderWithProviders(<UserDashboard />);
    
    expect(screen.getByText(/registre pelo whatsapp/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /conectar whatsapp/i })).toBeInTheDocument();
  });

  it("should display category names in chart legend", () => {
    renderWithProviders(<UserDashboard />);
    
    // Use getAllByText for elements that appear multiple times
    expect(screen.getAllByText(/alimentação/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/transporte/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/lazer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contas/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/outros/i)).toBeInTheDocument();
  });
});
