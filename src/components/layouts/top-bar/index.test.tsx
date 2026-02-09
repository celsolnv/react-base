import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TopBar } from "./index";

// Mock do TanStack Router
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/usuarios" };

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

// Mock do useSidebar
const mockToggleSidebar = vi.fn();
let mockIsMobile = false;

vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({
    isMobile: mockIsMobile,
    toggleSidebar: mockToggleSidebar,
  }),
  SidebarTrigger: ({ className }: any) => (
    <button className={className} data-testid="sidebar-trigger">
      Toggle
    </button>
  ),
}));

// Mock do useAuth
const mockLogout = vi.fn();
let mockUser = {
  name: "John Doe",
  email: "john@example.com",
};

vi.mock("@/modules/auth/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

// Mock do getUserInitials
vi.mock("@/utils/text", () => ({
  getUserInitials: (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },
}));

// Mock dos componentes do shadcn
vi.mock("@/components/shadcn", () => ({
  Avatar: ({ children, className }: any) => (
    <div className={className} data-testid="avatar">
      {children}
    </div>
  ),
  AvatarFallback: ({ children, className }: any) => (
    <div className={className} data-testid="avatar-fallback">
      {children}
    </div>
  ),
  Button: ({ children, onClick, className, "aria-label": ariaLabel }: any) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children, className }: any) => (
    <div className={className} data-testid="dropdown-content">
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="dropdown-item">
      {children}
    </button>
  ),
  DropdownMenuSeparator: ({ className }: any) => (
    <hr className={className} data-testid="dropdown-separator" />
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  Separator: ({ orientation, className }: any) => (
    <div
      className={className}
      data-testid="separator"
      data-orientation={orientation}
    />
  ),
  SidebarTrigger: ({ className }: any) => (
    <button className={className} data-testid="sidebar-trigger">
      Toggle
    </button>
  ),
}));

