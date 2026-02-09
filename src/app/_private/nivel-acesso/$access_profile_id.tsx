import { createFileRoute } from "@tanstack/react-router";

import * as api from "@/modules/access-level/api";
import UpdateAccessLevelPage from "@/modules/access-level/update/access-level-update-page";

export const Route = createFileRoute(
  "/_private/nivel-acesso/$access_profile_id"
)({
  loader: async ({ params }) => {
    const [accessProfile, permissions] = await Promise.all([
      api.show(params.access_profile_id),
      api.getPermissions(),
    ]);

    return {
      accessProfile,
      permissions,
    };
  },
  staticData: { title: "Editar Perfil de Acesso" },
  component: UpdateAccessLevelPage,
});
