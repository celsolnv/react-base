import z from "zod";

import * as f from "@/constants/schemas";

export const loginSchema = z.object({
  email: f.email("E-mail"),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
