import { createFileRoute } from "@tanstack/react-router";

import ClientCreatePage from "@/modules/client/create/client-create";

export const Route = createFileRoute("/_private/clientes/criar")({
  component: ClientCreatePage,
});
