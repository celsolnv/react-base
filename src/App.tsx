import {
  type QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { authQueries } from "./modules/auth/http/queries/auth-queries";
import { useAuthStore } from "./modules/auth/store/auth-store";
import type { router } from "./main";

interface IAppProps {
  router: typeof router;
  queryClient: QueryClient;
}

export function App({ router, queryClient }: Readonly<IAppProps>) {
  return (
    // O Provider deve ser o nível mais alto para permitir o uso de hooks abaixo dele
    <QueryClientProvider client={queryClient}>
      <InnerApp router={router} queryClient={queryClient} />
    </QueryClientProvider>
  );
}

function InnerApp({ router, queryClient }: Readonly<IAppProps>) {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Busca o user diretamente (sem useAuth) pois ainda estamos fora do RouterProvider
  const { data: user } = useQuery({
    ...authQueries.userOptions(),
    enabled: !!accessToken,
  });

  const auth = {
    isAuthenticated: !!accessToken,
  };

  return (
    <RouterProvider
      router={router}
      context={{
        auth,
        user: user ?? null,
        queryClient,
      }}
    />
  );
}
