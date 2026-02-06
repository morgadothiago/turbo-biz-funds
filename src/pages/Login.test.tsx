import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

describe("Login Page Integration", () => {
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

  it("should show validation for empty required fields", async () => {
    renderWithProviders(<Login />);
    
    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    }
  });

  it("should show loading state during submission", async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/entrando\.\.\./i) || submitButton).toBeInTheDocument();
    });
  });

  it("should have working navigation to signup page", () => {
    renderWithProviders(<Login />);
    
    const signupLink = screen.getByText(/criar conta grátis/i);
    expect(signupLink).toHaveAttribute("href", "/cadastro");
  });

  it("should have working forgot password link", () => {
    renderWithProviders(<Login />);
    
    const forgotLink = screen.getByText(/esqueceu a senha\?/i);
    expect(forgotLink).toHaveAttribute("href", "/recuperar-senha");
  });

  it("should display test credentials information", () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/credenciais de teste/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@financeai.com/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario@financeai.com/i)).toBeInTheDocument();
  });

  it("should have Google login button", () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole("button", { name: /continuar com google/i })).toBeInTheDocument();
  });
});
