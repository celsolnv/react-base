// Reutiliza o mesmo schema de criação
export {
  create{{namePascal}}Schema as update{{namePascal}}Schema,
} from "../create/schema";


export const update{{namePascal}}Schema = create{{namePascal}}Schema.extend({
  // password: f.password.optional().nullable(),
});

export type TUpdate{{namePascal}}Schema = z.infer<typeof update{{namePascal}}Schema>;