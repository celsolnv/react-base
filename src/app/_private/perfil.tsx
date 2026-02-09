import { createFileRoute } from "@tanstack/react-router";

import { FakePage } from "@/components/layouts/fake-page";

export const Route = createFileRoute("/_private/perfil")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FakePage />;
}
