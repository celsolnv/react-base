import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppLayout } from "./index";

// Mock dos componentes filhos
vi.mock("../sidebar", () => ({
  AppSidebar: () => <div data-testid="app-sidebar">AppSidebar</div>,
}));

vi.mock("../top-bar", () => ({
  TopBar: ({ className }: { className?: string }) => (
    <div data-testid="top-bar" className={className}>
      TopBar
    </div>
  ),
}));

vi.mock("../mobile-bottom-nav", () => ({
  MobileBottomNav: () => (
    <nav data-testid="mobile-bottom-nav">MobileBottomNav</nav>
  ),
}));

vi.mock("../bottom-nav/use-bottom-nav-context", () => ({
  BottomNavProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bottom-nav-provider">{children}</div>
  ),
}));

// Mock do SidebarProvider e SidebarInset
vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({
    children,
    defaultOpen,
  }: {
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <div data-testid="sidebar-provider" data-default-open={defaultOpen}>
      {children}
    </div>
  ),
  SidebarInset: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar-inset" className={className}>
      {children}
    </div>
  ),
}));

describe("AppLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with children", () => {
    render(
      <AppLayout>
        <div data-testid="test-child">Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders SidebarProvider with defaultOpen true", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const sidebarProvider = screen.getByTestId("sidebar-provider");
    expect(sidebarProvider).toBeInTheDocument();
    expect(sidebarProvider).toHaveAttribute("data-default-open", "true");
  });

  it("renders AppSidebar component", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
  });

  it("renders BottomNavProvider", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("bottom-nav-provider")).toBeInTheDocument();
  });

  it("renders SidebarInset with correct className", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const sidebarInset = screen.getByTestId("sidebar-inset");
    expect(sidebarInset).toBeInTheDocument();
    expect(sidebarInset).toHaveClass(
      "flex",
      "flex-col",
      "h-screen",
      "overflow-hidden"
    );
  });

  it("renders TopBar with shrink-0 className", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const topBar = screen.getByTestId("top-bar");
    expect(topBar).toBeInTheDocument();
    expect(topBar).toHaveClass("shrink-0");
  });

  it("renders main element with correct structure and className", () => {
    render(
      <AppLayout>
        <div data-testid="main-content">Main Content</div>
      </AppLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(
      "flex-1",
      "overflow-hidden",
      "p-4",
      "md:p-6",
      "flex",
      "flex-col",
      "min-h-0"
    );
    expect(main).toContainElement(screen.getByTestId("main-content"));
  });

  it("renders MobileBottomNav component", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("mobile-bottom-nav")).toBeInTheDocument();
  });

  it("renders children inside main element", () => {
    render(
      <AppLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </AppLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("child-1"));
    expect(main).toContainElement(screen.getByTestId("child-2"));
  });

  it("maintains correct component hierarchy", () => {
    const { container } = render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const sidebarProvider = screen.getByTestId("sidebar-provider");
    const appSidebar = screen.getByTestId("app-sidebar");
    const bottomNavProvider = screen.getByTestId("bottom-nav-provider");
    const sidebarInset = screen.getByTestId("sidebar-inset");
    const topBar = screen.getByTestId("top-bar");
    const main = screen.getByRole("main");
    const mobileBottomNav = screen.getByTestId("mobile-bottom-nav");

    // Verifica hierarquia
    expect(sidebarProvider).toContainElement(appSidebar);
    expect(sidebarProvider).toContainElement(bottomNavProvider);
    expect(bottomNavProvider).toContainElement(sidebarInset);
    expect(bottomNavProvider).toContainElement(mobileBottomNav);
    expect(sidebarInset).toContainElement(topBar);
    expect(sidebarInset).toContainElement(main);
  });

  it("renders complex children structure", () => {
    render(
      <AppLayout>
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </div>
      </AppLayout>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    render(<AppLayout>{null}</AppLayout>);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toBeEmptyDOMElement();
  });

  it("handles multiple children", () => {
    render(
      <AppLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </AppLayout>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });
});
