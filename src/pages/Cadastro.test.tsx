import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Cadastro from "@/pages/Cadastro";
import React from "react";

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

describe("Cadastro Page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render registration form", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByText(/crie sua conta/i)).toBeInTheDocument();
  });

  it("should show step indicator", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument();
  });

  it("should render name input", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
  });

  it("should render email input", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should update form fields", () => {
    renderWithProviders(<Cadastro />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    
    expect(nameInput).toHaveValue("João Silva");
  });

  it("should validate name field", async () => {
    renderWithProviders(<Cadastro />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: "J" } });
    
    const continueButton = screen.getByRole("button", { name: /continuar/i });
    fireEvent.click(continueButton);
    
    expect(await screen.findByText(/mínimo 2 caracteres/i)).toBeInTheDocument();
  });

  it("should validate email field", async () => {
    renderWithProviders(<Cadastro />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "email-invalido" } });
    
    const continueButton = screen.getByRole("button", { name: /continuar/i });
    fireEvent.click(continueButton);
    
    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
  });

  it("should show password requirements hint", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
  });

  it("should have login link", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByRole("link", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should have terms link", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByRole("link", { name: /termos/i })).toBeInTheDocument();
  });

  it("should have privacy policy link", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByRole("link", { name: /privacidade/i })).toBeInTheDocument();
  });

  it("should render Google login button", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  it("should render progress indicator", () => {
    renderWithProviders(<Cadastro />);
    
    const progressSteps = document.querySelectorAll("[class*='rounded-full']");
    expect(progressSteps.length).toBeGreaterThanOrEqual(2);
  });
});
