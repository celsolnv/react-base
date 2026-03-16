import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { InvalidLinkError } from "@/modules/auth/components/invalid-link-error";
import * as queries from "@/modules/auth/http/queries/validate-code";
import { ResetPasswordPage } from "@/modules/auth/reset-password/reset-password-page";

const schema = z.object({
  code: z.string().min(1),
});

function ResetPasswordRoute() {
  const { code } = Route.useSearch();
  return <ResetPasswordPage code={code} />;
}

export const Route = createFileRoute("/_public/_auth/redefinir-senha/")({
  validateSearch: (search) => schema.parse(search),
  loaderDeps: ({ search: { code } }) => ({ code }),
  loader: async ({ context, deps: { code } }) => {
    const { queryClient } = context;

    await queryClient.fetchQuery(queries.validateCodeQuery(code));
  },
  errorComponent: InvalidLinkError,
  component: ResetPasswordRoute,
});
