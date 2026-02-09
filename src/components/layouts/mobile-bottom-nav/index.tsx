"use client";

import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { useMobileBottomNav } from "./use-mobile-bottom-nav";

interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className }: Readonly<MobileBottomNavProps>) {
  const { leftNavItems, rightNavItems, isActiveRoute, toggleSidebar } =
    useMobileBottomNav();

  return (
    <nav
      className={cn(
        "border-border bg-background pb-safe fixed inset-x-0 bottom-0 z-50 border-t md:hidden",
        className
      )}
    >
      <div className="relative flex h-20 items-center justify-around px-2">
        {/* Left Navigation Items */}
        {leftNavItems.map((item) => {
          const isActive = isActiveRoute(item);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex w-16 flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <span className="bg-foreground shadow-glow absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full" />
              )}
              <item.icon className="size-6" />
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "font-bold" : "font-medium"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}

        {/* Right Navigation Items */}
        {rightNavItems.map((item) => {
          const isActive = isActiveRoute(item);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex w-16 flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <span className="bg-foreground shadow-glow absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full" />
              )}
              <item.icon className="size-6" />
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "font-bold" : "font-medium"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}

        {/* Menu Button */}
        <button
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground flex w-16 flex-col items-center gap-1 p-2 transition-colors"
          aria-label="Menu"
        >
          <Menu className="size-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

      {/* Home Indicator (iOS style) */}
      <div className="bg-foreground/20 absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full" />
    </nav>
  );
}
