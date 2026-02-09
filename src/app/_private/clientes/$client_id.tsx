import { createFileRoute } from "@tanstack/react-router";

import * as api from "@/modules/client/http/api";
import ClientUpdatePage from "@/modules/client/update/client-update";

export const Route = createFileRoute("/_private/clientes/$client_id")({
  component: ClientUpdatePage,
  loader: async ({ params }) => {
    const data = await api.show(params["client_id"]);
    return data;
  },
});
