import { useCallback } from "react";

import { useAuth } from "@/modules/auth/hooks/use-auth";

export function usePermission() {
  const { user } = useAuth();

  const can = useCallback(
    (permissionSlug: string): boolean => {
      if (!user?.permissions) return false;

      return user?.permissions?.includes(permissionSlug);
    },
    [user]
  );

  const canAll = useCallback(
    (permissions: string[]) => {
      return permissions.every((p) => can(p));
    },
    [can]
  );

  return { can, canAll };
}
