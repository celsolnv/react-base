import { createFileRoute } from "@tanstack/react-router";

import {{namePascal}}CreatePage from "@/modules/{{nameKebab}}/create/{{nameKebab}}-create";

export const Route = createFileRoute("/_private/{{nameKebab}}/criar")({
  component: {{namePascal}}CreatePage,
});
