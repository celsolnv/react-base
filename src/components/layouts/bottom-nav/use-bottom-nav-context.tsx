"use client";

import * as React from "react";

import { BottomNav } from "./index";
import type { BottomNavAction, BottomNavLeftAction } from "./types";
import { BottomNavContext } from "./use-bottom-nav";

// Re-export types for convenience
export type { BottomNavAction, BottomNavLeftAction } from "./types";

interface IBottomNavProviderProps {
  children: React.ReactNode;
}

export function BottomNavProvider({
  children,
}: Readonly<IBottomNavProviderProps>) {
  const [bottomNavProps, setBottomNavProps] = React.useState<{
    leftAction?: BottomNavLeftAction;
    rightActions?: BottomNavAction[];
  } | null>(null);

  const setBottomNav = React.useCallback(
    (
      props: {
        leftAction?: BottomNavLeftAction;
        rightActions?: BottomNavAction[];
      } | null
    ) => {
      setBottomNavProps(props);
    },
    []
  );

  const isActive = React.useMemo(() => {
    return !!(
      bottomNavProps?.leftAction ||
      (bottomNavProps?.rightActions && bottomNavProps.rightActions.length > 0)
    );
  }, [bottomNavProps]);

  const contextValue = React.useMemo(
    () => ({ setBottomNav, isActive }),
    [setBottomNav, isActive]
  );

  return (
    <BottomNavContext.Provider value={contextValue}>
      {children}
      <BottomNav {...bottomNavProps} />
    </BottomNavContext.Provider>
  );
}
