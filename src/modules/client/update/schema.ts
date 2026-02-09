import z from "zod";

import * as f from "@/constants/schemas";

import { createClientSchema } from "../create/schema";

export const updateClientSchema = createClientSchema.extend({
  password: f.password
    .nullable()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

export type TUpdateClientSchema = z.infer<typeof updateClientSchema>;

export type TUpdateClientPayload = Omit<
  TUpdateClientSchema,
  "individual_details"
> & {
  individual_details?:
    | (Omit<
        NonNullable<TUpdateClientSchema["individual_details"]>,
        "is_international"
      > & {
        is_international: boolean;
      })
    | null;
};
