import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordPage } from "@/modules/auth/forgot-password/forgot-password-page";

export const Route = createFileRoute("/_public/_auth/esqueci-senha/")({
  component: ForgotPasswordPage,
});
