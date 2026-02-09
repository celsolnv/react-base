import { createFileRoute } from "@tanstack/react-router";

import { UserListPage, UserListPageSkeleton } from "@/modules/user";
import { userListSchema } from "@/modules/user/constants/list-schema";
import * as queries from "@/modules/user/http/queries";

export const Route = createFileRoute("/_private/usuarios/")({
  validateSearch: (search) => userListSchema.parse(search),
  loaderDeps: ({ search: { limit, page, search, is_active, sector_id } }) => ({
    limit,
    page,
    search,
    is_active,
    sector_id,
  }),
  loader: ({ context, deps }) => {
    return context.queryClient.ensureQueryData(queries.listQuery(deps));
  },
  pendingComponent: UserListPageSkeleton,
  pendingMs: 200,
  component: RouteComponent,
});

function RouteComponent() {
  return <UserListPage />;
}
