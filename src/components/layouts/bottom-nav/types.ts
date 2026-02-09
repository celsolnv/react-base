import * as React from "react";

export interface BottomNavAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export interface BottomNavLeftAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BottomNavProps {
  leftAction?: BottomNavLeftAction;
  rightActions?: BottomNavAction[];
  className?: string;
}

export interface BottomNavContextValue {
  setBottomNav: (
    props: {
      leftAction?: BottomNavLeftAction;
      rightActions?: BottomNavAction[];
    } | null
  ) => void;
  isActive: boolean;
}
