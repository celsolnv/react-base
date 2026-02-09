"use client";

import * as React from "react";

import { ArrowLeft } from "lucide-react";

import { Button, useSidebar } from "@/components/shadcn";
import { cn } from "@/lib/utils";

import type { BottomNavProps } from "./types";

export function BottomNav({
  leftAction,
  rightActions,
  className,
}: Readonly<BottomNavProps>) {
  const { state, isMobile } = useSidebar();

  // Calcular left offset baseado no estado da sidebar
  const leftOffset = React.useMemo(() => {
    if (isMobile) return "0";
    if (state === "collapsed") return "var(--sidebar-width-icon)";
    return "var(--sidebar-width)";
  }, [state, isMobile]);

  if (!leftAction && (!rightActions || rightActions.length === 0)) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-border bg-card fixed right-0 bottom-0 z-50 h-20 border-t",
        "transition-[left] duration-200 ease-linear",
        className
      )}
      style={{ left: leftOffset }}
    >
      <div className="flex h-full items-center justify-between px-6">
        {leftAction && (
          <Button
            type="button"
            variant="ghost"
            onClick={leftAction.onClick}
            disabled={leftAction.disabled}
            className="text-foreground/70 hover:text-foreground hover:bg-secondary/50 disabled:opacity-50"
          >
            {leftAction.icon || <ArrowLeft className="mr-2 h-4 w-4" />}
            {leftAction.label}
          </Button>
        )}

        {rightActions && rightActions.length > 0 && (
          <div className="flex gap-3">
            {rightActions.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
                className={cn(
                  action.variant === "outline" &&
                    "border-border hover:bg-secondary/50",
                  "disabled:opacity-50"
                )}
              >
                {action.loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {action.label}
                  </>
                ) : (
                  <>
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
