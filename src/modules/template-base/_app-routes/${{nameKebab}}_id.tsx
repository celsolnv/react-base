import { createFileRoute } from "@tanstack/react-router";

import * as api from "@/modules/{{nameKebab}}/http/api";
import  {{namePascal}}UpdatePage  from "@/modules/{{nameKebab}}/update/{{nameKebab}}-update";

export const Route = createFileRoute(
  "/_private/{{nameKebab}}/${{nameKebab}}_id"
)({
  component: {{namePascal}}UpdatePage,
  loader: async ({ params }) => {
    const data = await api.show(params["{{nameKebab}}_id"]);
    return data;
  },
});
