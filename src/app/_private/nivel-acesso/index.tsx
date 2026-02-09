import { createFileRoute } from "@tanstack/react-router";

import { genericListSchema } from "@/constants/schemas/list";
import {
  AccessLevelListPage,
  AccessLevelListPageSkeleton,
} from "@/modules/access-level";
import * as queries from "@/modules/access-level/queries";

const schema = genericListSchema.extend({});

export const Route = createFileRoute("/_private/nivel-acesso/")({
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
  pendingComponent: AccessLevelListPageSkeleton,
  component: AccessLevelListPage,
  pendingMs: 200,
});
