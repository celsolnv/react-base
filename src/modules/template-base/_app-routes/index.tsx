import { createFileRoute } from "@tanstack/react-router";

import { genericListSchema } from "@/constants/schemas/list";
import * as queries from "@/modules/{{nameKebab}}/http/queries";
import  {{namePascal}}ListPage from "@/modules/{{nameKebab}}/list/{{nameKebab}}-list";
import { {{namePascal}}ListPageSkeleton } from "@/modules/{{nameKebab}}/list/{{nameKebab}}-list-skeleton";

const schema = genericListSchema.extend({});

export const Route = createFileRoute("/_private/usuarios/")({
  validateSearch: (search) => schema.parse(search),
  loaderDeps: ({ search: { limit, page, search, is_active } }) => ({
    limit,
    page,
    search,
    is_active,
  }),
  loader: ({ context, deps }) => {
    return context.queryClient.ensureQueryData(queries.listQuery(deps));
  },
  pendingComponent: {{namePascal}}ListPageSkeleton,
  pendingMs: 0,
  component: {{namePascal}}ListPage,
});
