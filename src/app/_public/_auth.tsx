import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_public/_auth")({
  component: AuthLayout,
  beforeLoad: async ({ context }) => {
    const { auth } = context;

    if (auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

export default function AuthLayout() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      {/* Subtle background pattern */}
      <div className="bg-metal-gradient pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md space-y-8">
        {/* Logo and branding */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="bg-primary text-primary-foreground shadow-subtle flex h-14 w-14 items-center justify-center rounded-xl">
            <Shield className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Nome do Sistema
            </h1>
            <p className="text-muted-foreground text-sm">
              Descrição do Sistema
            </p>
          </div>
        </div>

        {/* Form content */}
        <Outlet />

        {/* Footer */}
        <p className="text-muted-foreground/60 text-center text-xs">
          &copy; {new Date().getFullYear()} Nome do Sistema. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  );
}
