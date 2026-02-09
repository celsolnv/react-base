import z from "zod";

import * as f from "@/constants/schemas";

import { createUserSchema } from "./create-schema";

export const updateUserSchema = createUserSchema.extend({
  password: f.password
    .nullable()
    .transform((val) => val ?? null)
    .optional(),

  existing_attachments: z.array(z.string()).optional(),
});

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
