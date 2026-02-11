import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoalsProgress } from "./GoalsProgress";

describe("GoalsProgress Component", () => {
  const mockGoals = [
    {
      id: "emergency-fund",
      name: "Reserva de Emergência",
      current: 8000,
      target: 15000,
      color: "bg-success",
    },
    {
      id: "vacation",
      name: "Viagem de Férias",
      current: 3500,
      target: 8000,
      color: "bg-primary",
    },
  ];

  it("should render all goals", () => {
    render(<GoalsProgress goals={mockGoals} />);

    expect(screen.getByText("Reserva de Emergência")).toBeInTheDocument();
    expect(screen.getByText("Viagem de Férias")).toBeInTheDocument();
  });

  it("should render progress bars", () => {
    render(<GoalsProgress goals={mockGoals} />);

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBe(2);
  });

  it("should render goal names", () => {
    render(<GoalsProgress goals={mockGoals} />);

    expect(screen.getByText((content) => content.includes("Reserva"))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Viagem"))).toBeInTheDocument();
  });

  it("should render section title", () => {
    render(<GoalsProgress goals={mockGoals} />);

    const title = screen.getByText((content) => content.includes("Metas"));
    expect(title).toBeInTheDocument();
  });

  it("should render empty goals list", () => {
    render(<GoalsProgress goals={[]} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
