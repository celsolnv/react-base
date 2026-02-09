import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppLayout } from "@/components/layouts/app-layout";

export const Route = createFileRoute("/_private")({
  // O beforeLoad executa ANTES de renderizar o componente
  beforeLoad: ({ context, location }) => {
    const ctx = context;
    // Verifica se NÃO está autenticado
    if (!ctx.auth?.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: PrivateLayout,
});

function PrivateLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
