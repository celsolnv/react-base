import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/modules/login/login-page";

export const Route = createFileRoute("/_public/_auth/login/")({
  component: LoginPage,
});
