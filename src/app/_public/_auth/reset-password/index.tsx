import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { InvalidLinkError } from "@/modules/reset-password/components/invalid-link-error";
import * as queries from "@/modules/reset-password/queries";
import { ResetPasswordPage } from "@/modules/reset-password/reset-password-page";

const schema = z.object({
  code: z.string().min(1),
});

function ResetPasswordRoute() {
  const { code } = Route.useSearch();
  return <ResetPasswordPage code={code} />;
}

export const Route = createFileRoute("/_public/_auth/reset-password/")({
  validateSearch: (search) => schema.parse(search),
  loaderDeps: ({ search: { code } }) => ({ code }),
  loader: async ({ context, deps: { code } }) => {
    const { queryClient } = context;

    await queryClient.fetchQuery(queries.validateCodeQuery(code));
  },
  errorComponent: InvalidLinkError,
  component: ResetPasswordRoute,
});
