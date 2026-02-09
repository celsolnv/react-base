import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTopBar } from "./use-top-bar";

// Mock do TanStack Router
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/usuarios" };

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

// Mock do useSidebar
const mockToggleSidebar = vi.fn();
let mockIsMobile = false;

const mockUseSidebar = vi.fn(() => ({
  isMobile: mockIsMobile,
  toggleSidebar: mockToggleSidebar,
}));

vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}));

// Mock do useAuth
const mockLogout = vi.fn().mockResolvedValue(undefined);
let mockUser = {
  name: "John Doe",
  email: "john@example.com",
};

const mockUseAuth = vi.fn(() => ({
  user: mockUser,
  logout: mockLogout,
}));

vi.mock("@/modules/auth/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
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

describe("useTopBar Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = "/usuarios";
    mockUser = {
      name: "John Doe",
      email: "john@example.com",
    };
    mockIsMobile = false;
  });

  it("returns correct initial values", () => {
    const { result } = renderHook(() => useTopBar());

    expect(result.current.breadcrumbs).toBeDefined();
    expect(result.current.isMobile).toBe(false);
    expect(result.current.toggleSidebar).toBe(mockToggleSidebar);
    expect(result.current.user).toBeDefined();
  });

  describe("breadcrumbs", () => {
    it("generates breadcrumbs for root path", () => {
      mockLocation.pathname = "/";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs).toEqual([
        { label: "Home", href: "/" },
      ]);
    });

    it("generates breadcrumbs for single segment path", () => {
      mockLocation.pathname = "/usuarios";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs).toEqual([
        { label: "Usuarios", href: undefined },
      ]);
    });

    it("generates breadcrumbs for multiple segments", () => {
      mockLocation.pathname = "/usuarios/123/editar";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs).toEqual([
        { label: "Usuarios", href: "/usuarios" },
        { label: "123", href: "/usuarios/123" },
        { label: "Editar", href: undefined },
      ]);
    });

    it("formats segment labels correctly", () => {
      mockLocation.pathname = "/nivel-acesso";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs[0].label).toBe("Nivel Acesso");
    });

    it("capitalizes each word in segment", () => {
      mockLocation.pathname = "/novo-usuario";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs[0].label).toBe("Novo Usuario");
    });

    it("updates breadcrumbs when pathname changes", () => {
      const { result, rerender } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs[0].label).toBe("Usuarios");

      mockLocation.pathname = "/perfil";
      rerender();

      expect(result.current.breadcrumbs[0].label).toBe("Perfil");
    });
  });

  describe("user data", () => {
    it("returns user data when user is available", () => {
      mockUser = {
        name: "John Doe",
        email: "john@example.com",
      };
      const { result } = renderHook(() => useTopBar());

      expect(result.current.user).toEqual({
        name: "John Doe",
        email: "john@example.com",
        initials: "JD",
      });
    });

    it("returns null when user is not available", () => {
      mockUser = null as any;
      const { result } = renderHook(() => useTopBar());

      expect(result.current.user).toBeNull();
    });

    it("calculates user initials correctly", () => {
      mockUser = {
        name: "Maria Silva Santos",
        email: "maria@example.com",
      };
      const { result } = renderHook(() => useTopBar());

      expect(result.current.user?.initials).toBe("MS");
    });
  });

  describe("handlers", () => {
    it("handleLogout calls logout function", async () => {
      const { result } = renderHook(() => useTopBar());

      await result.current.handleLogout();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("handleProfile navigates to profile page", () => {
      const { result } = renderHook(() => useTopBar());

      result.current.handleProfile();

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/perfil" });
    });

    it("toggleSidebar is available from useSidebar", () => {
      const { result } = renderHook(() => useTopBar());

      expect(result.current.toggleSidebar).toBe(mockToggleSidebar);
    });
  });

  describe("mobile state", () => {
    it("returns isMobile from useSidebar", () => {
      mockIsMobile = true;
      const { result } = renderHook(() => useTopBar());

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles empty pathname segments", () => {
      mockLocation.pathname = "//";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs).toEqual([
        { label: "Home", href: "/" },
      ]);
    });

    it("handles pathname with trailing slash", () => {
      mockLocation.pathname = "/usuarios/";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs[0].label).toBe("Usuarios");
    });

    it("handles very long pathnames", () => {
      mockLocation.pathname = "/a/b/c/d/e/f/g";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs.length).toBe(7);
      expect(result.current.breadcrumbs[6].href).toBeUndefined(); // Last item
    });

    it("handles special characters in pathname", () => {
      mockLocation.pathname = "/test-123_abc";
      const { result } = renderHook(() => useTopBar());

      expect(result.current.breadcrumbs[0].label).toBe("Test 123_abc");
    });
  });
});
