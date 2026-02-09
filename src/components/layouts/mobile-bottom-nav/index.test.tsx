import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MobileBottomNav } from "./index";

// Mock do TanStack Router
const mockLocation = { pathname: "/dashboard" };

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: () => mockLocation,
}));

// Mock do useSidebar
const mockToggleSidebar = vi.fn();
vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({
    toggleSidebar: mockToggleSidebar,
  }),
}));

describe("MobileBottomNav Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = "/dashboard";
  });

  it("renders correctly with default props", () => {
    render(<MobileBottomNav />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<MobileBottomNav className="custom-class" />);

    expect(container.querySelector("nav")).toHaveClass("custom-class");
  });

  it("renders left navigation items", () => {
    render(<MobileBottomNav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Frota")).toBeInTheDocument();
  });

  it("renders right navigation items", () => {
    render(<MobileBottomNav />);

    expect(screen.getByText("Reserva")).toBeInTheDocument();
  });

  it("renders menu button", () => {
    render(<MobileBottomNav />);

    const menuButton = screen.getByLabelText("Menu");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveTextContent("Menu");
  });

  it("calls toggleSidebar when menu button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileBottomNav />);

    const menuButton = screen.getByLabelText("Menu");
    await user.click(menuButton);

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("renders home indicator", () => {
    const { container } = render(<MobileBottomNav />);

    const homeIndicator = container.querySelector(
      ".absolute.bottom-1.left-1\\/2"
    );
    expect(homeIndicator).toBeInTheDocument();
  });

  it("applies active styles to active route", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveClass("text-foreground");
  });

  it("applies inactive styles to inactive routes", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const frotaLink = screen.getByText("Frota").closest("a");
    expect(frotaLink).toHaveClass("text-muted-foreground");
  });

  it("renders active indicator for active route", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const homeLink = screen.getByText("Home").closest("a");
    const activeIndicator = homeLink?.querySelector(".absolute.-top-px");
    expect(activeIndicator).toBeInTheDocument();
  });

  it("does not render active indicator for inactive routes", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const frotaLink = screen.getByText("Frota").closest("a");
    const activeIndicator = frotaLink?.querySelector(".absolute.-top-px");
    expect(activeIndicator).not.toBeInTheDocument();
  });

  it("applies bold font to active route label", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const homeLink = screen.getByText("Home").closest("a");
    const label = homeLink?.querySelector("span.text-\\[10px\\]");
    expect(label).toHaveClass("font-bold");
  });

  it("applies medium font to inactive route labels", () => {
    mockLocation.pathname = "/dashboard";
    render(<MobileBottomNav />);

    const frotaLink = screen.getByText("Frota").closest("a");
    const label = frotaLink?.querySelector("span.text-\\[10px\\]");
    expect(label).toHaveClass("font-medium");
  });

  it("marks route as active when pathname matches exactly", () => {
    mockLocation.pathname = "/frota";
    render(<MobileBottomNav />);

    const frotaLink = screen.getByText("Frota").closest("a");
    expect(frotaLink).toHaveClass("text-foreground");
  });

  it("marks route as active when pathname starts with href", () => {
    mockLocation.pathname = "/frota/123";
    render(<MobileBottomNav />);

    const frotaLink = screen.getByText("Frota").closest("a");
    expect(frotaLink).toHaveClass("text-foreground");
  });

  it("renders all navigation items with correct hrefs", () => {
    render(<MobileBottomNav />);

    expect(screen.getByText("Home").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("Frota").closest("a")).toHaveAttribute(
      "href",
      "/frota"
    );
    expect(screen.getByText("Reserva").closest("a")).toHaveAttribute(
      "href",
      "/reservas"
    );
  });

  it("renders icons for all navigation items", () => {
    const { container } = render(<MobileBottomNav />);

    const icons = container.querySelectorAll(".size-6");
    // 3 nav items + 1 menu button = 4 icons
    expect(icons.length).toBe(4);
  });

  it("has correct structure with left and right items", () => {
    render(<MobileBottomNav />);

    const nav = screen.getByRole("navigation");
    const container = nav.querySelector(".flex.h-20");

    expect(container).toBeInTheDocument();
    // Should have 3 nav items + 1 menu button = 4 items
    const items = container?.querySelectorAll("a, button");
    expect(items?.length).toBe(4);
  });
});
