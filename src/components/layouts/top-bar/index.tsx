import { Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, Menu, Settings, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  SidebarTrigger,
} from "@/components/shadcn";
import { cn } from "@/lib/utils";

import { useTopBar } from "./use-top-bar";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: Readonly<TopBarProps>) {
  const {
    breadcrumbs,
    isMobile,
    toggleSidebar,
    user,
    handleLogout,
    handleProfile,
  } = useTopBar();

  return (
    <header
      className={cn(
        "border-border bg-card z-30 flex h-20 w-full shrink-0 items-center justify-between border-b px-6",
        className
      )}
    >
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Desktop Sidebar Toggle */}
        <SidebarTrigger className="hidden md:flex" />

        <Separator orientation="vertical" className="hidden h-6 md:block" />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden md:block">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={item.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="text-muted-foreground size-3.5" />
                  )}
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        isLast
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile Title */}
        <span className="text-foreground text-sm font-semibold md:hidden">
          {breadcrumbs[breadcrumbs.length - 1]?.label}
        </span>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-4">
        <Separator orientation="vertical" className="hidden h-6 md:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-secondary/50 relative ml-2 size-8 rounded-full p-0 transition-colors"
                >
                  <Avatar className="border-foreground/10 size-8 border">
                    <AvatarFallback className="bg-muted text-xs">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-0">
                {/* Header com perfil destacado */}
                <div className="border-border bg-card flex items-center gap-3 border-b px-4 py-4">
                  <Avatar className="border-foreground/10 size-11 border">
                    <AvatarFallback className="bg-secondary text-sm font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  <DropdownMenuItem
                    className="focus:bg-secondary/50 cursor-pointer gap-3 px-3 py-2.5 text-sm"
                    onClick={handleProfile}
                  >
                    <User className="text-muted-foreground size-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-3 px-3 py-2.5 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
