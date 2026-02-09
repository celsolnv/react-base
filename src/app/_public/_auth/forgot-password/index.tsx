import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordPage } from "@/modules/forgot-password/forgot-password-page";

export const Route = createFileRoute("/_public/_auth/forgot-password/")({
  component: ForgotPasswordPage,
});
