import { createFileRoute } from "@tanstack/react-router";

import * as api from "@/modules/__nameKebab__/http/api";
import  __namePascal__UpdatePage  from "@/modules/__nameKebab__/update/__nameKebab__-update";

export const Route = createFileRoute(
  "/_private/__nameKebab__/$__nameKebab___id"
)({
  component: __namePascal__UpdatePage,
  loader: async ({ params }) => {
    const data = await api.show(params["__nameKebab___id"]);
    return data;
  },
});
