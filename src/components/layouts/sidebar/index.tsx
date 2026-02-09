import * as React from "react";

import { Link } from "@tanstack/react-router";
import { LogOut, Shield } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/shadcn";
import { cn } from "@/lib/utils";

import { ModeToggle } from "../mode-toggle";
import { useAppSidebar } from "./use-app-sidebar";

export function AppSidebar() {
  const { navigationData, isCollapsed, user, isActiveRoute, handleLogout } =
    useAppSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-sidebar-border **:data-[sidebar=sidebar]:bg-card border-r",
        isCollapsed && "border-r-0"
      )}
    >
      {/* Header with Logo */}
      <SidebarHeader
        className={cn(
          "border-sidebar-border/50 h-20 border-b",
          "flex-row items-center gap-0 p-0",
          isCollapsed ? "justify-center px-1" : "justify-start px-6"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="bg-primary text-primary-foreground shadow-glow flex size-8 shrink-0 items-center justify-center rounded">
            <Shield className="size-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-bold tracking-wide">
                Nome do Sistema
              </span>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
                Descrição do Sistema
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent
        className={cn(
          "scrollbar-hide",
          isCollapsed ? "px-1 py-4" : "px-3 py-6"
        )}
      >
        {navigationData.map((section, sectionIndex) => (
          <React.Fragment key={section.title}>
            <SidebarGroup className={cn(isCollapsed ? "p-1" : "p-0")}>
              <SidebarGroupLabel
                className={cn(
                  "text-muted-foreground text-[10px] font-bold tracking-widest uppercase",
                  isCollapsed ? "hidden" : "mb-2 px-3"
                )}
              >
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent className={cn(isCollapsed && "p-0")}>
                <SidebarMenu className={cn(!isCollapsed && "mb-4 space-y-1")}>
                  {section.items.map((item) => {
                    const isActive = isActiveRoute(item);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "group relative transition-all",
                            !isCollapsed && "gap-3 px-3 py-2.5",
                            isActive && [
                              "bg-foreground/10 text-foreground font-bold",
                              "border-foreground/5 shadow-subtle border",
                            ]
                          )}
                        >
                          <Link
                            to={item.href}
                            className={cn(
                              "flex w-full items-center",
                              isCollapsed && "justify-center"
                            )}
                          >
                            {isActive && !isCollapsed && (
                              <div className="from-foreground/5 absolute inset-0 rounded-md bg-linear-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                            <item.icon
                              className={cn(
                                "size-5 shrink-0 transition-colors",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                            {!isCollapsed && <span>{item.title}</span>}
                            {item.badge && !isCollapsed && (
                              <SidebarMenuBadge className="bg-background/40 text-muted-foreground ml-auto rounded px-1.5 py-0.5 font-mono text-[10px]">
                                {item.badge}
                              </SidebarMenuBadge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {sectionIndex < navigationData.length - 1 && (
              <div className={cn(isCollapsed ? "my-2" : "-mx-3 my-4")}>
                <SidebarSeparator
                  className={cn(isCollapsed ? "mx-0" : "mx-0 w-full")}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </SidebarContent>

      {/* Footer with Theme Toggle and User */}
      <SidebarFooter
        className={cn(
          "border-sidebar-border/50 shrink-0 border-t",
          "flex flex-col gap-2",
          isCollapsed ? "px-1 py-2" : "px-4 py-3"
        )}
      >
        {/* Theme Toggle */}
        <div className={cn("w-full", isCollapsed && "flex justify-center")}>
          <ModeToggle
            collapsed={isCollapsed}
            className={cn("w-full", isCollapsed && "justify-center")}
          />
        </div>

        {/* User Info */}
        {user && (
          <div
            className={cn(
              "group hover:bg-foreground/5 h-auto w-full rounded-md transition-colors",
              !isCollapsed && "flex items-center gap-3 p-2",
              isCollapsed && "flex items-center justify-center p-2"
            )}
            title={user.name}
          >
            <Avatar
              className={cn(
                "border-foreground/10 size-9 shrink-0 border",
                isCollapsed && "mx-auto"
              )}
            >
              <AvatarFallback className="bg-muted text-xs">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-foreground truncate text-sm font-bold">
                    {user.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Sair"
                  className="text-muted-foreground hover:text-foreground size-[18px] transition-colors hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  aria-label="Sair"
                >
                  <LogOut className="size-[18px]" />
                </Button>
              </>
            )}
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
