import { createFileRoute } from "@tanstack/react-router";

import { getPermissions } from "@/modules/access-level/api";
import CreateAccessLevelPage from "@/modules/access-level/create/create-access-level-page";

export const Route = createFileRoute("/_private/nivel-acesso/criar")({
  loader: async () => {
    const permissions = await getPermissions();
    return {
      permissions,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateAccessLevelPage />;
}