describe("TopBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = "/usuarios";
    mockUser = {
      name: "John Doe",
      email: "john@example.com",
    };
    mockIsMobile = false;
  });

  it("renders correctly with default props", () => {
    render(<TopBar />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<TopBar className="custom-class" />);

    expect(container.querySelector("header")).toHaveClass("custom-class");
  });

  it("renders breadcrumbs for desktop", () => {
    mockLocation.pathname = "/usuarios";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    expect(breadcrumbNav).toBeInTheDocument();
    expect(breadcrumbNav).toHaveTextContent("Usuarios");
  });

  it("renders Home breadcrumb for root path", () => {
    mockLocation.pathname = "/";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    expect(breadcrumbNav).toHaveTextContent("Home");
    const homeLink = breadcrumbNav.querySelector('a[href="/"]');
    expect(homeLink).toBeInTheDocument();
  });

  it("renders multiple breadcrumbs for nested paths", () => {
    mockLocation.pathname = "/usuarios/123/editar";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    expect(breadcrumbNav).toHaveTextContent("Usuarios");
    expect(breadcrumbNav).toHaveTextContent("123");
    expect(breadcrumbNav).toHaveTextContent("Editar");
  });

  it("renders last breadcrumb as non-link", () => {
    mockLocation.pathname = "/usuarios/123";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    const lastBreadcrumb = breadcrumbNav.querySelector("span");
    expect(lastBreadcrumb).toHaveTextContent("123");
    expect(lastBreadcrumb).toHaveClass("font-semibold");
  });

  it("renders previous breadcrumbs as links", () => {
    mockLocation.pathname = "/usuarios/123";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    const usuariosLink = breadcrumbNav.querySelector('a[href="/usuarios"]');
    expect(usuariosLink).toBeInTheDocument();
    expect(usuariosLink).toHaveTextContent("Usuarios");
  });

  it("renders mobile title for mobile view", () => {
    mockIsMobile = true;
    mockLocation.pathname = "/usuarios";
    render(<TopBar />);

    const mobileTitle = screen.getByText("Usuarios", {
      selector: "span.md\\:hidden",
    });
    expect(mobileTitle).toBeInTheDocument();
    expect(mobileTitle).toHaveClass("md:hidden");
  });

  it("renders mobile menu button when isMobile is true", () => {
    mockIsMobile = true;
    render(<TopBar />);

    const menuButton = screen.getByLabelText("Toggle menu");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass("md:hidden");
  });

  it("calls toggleSidebar when mobile menu button is clicked", async () => {
    const user = userEvent.setup();
    mockIsMobile = true;
    render(<TopBar />);

    const menuButton = screen.getByLabelText("Toggle menu");
    await user.click(menuButton);

    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("renders sidebar trigger for desktop", () => {
    render(<TopBar />);

    const sidebarTrigger = screen.getByTestId("sidebar-trigger");
    expect(sidebarTrigger).toHaveClass("hidden", "md:flex");
  });

  it("renders settings button for desktop", () => {
    render(<TopBar />);

    const settingsButton = screen.getByLabelText("Settings");
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton).toHaveClass("hidden", "md:flex");
  });

  it("renders user menu when user is available", () => {
    render(<TopBar />);

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    const avatars = screen.getAllByTestId("avatar-fallback");
    expect(avatars.length).toBeGreaterThan(0);
    expect(avatars[0]).toHaveTextContent("JD");
  });

  it("does not render user menu when user is not available", () => {
    mockUser = null as any;
    render(<TopBar />);

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("renders user information in dropdown", () => {
    render(<TopBar />);

    const dropdownContent = screen.getByTestId("dropdown-content");
    expect(dropdownContent).toHaveTextContent("John Doe");
    expect(dropdownContent).toHaveTextContent("john@example.com");

    const avatars = screen.getAllByTestId("avatar-fallback");
    expect(avatars.some((avatar) => avatar.textContent === "JD")).toBe(true);
  });

  it("renders profile menu item", () => {
    render(<TopBar />);

    const dropdownContent = screen.getByTestId("dropdown-content");
    expect(dropdownContent).toHaveTextContent("Meu Perfil");
  });

  it("calls handleProfile when profile menu item is clicked", async () => {
    const user = userEvent.setup();
    render(<TopBar />);

    const dropdownContent = screen.getByTestId("dropdown-content");
    const profileButton = dropdownContent.querySelector(
      '[data-testid="dropdown-item"]'
    );

    expect(profileButton).toHaveTextContent("Meu Perfil");
    if (profileButton) {
      await user.click(profileButton as HTMLElement);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/perfil" });
      });
    }
  });

  it("renders logout menu item", () => {
    render(<TopBar />);

    const dropdownContent = screen.getByTestId("dropdown-content");
    expect(dropdownContent).toHaveTextContent("Sair");
  });

  it("calls handleLogout when logout menu item is clicked", async () => {
    const user = userEvent.setup();
    render(<TopBar />);

    const dropdownContent = screen.getByTestId("dropdown-content");
    const logoutItems = dropdownContent.querySelectorAll(
      '[data-testid="dropdown-item"]'
    );
    const logoutButton = Array.from(logoutItems).find((item) =>
      item.textContent?.includes("Sair")
    );

    expect(logoutButton).toBeInTheDocument();
    if (logoutButton) {
      await user.click(logoutButton as HTMLElement);
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
    }
  });

  it("formats breadcrumb labels correctly", () => {
    mockLocation.pathname = "/nivel-acesso";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    expect(breadcrumbNav).toHaveTextContent("Nivel Acesso");
  });

  it("handles paths with multiple segments", () => {
    mockLocation.pathname = "/usuarios/novo-usuario";
    render(<TopBar />);

    const breadcrumbNav = screen.getByLabelText("Breadcrumb");
    expect(breadcrumbNav).toHaveTextContent("Usuarios");
    expect(breadcrumbNav).toHaveTextContent("Novo Usuario");
  });
});
