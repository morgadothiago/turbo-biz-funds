import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

describe("StatCard Component", () => {
  const mockStat = {
    id: "test-stat",
    title: "Saldo do Mês",
    value: "R$ 3.450,00",
    change: "+12%",
    trend: "up" as const,
    icon: Wallet,
    color: "text-white",
    bgColor: "bg-white/20",
  };

  it("should render stat card with correct values", () => {
    render(<StatCard stat={mockStat} />);

    expect(screen.getByText("Saldo do Mês")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.450,00")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("should render trend up correctly", () => {
    render(<StatCard stat={mockStat} />);

    expect(screen.getByText("+12%")).toHaveClass("text-green-400");
  });

  it("should render trend down correctly", () => {
    const downStat = { ...mockStat, trend: "down" as const, change: "-5%" };
    render(<StatCard stat={downStat} />);

    expect(screen.getByText("-5%")).toHaveClass("text-red-400");
  });

  it("should render with different icon variants", () => {
    const incomeStat = { ...mockStat, title: "Receitas", icon: TrendingUp };
    const expenseStat = { ...mockStat, title: "Despesas", icon: TrendingDown };

    render(
      <div>
        <StatCard stat={incomeStat} />
        <StatCard stat={expenseStat} />
      </div>
    );

    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText("Despesas")).toBeInTheDocument();
  });

  it("should render card container with title", () => {
    render(<StatCard stat={mockStat} />);

    expect(screen.getByText("Saldo do Mês")).toBeInTheDocument();
  });
});
