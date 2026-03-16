import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { GlobalErrorComponent } from "@/components/layouts/global-error";
import NotFound from "@/components/layouts/not-found";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authQueries } from "@/modules/auth/http/queries/auth-queries";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { ThemeProvider } from "@/providers/theme";
import type { IUser } from "@/types";

import "@fontsource-variable/manrope";

export interface IRouterContext {
  auth: {
    isAuthenticated: boolean;
  };
  queryClient: QueryClient;
  user: IUser | null;
}

const RootLayout = () => {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Outlet />
          <Toaster position="bottom-right" />
          <ConfirmDialog />
        </ThemeProvider>
      </TooltipProvider>
    </>
  );
};

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: GlobalErrorComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const token = useAuthStore.getState().accessToken;

    if (token) {
      try {
        await queryClient.ensureQueryData(authQueries.userOptions());
      } catch (error) {
        useAuthStore.getState().clearSession();
        console.error(error);
      }
    }
  },
});
