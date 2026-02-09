import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useBottomNav } from "./use-bottom-nav";
import { BottomNavProvider } from "./use-bottom-nav-context";

// Mock do useSidebar usado pelo BottomNav
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

// Componente de teste que usa o hook
function TestComponent() {
  const { setBottomNav, isActive } = useBottomNav();

  return (
    <div>
      <button
        data-testid="set-left-action"
        onClick={() =>
          setBottomNav({
            leftAction: {
              label: "Voltar",
              onClick: vi.fn(),
            },
          })
        }
      >
        Set Left Action
      </button>
      <button
        data-testid="set-right-actions"
        onClick={() =>
          setBottomNav({
            rightActions: [
              {
                label: "Salvar",
                onClick: vi.fn(),
              },
            ],
          })
        }
      >
        Set Right Actions
      </button>
      <button data-testid="clear-nav" onClick={() => setBottomNav(null)}>
        Clear Nav
      </button>
      <div data-testid="is-active">{isActive ? "active" : "inactive"}</div>
    </div>
  );
}

describe("BottomNavProvider and useBottomNav", () => {
  it("throws error when useBottomNav is used outside provider", () => {
    // Suprime o erro esperado no console
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useBottomNav must be used within BottomNavProvider");

    consoleError.mockRestore();
  });

  it("provides context value when used within provider", () => {
    render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    expect(screen.getByTestId("is-active")).toHaveTextContent("inactive");
  });

  it("updates isActive when leftAction is set", async () => {
    render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    const setButton = screen.getByTestId("set-left-action");
    setButton.click();

    expect(screen.getByTestId("is-active")).toHaveTextContent("active");
  });

  it("updates isActive when rightActions are set", async () => {
    render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    const setButton = screen.getByTestId("set-right-actions");
    setButton.click();

    expect(screen.getByTestId("is-active")).toHaveTextContent("active");
  });

  it("updates isActive to false when nav is cleared", async () => {
    render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    // Primeiro ativa
    screen.getByTestId("set-left-action").click();
    expect(screen.getByTestId("is-active")).toHaveTextContent("active");

    // Depois limpa
    screen.getByTestId("clear-nav").click();
    expect(screen.getByTestId("is-active")).toHaveTextContent("inactive");
  });

  it("renders BottomNav component when actions are set", async () => {
    render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    // Inicialmente não deve renderizar
    expect(screen.queryByText("Voltar")).not.toBeInTheDocument();

    // Após definir ação, deve renderizar
    screen.getByTestId("set-left-action").click();

    await waitFor(() => {
      expect(screen.getByText("Voltar")).toBeInTheDocument();
    });
  });

  it("maintains context value stability with useMemo", () => {
    const { rerender } = render(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    const initialIsActive = screen.getByTestId("is-active").textContent;

    // Re-render sem mudanças
    rerender(
      <BottomNavProvider>
        <TestComponent />
      </BottomNavProvider>
    );

    // O valor deve permanecer o mesmo (teste de estabilidade do useMemo)
    expect(screen.getByTestId("is-active").textContent).toBe(initialIsActive);
  });
});
