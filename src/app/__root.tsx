import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { GlobalErrorComponent } from "@/components/layouts/global-error";
import NotFound from "@/components/layouts/not-found";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { authQueries } from "@/modules/auth/queries/auth-queries";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { ThemeProvider } from "@/providers/theme";

import "@fontsource-variable/manrope";

export interface IRouterContext {
  auth: {
    isAuthenticated: boolean;
  };
  queryClient: QueryClient;
}

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Outlet />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
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
