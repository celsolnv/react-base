import type z from "zod";

import { genericListSchema } from "@/constants/schemas/list";

export const accessLevelListSchema = genericListSchema.extend({});

export type TAccessLevelListSchema = z.infer<typeof accessLevelListSchema>;
