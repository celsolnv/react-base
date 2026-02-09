import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMobileBottomNav } from "./use-mobile-bottom-nav";

// Mock do TanStack Router
const mockLocation = { pathname: "/dashboard" };

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => mockLocation,
}));

// Mock do useSidebar
const mockToggleSidebar = vi.fn();
vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({
    toggleSidebar: mockToggleSidebar,
  }),
}));

describe("useMobileBottomNav Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = "/dashboard";
  });

  it("returns correct initial values", () => {
    const { result } = renderHook(() => useMobileBottomNav());

    expect(result.current.leftNavItems).toBeDefined();
    expect(result.current.rightNavItems).toBeDefined();
    expect(result.current.isActiveRoute).toBeDefined();
    expect(result.current.toggleSidebar).toBe(mockToggleSidebar);
  });

  describe("navigation items", () => {
    it("splits items into left and right correctly", () => {
      const { result } = renderHook(() => useMobileBottomNav());

      expect(result.current.leftNavItems).toHaveLength(2);
      expect(result.current.leftNavItems[0].title).toBe("Home");
      expect(result.current.leftNavItems[1].title).toBe("Frota");

      expect(result.current.rightNavItems).toHaveLength(1);
      expect(result.current.rightNavItems[0].title).toBe("Reserva");
    });

    it("leftNavItems contains first two items", () => {
      const { result } = renderHook(() => useMobileBottomNav());

      expect(result.current.leftNavItems[0].href).toBe("/dashboard");
      expect(result.current.leftNavItems[1].href).toBe("/frota");
    });

    it("rightNavItems contains remaining items", () => {
      const { result } = renderHook(() => useMobileBottomNav());

      expect(result.current.rightNavItems[0].href).toBe("/reservas");
    });
  });

  describe("isActiveRoute", () => {
    it("returns true when pathname matches exactly", () => {
      mockLocation.pathname = "/dashboard";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(true);
    });

    it("returns true when pathname starts with href", () => {
      mockLocation.pathname = "/dashboard/123";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(true);
    });

    it("returns false when pathname does not match", () => {
      mockLocation.pathname = "/frota";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(false);
    });

    it("returns false when pathname is completely different", () => {
      mockLocation.pathname = "/usuarios";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(false);
    });

    it("handles root path correctly", () => {
      mockLocation.pathname = "/";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/",
        icon: {} as any,
      });

      expect(isActive).toBe(true);
    });

    it("handles nested paths correctly", () => {
      mockLocation.pathname = "/frota/veiculos/123";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Frota",
        href: "/frota",
        icon: {} as any,
      });

      expect(isActive).toBe(true);
    });

    it("returns false for similar but different paths", () => {
      mockLocation.pathname = "/dashboard-old";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(false);
    });
  });

  describe("toggleSidebar", () => {
    it("provides toggleSidebar function from useSidebar", () => {
      const { result } = renderHook(() => useMobileBottomNav());

      expect(result.current.toggleSidebar).toBe(mockToggleSidebar);
      expect(typeof result.current.toggleSidebar).toBe("function");
    });
  });

  describe("edge cases", () => {
    it("handles empty pathname", () => {
      mockLocation.pathname = "";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(false);
    });

    it("handles pathname with trailing slash", () => {
      mockLocation.pathname = "/dashboard/";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      expect(isActive).toBe(true);
    });

    it("handles case sensitivity", () => {
      mockLocation.pathname = "/Dashboard";
      const { result } = renderHook(() => useMobileBottomNav());

      const isActive = result.current.isActiveRoute({
        title: "Home",
        href: "/dashboard",
        icon: {} as any,
      });

      // Should be case-sensitive
      expect(isActive).toBe(false);
    });
  });
});
