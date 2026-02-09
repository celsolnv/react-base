import z from "zod";

import { genericListSchema } from "@/constants/schemas/list";

export const userListSchema = genericListSchema.extend({
  sector_id: z.array(z.string()).optional(),
});

export type TUserListSchema = z.infer<typeof userListSchema>;
