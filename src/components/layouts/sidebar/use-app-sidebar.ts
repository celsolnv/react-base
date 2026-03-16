import { useMemo } from "react";

import { useLocation } from "@tanstack/react-router";

import { usePermission } from "@/hooks/use-permission";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useSidebar } from "@/ui/sidebar";
import { getUserInitials } from "@/utils/text";

import { type INavItem, type INavSection, navigationData } from "./nav-data";

export function useAppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { can } = usePermission();

  const isCollapsed = state === "collapsed";

  const isActiveRoute = (item: INavItem): boolean => {
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  };

  const handleLogout = async () => {
    await logout();
  };

  /**
   * Filtra os itens de navegação baseado nas permissões do usuário.
   * Remove itens sem permissão e seções que ficarem vazias.
   */
  const filteredNavigation = useMemo<INavSection[]>(() => {
    return navigationData
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          // Se o item não tem permissão definida, mostra sempre
          if (!item.permission) return true;

          // Se tem permissão definida, verifica se o usuário tem acesso
          return can(item.permission);
        }),
      }))
      .filter((section) => section.items.length > 0); // Remove seções vazias
  }, [can]);

  return {
    navigationData: filteredNavigation,
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
