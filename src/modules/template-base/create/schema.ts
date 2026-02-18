import { z } from "zod";

import * as f from "@/constants/schemas";

export const create__namePascal__Schema = z.object({
  name: f.string("Nome"),
});

export type TCreate__namePascal__Schema = z.infer<
  typeof create__namePascal__Schema
>;
