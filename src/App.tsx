import type { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { useAuthStore } from "./modules/auth/store/auth-store";
import type { router } from "./main";

interface IAppProps {
  router: typeof router;
  queryClient: QueryClient;
}
export function App({ router, queryClient }: Readonly<IAppProps>) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const auth = {
    isAuthenticated: !!accessToken,
  };

  return (
    <RouterProvider
      router={router}
      context={{
        auth,
        queryClient,
      }}
    />
  );
}
