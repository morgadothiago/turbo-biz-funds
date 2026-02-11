import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cadastro from "./Cadastro";
import { Toaster } from "@/components/ui/sonner";

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
      <Toaster />
    </BrowserRouter>
  );
};

describe("Cadastro Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render step 1 form correctly", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByText(/crie sua conta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
  });

  it("should update name input on change", () => {
    renderWithProviders(<Cadastro />);
    
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    
    expect(nameInput).toHaveValue("João Silva");
  });

  it("should render progress indicator", () => {
    renderWithProviders(<Cadastro />);
    
    const progressSteps = document.querySelectorAll("[class*='rounded-full']");
    expect(progressSteps.length).toBeGreaterThanOrEqual(2);
  });

  it("should render continue button", () => {
    renderWithProviders(<Cadastro />);
    
    expect(screen.getByRole("button", { name: /continuar/i })).toBeInTheDocument();
  });
});
