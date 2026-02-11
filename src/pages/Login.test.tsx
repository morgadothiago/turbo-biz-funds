import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./Login";
import { Toaster } from "@/components/ui/sonner";

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Login Page with Zod Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form with all elements", () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/criar conta grátis/i)).toBeInTheDocument();
  });

  it("should update email input on change", () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    
    expect(emailInput).toHaveValue("test@email.com");
  });

  it("should update password input on change", () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText(/senha/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    expect(passwordInput).toHaveValue("password123");
  });

  it("should have Google login button", () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  it("should have navigation links", () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/criar conta grátis/i)).toHaveAttribute("href", "/cadastro");
    expect(screen.getByText(/esqueceu a senha\?/i)).toHaveAttribute("href", "/recuperar-senha");
  });
});
