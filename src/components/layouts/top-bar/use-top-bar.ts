import * as React from "react";

import { useLocation, useNavigate } from "@tanstack/react-router";

import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { getUserInitials } from "@/utils/text";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useTopBar() {
  const { pathname } = useLocation();
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Generate breadcrumbs from pathname
  const breadcrumbs = React.useMemo<BreadcrumbItem[]>(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: "Home", href: "/" }];
    }

    const items: BreadcrumbItem[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Capitalize and format the segment
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    navigate({ to: "/perfil" });
  };

  return {
    breadcrumbs,
    isMobile,
    toggleSidebar,
    handleProfile,
    user: user
      ? {
          name: user.name,
          email: user.email,
          initials: getUserInitials(user.name),
        }
      : null,
    handleLogout,
  };
}
