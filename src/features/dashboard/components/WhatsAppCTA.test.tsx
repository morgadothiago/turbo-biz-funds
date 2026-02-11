import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppCTA } from "./WhatsAppCTA";

describe("WhatsAppCTA Component", () => {
  it("should render WhatsApp CTA card", () => {
    render(<WhatsAppCTA />);

    expect(screen.getByText("Registre pelo WhatsApp")).toBeInTheDocument();
  });

  it("should render connect button", () => {
    render(<WhatsAppCTA />);

    const button = screen.getByRole("button", { name: /conectar/i });
    expect(button).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<WhatsAppCTA />);

    const description = screen.getByText((content) => 
      content.includes("Envie áudio") && content.includes("IA categoriza")
    );
    expect(description).toBeInTheDocument();
  });
});
