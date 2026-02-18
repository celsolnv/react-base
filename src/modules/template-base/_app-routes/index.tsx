import { createFileRoute } from "@tanstack/react-router";

import * as queries from "@/modules/__nameKebab__/http/queries";
import __namePascal__ListPage from "@/modules/__nameKebab__/list/__nameKebab__-list";
import { __namePascal__ListPageSkeleton } from "@/modules/__nameKebab__/list/__nameKebab__-list-skeleton";
import { list__namePascal__Schema } from "@/modules/__nameKebab__/list/schema";

const schema = list__namePascal__Schema;

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
  pendingComponent: __namePascal__ListPageSkeleton,
  pendingMs: 0,
  component: __namePascal__ListPage,
});
