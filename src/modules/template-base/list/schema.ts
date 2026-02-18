import { z } from "zod";

import { genericListSchema } from "@/constants/schemas/list";

export const list__namePascal__Schema = genericListSchema.extend({});

export type TList__namePascal__Schema = z.infer<
  typeof list__namePascal__Schema
>;
