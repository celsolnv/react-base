import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/shadcn";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  collapsed?: boolean;
}

export function ModeToggle({
  className,
  variant = "ghost",
  collapsed = false,
}: Readonly<ModeToggleProps>) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant={variant}
      size={collapsed ? "icon" : "default"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative transition-colors",
        collapsed ? "w-full justify-center" : "w-full justify-start",
        className
      )}
      aria-label="Alternar tema"
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      <div className="relative size-5 shrink-0">
        <Sun className="absolute inset-0 size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute inset-0 size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </div>
      {!collapsed && (
        <span className="ml-2 text-sm">
          {theme === "light" ? "Modo Escuro" : "Modo Claro"}
        </span>
      )}
    </Button>
  );
}
