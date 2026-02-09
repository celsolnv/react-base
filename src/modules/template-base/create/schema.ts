import { z } from "zod";

export const create{{namePascal}}Schema = z.object({
  name: z
    .string()
    .min(1, "O nome do perfil é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export type TCreate{{namePascal}}Schema = z.infer<
  typeof create{{namePascal}}Schema
>;
