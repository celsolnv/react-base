import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomNav } from "./index";
import type { BottomNavAction, BottomNavLeftAction } from "./types";

// Mock do useSidebar
vi.mock("@/components/shadcn", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
  useSidebar: () => ({
    state: "expanded" as const,
    isMobile: false,
  }),
}));

describe("BottomNav Component", () => {
  it("renders nothing when no actions are provided", () => {
    const { container } = render(<BottomNav />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when both actions are empty", () => {
    const { container } = render(
      <BottomNav leftAction={undefined} rightActions={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders left action when provided", () => {
    const leftAction: BottomNavLeftAction = {
      label: "Voltar",
      onClick: vi.fn(),
    };

    render(<BottomNav leftAction={leftAction} />);

    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("renders left action with custom icon", () => {
    const leftAction: BottomNavLeftAction = {
      label: "Voltar",
      onClick: vi.fn(),
      icon: <span data-testid="custom-icon">←</span>,
    };

    render(<BottomNav leftAction={leftAction} />);

    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders right actions when provided", () => {
    const rightActions: BottomNavAction[] = [
      {
        label: "Salvar",
        onClick: vi.fn(),
      },
    ];

    render(<BottomNav rightActions={rightActions} />);

    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("renders multiple right actions", () => {
    const rightActions: BottomNavAction[] = [
      {
        label: "Cancelar",
        onClick: vi.fn(),
        variant: "outline",
      },
      {
        label: "Salvar",
        onClick: vi.fn(),
        variant: "default",
      },
    ];

    render(<BottomNav rightActions={rightActions} />);

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("calls left action onClick when clicked", async () => {
    const onClick = vi.fn();
    const leftAction: BottomNavLeftAction = {
      label: "Voltar",
      onClick,
    };

    render(<BottomNav leftAction={leftAction} />);

    const button = screen.getByText("Voltar");
    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls right action onClick when clicked", async () => {
    const onClick = vi.fn();
    const rightActions: BottomNavAction[] = [
      {
        label: "Salvar",
        onClick,
      },
    ];

    render(<BottomNav rightActions={rightActions} />);

    const button = screen.getByText("Salvar");
    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables left action when disabled prop is true", () => {
    const leftAction: BottomNavLeftAction = {
      label: "Voltar",
      onClick: vi.fn(),
      disabled: true,
    };

    render(<BottomNav leftAction={leftAction} />);

    const button = screen.getByText("Voltar");
    expect(button).toBeDisabled();
  });

  it("disables right action when disabled prop is true", () => {
    const rightActions: BottomNavAction[] = [
      {
        label: "Salvar",
        onClick: vi.fn(),
        disabled: true,
      },
    ];

    render(<BottomNav rightActions={rightActions} />);

    const button = screen.getByText("Salvar");
    expect(button).toBeDisabled();
  });

  it("shows loading state for right action", () => {
    const rightActions: BottomNavAction[] = [
      {
        label: "Salvar",
        onClick: vi.fn(),
        loading: true,
      },
    ];

    render(<BottomNav rightActions={rightActions} />);

    const button = screen.getByText("Salvar");
    expect(button).toBeDisabled();
    // Verifica se há um spinner (classe animate-spin)
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const leftAction: BottomNavLeftAction = {
      label: "Voltar",
      onClick: vi.fn(),
    };

    const { container } = render(
      <BottomNav leftAction={leftAction} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
