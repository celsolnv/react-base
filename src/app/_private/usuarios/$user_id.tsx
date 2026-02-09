import { createFileRoute } from "@tanstack/react-router";

import * as api from "@/modules/user/http/api";
import UpdateUserPage from "@/modules/user/update/user-update-page";

export const Route = createFileRoute("/_private/usuarios/$user_id")({
  component: UpdateUserPage,
  loader: async ({ params }) => {
    const user = await api.show(params.user_id);
    return { user };
  },
});
