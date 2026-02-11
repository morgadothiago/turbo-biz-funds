import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

describe("Cadastro Page with Validation", () => {
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
    
    const progressBars = document.querySelectorAll('[class*="h-1"]');
    expect(progressBars.length).toBeGreaterThanOrEqual(2);
  });
});
