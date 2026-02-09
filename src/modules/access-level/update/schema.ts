// Reutiliza o mesmo schema de criação
export {
  type TCreateAccessLevelSchema as TUpdateAccessLevelSchema,
  createAccessLevelSchema as updateAccessLevelSchema,
} from "../create/schema";
