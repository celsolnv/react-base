import { createFileRoute } from "@tanstack/react-router";

import CreateUserPage from "@/modules/user/create/create-user-page";

export const Route = createFileRoute("/_private/usuarios/criar")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateUserPage />;
}
