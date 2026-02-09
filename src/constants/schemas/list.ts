import { z } from "zod";

import * as f from "@/constants/schemas";

export const genericListSchema = z.object({
  limit: f.numberTransform("limit").default(10),
  page: f.numberTransform("page").default(1),
  search: f.text("search").default(""),
  is_active: f.string("is_active").default("all"),
});

export type TGenericListSchema = z.infer<typeof genericListSchema>;
