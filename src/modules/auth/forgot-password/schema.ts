import { z } from "zod";

import * as f from "@/constants/schemas";

export const forgotPasswordSchema = z.object({
  email: f.email("E-mail"),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
