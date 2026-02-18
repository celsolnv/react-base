import type z from "zod";

import { create__namePascal__Schema } from "../create/schema";

export const update__namePascal__Schema = create__namePascal__Schema.extend({});

export type TUpdate__namePascal__Schema = z.input<
  typeof update__namePascal__Schema
>;

// Aqui é pra o caso de termos divergencias entre o schema de input e output
// Por exemplo, ter um campo de image_url que é uma URL e o schema de input é um arquivo
export type TUpdate__namePascal__SchemaApi = z.output<
  typeof update__namePascal__Schema
>;
