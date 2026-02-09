import { useLocation } from "@tanstack/react-router";

import { useSidebar } from "@/components/ui/sidebar";

import { type MobileNavItem, mobileNavItems } from "./nav-data";

export function useMobileBottomNav() {
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();

  const isActiveRoute = (item: MobileNavItem): boolean => {
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  const leftNavItems = mobileNavItems.slice(0, 2);
  const rightNavItems = mobileNavItems.slice(2);

  return {
    leftNavItems,
    rightNavItems,
    isActiveRoute,
    toggleSidebar,
  };
}
