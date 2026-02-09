import { describe, expect, it } from "vitest";

import { getMessageError } from "./check";

describe("submitForm/check", () => {
  describe("getMessageError", () => {
    it("should return empty string when name has only one part (no dots)", () => {
      const error = {
        field: { message: "Error message" },
      };

      expect(getMessageError("field", error)).toBe("");
    });

    it("should return error[key].message when it exists", () => {
      const error = {
        items: { message: "Items error" },
      };

      expect(getMessageError("items.0.field", error)).toBe("Items error");
    });

    it("should return empty string when error[key] does not exist", () => {
      const error = {
        other: { message: "Other error" },
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should return empty string when error[key][index] does not exist", () => {
      const error = {
        items: [],
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should return error[key][index][field].message when it exists", () => {
      const error = {
        items: [
          {
            field: { message: "Field error message" },
          },
        ],
      };

      expect(getMessageError("items.0.field", error)).toBe(
        "Field error message"
      );
    });

    it("should return undefined when error[key][index][field] does not exist", () => {
      const error = {
        items: [
          {
            otherField: { message: "Other field error" },
          },
        ],
      };

      // error[key][index][field] é undefined, então .message retorna undefined
      expect(getMessageError("items.0.field", error)).toBeUndefined();
    });

    it("should return undefined when error[key][index][field].message is undefined", () => {
      const error = {
        items: [
          {
            field: {},
          },
        ],
      };

      // error[key][index][field] existe mas .message é undefined
      expect(getMessageError("items.0.field", error)).toBeUndefined();
    });

    it("should handle different index values", () => {
      const error = {
        items: [
          { field: { message: "First error" } },
          { field: { message: "Second error" } },
          { field: { message: "Third error" } },
        ],
      };

      expect(getMessageError("items.0.field", error)).toBe("First error");
      expect(getMessageError("items.1.field", error)).toBe("Second error");
      expect(getMessageError("items.2.field", error)).toBe("Third error");
    });

    it("should handle different field names", () => {
      const error = {
        items: [
          {
            name: { message: "Name error" },
            email: { message: "Email error" },
            phone: { message: "Phone error" },
          },
        ],
      };

      expect(getMessageError("items.0.name", error)).toBe("Name error");
      expect(getMessageError("items.0.email", error)).toBe("Email error");
      expect(getMessageError("items.0.phone", error)).toBe("Phone error");
    });

    it("should prioritize error[key].message over nested message", () => {
      const error = {
        items: {
          message: "Items level error",
        },
        itemsArray: [
          {
            field: { message: "Nested field error" },
          },
        ],
      };

      // Se error[key].message existe, retorna ele
      expect(getMessageError("items.0.field", error)).toBe("Items level error");

      // Se não existe error[key].message, busca no array
      expect(getMessageError("itemsArray.0.field", error)).toBe(
        "Nested field error"
      );
    });

    it("should handle empty error object", () => {
      const error = {};

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should throw error when error is null", () => {
      const error = null;

      // A função tenta acessar error[key] sem optional chaining na verificação !error[key]
      // Isso lança um erro quando error é null
      expect(() => getMessageError("items.0.field", error as any)).toThrow();
    });

    it("should throw error when error is undefined", () => {
      const error = undefined;

      // A função tenta acessar error[key] sem optional chaining na verificação !error[key]
      // Isso lança um erro quando error é undefined
      expect(() => getMessageError("items.0.field", error as any)).toThrow();
    });

    it("should handle error with null key", () => {
      const error = {
        items: null,
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should handle error with undefined key", () => {
      const error = {
        items: undefined,
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should convert index string to number correctly", () => {
      const error = {
        items: [
          { field: { message: "Error at index 0" } },
          { field: { message: "Error at index 1" } },
        ],
      };

      // Number("0") = 0, Number("1") = 1
      expect(getMessageError("items.0.field", error)).toBe("Error at index 0");
      expect(getMessageError("items.1.field", error)).toBe("Error at index 1");
    });

    it("should handle non-numeric index string", () => {
      const error = {
        items: [{ field: { message: "Error" } }],
      };

      // Number("abc") = NaN, então error[key][NaN] é undefined
      expect(getMessageError("items.abc.field", error)).toBe("");
    });

    it("should handle name with more than 3 parts", () => {
      const error = {
        items: [
          {
            field: { message: "Error message" },
          },
        ],
      };

      // Apenas usa as primeiras 3 partes: items, 0, field
      // Ignora partes adicionais
      expect(getMessageError("items.0.field.extra.parts", error)).toBe(
        "Error message"
      );
    });

    it("should handle name with exactly 2 parts", () => {
      const error = {
        items: {
          message: "Items error",
        },
      };

      // key = "items", index = Number("0"), field = undefined
      // Primeiro tenta error[key].message (existe, então retorna)
      expect(getMessageError("items.0", error)).toBe("Items error");

      // Se error[key].message não existir, tenta error[key][index][field].message
      // Mas field é undefined, então error[key][index][undefined]?.message retorna undefined
      const error2 = {
        items: [{ message: "Array item error" }],
      };
      // error[items][0] existe, mas error[items][0][undefined] é undefined
      expect(getMessageError("items.0", error2)).toBeUndefined();
    });

    it("should handle complex nested error structure (only 3 levels deep)", () => {
      const error = {
        users: [
          {
            profile: {
              name: { message: "Name is required" },
              email: { message: "Email is invalid" },
            },
          },
          {
            profile: {
              name: { message: "Name too short" },
            },
          },
        ],
      };

      // A função só acessa 3 níveis: key.index.field
      // Então "users.0.profile" -> key="users", index=0, field="profile"
      // Mas error[users][0][profile] não tem .message, então retorna undefined
      // Para acessar profile.name, precisaria de 4 níveis: users.0.profile.name
      // Mas a função só processa 3 níveis
      expect(getMessageError("users.0.profile", error)).toBeUndefined();

      // Para funcionar, precisamos estruturar como:
      const error2 = {
        users: [
          {
            "profile.name": { message: "Name is required" },
            "profile.email": { message: "Email is invalid" },
          },
        ],
      };
      // "users.0.profile.name".split('.') = ["users", "0", "profile", "name"]
      // key = "users", index = 0, field = "profile" (terceira parte)
      // error[users][0]["profile"] não existe (a chave é "profile.name")
      expect(getMessageError("users.0.profile.name", error2)).toBeUndefined();

      // Para funcionar corretamente, precisaria usar a chave completa:
      const error3 = {
        users: [
          {
            profile: {
              name: { message: "Name is required" },
              email: { message: "Email is invalid" },
            },
          },
        ],
      };
      // Mas ainda assim, "users.0.profile.name" -> field = "profile", não "name"
      // Então não funciona para estruturas aninhadas além de 3 níveis
      expect(getMessageError("users.0.profile", error3)).toBeUndefined();
    });

    it("should handle error where key exists but is empty object", () => {
      const error = {
        items: {},
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should handle error where key exists but is empty array", () => {
      const error = {
        items: [],
      };

      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should handle error where array index is out of bounds", () => {
      const error = {
        items: [{ field: { message: "Error" } }],
      };

      // Index 1 não existe no array
      expect(getMessageError("items.1.field", error)).toBe("");
    });

    it("should handle error where array index is negative", () => {
      const error = {
        items: [{ field: { message: "Error" } }],
      };

      // Number("-1") = -1, então error[key][-1] é undefined
      expect(getMessageError("items.-1.field", error)).toBe("");
    });

    it("should handle error with multiple levels of nesting (only 3 levels)", () => {
      const error = {
        forms: [
          {
            sections: [
              {
                fields: {
                  name: { message: "Deep nested error" },
                },
              },
            ],
          },
        ],
      };

      // Esta função só vai até 3 níveis (key.index.field)
      // forms.0.sections -> key="forms", index=0, field="sections"
      // error[forms][0][sections] existe mas é um array, não tem .message
      // O optional chaining retorna undefined quando .message não existe
      const result = getMessageError("forms.0.sections", error);
      expect(result).toBeUndefined();

      // Para acessar estruturas mais profundas, precisaria usar field names compostos
      const error2 = {
        forms: [
          {
            "sections.0.fields.name": { message: "Deep nested error" },
          },
        ],
      };
      // A função processa apenas as primeiras 3 partes do split
      // "forms.0.sections.0.fields.name".split('.') = ["forms", "0", "sections", "0", "fields", "name"]
      // key = "forms", index = Number("0") = 0, field = "sections"
      // error[forms][0]["sections"] não existe (o objeto tem "sections.0.fields.name" como chave)
      expect(
        getMessageError("forms.0.sections.0.fields.name", error2)
      ).toBeUndefined();
    });

    it("should handle error where message is empty string", () => {
      const error = {
        items: [
          {
            field: { message: "" },
          },
        ],
      };

      // Empty string é falsy, mas ainda é retornado
      expect(getMessageError("items.0.field", error)).toBe("");
    });

    it("should handle error where message is 0", () => {
      const error = {
        items: [
          {
            field: { message: 0 },
          },
        ],
      };

      // 0 é falsy, mas ainda é retornado
      expect(getMessageError("items.0.field", error)).toBe(0);
    });

    it("should handle error where message is false", () => {
      const error = {
        items: [
          {
            field: { message: false },
          },
        ],
      };

      // false é falsy, mas ainda é retornado
      expect(getMessageError("items.0.field", error)).toBe(false);
    });
  });
});
