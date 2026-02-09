import { createFileRoute } from "@tanstack/react-router";

import * as queries from "@/modules/client/http/queries";
import ClientListPage from "@/modules/client/list/client-list";
import { ClientListPageSkeleton } from "@/modules/client/list/client-list-skeleton";
import { clientListSchema } from "@/modules/client/list/schema";

export const Route = createFileRoute("/_private/clientes/")({
  validateSearch: (search) => clientListSchema.parse(search),
  loaderDeps: ({ search: { limit, page, search, type, status } }) => ({
    limit,
    page,
    search,
    type,
    status,
  }),
  loader: ({ context, deps }) => {
    return context.queryClient.ensureQueryData(queries.listQuery(deps));
  },
  pendingComponent: ClientListPageSkeleton,
  pendingMs: 0,
  component: ClientListPage,
});
