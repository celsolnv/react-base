import { createFileRoute } from "@tanstack/react-router";

import { FakePage } from "@/components/layouts/fake-page";

export const Route = createFileRoute("/_private/")({
  component: FakePage,
});
