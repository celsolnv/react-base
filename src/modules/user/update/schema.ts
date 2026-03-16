import z from "zod";

import { createUserSchema } from "../create/create-user-schema";

export const updateUserSchema = createUserSchema.extend({
  existing_attachments: z.array(z.string()).optional(),
});

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
