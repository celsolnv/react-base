import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/modules/auth/login/login-page";

export const Route = createFileRoute("/_public/_auth/login/")({
  component: LoginPage,
});
