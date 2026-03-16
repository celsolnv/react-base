import type { ReactNode } from "react";

import { usePermission } from "@/hooks/use-permission";

interface ICanProps {
  I: string; // A permissão (ex: "client:delete")
  children: ReactNode;
  fallback?: ReactNode; // O que mostrar se não tiver permissão (ex: null ou cadeado)
}

export function Can({ I, children, fallback = null }: Readonly<ICanProps>) {
  const { can } = usePermission();

  if (!can(I)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
