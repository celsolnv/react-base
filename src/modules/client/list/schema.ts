import z from "zod";

import { genericListSchema } from "@/constants/schemas/list";

import { clientStatusOptions, clientTypeOptions } from "../constants/options";

export const clientListSchema = genericListSchema
  .omit({ is_active: true })
  .extend({
    type: z
      .enum(
        [{ value: "all", label: "Todos" }, ...clientTypeOptions].map(
          (option) => option.value
        )
      )
      .optional()
      .default("all"),
    status: z
      .enum(
        [{ value: "all", label: "Todos" }, ...clientStatusOptions].map(
          (option) => option.value
        )
      )
      .optional()
      .default("all"),
  });

export type TClientListSchema = z.infer<typeof clientListSchema>;
