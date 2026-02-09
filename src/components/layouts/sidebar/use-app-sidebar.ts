import { useLocation } from "@tanstack/react-router";

import { useSidebar } from "@/components/shadcn";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { getUserInitials } from "@/utils/text";

import { navigationData, type NavItem } from "./nav-data";

export function useAppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const { user, logout } = useAuth();

  const isCollapsed = state === "collapsed";

  const isActiveRoute = (item: NavItem): boolean => {
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  const handleLogout = async () => {
    await logout();
  };

  return {
    navigationData,
    isCollapsed,
    pathname,
    user: user
      ? {
          name: user.name,
          email: user.email,
          initials: getUserInitials(user.name),
        }
      : null,
    isActiveRoute,
    handleLogout,
  };
}
