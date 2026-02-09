import { describe, expect, it } from "vitest";

import { capitalize, sanitize } from "./index";

describe("Text utils", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should capitalize first letter and lowercase the rest", () => {
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("hELLO")).toBe("Hello");
      expect(capitalize("HeLLo")).toBe("Hello");
    });

    it("should return empty string when value is undefined", () => {
      expect(capitalize()).toBe("");
    });

    it("should return empty string when value is null", () => {
      expect(capitalize(null as any)).toBe("");
    });

    it("should return empty string when value is empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle single character strings", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("A")).toBe("A");
    });

    it("should handle strings with numbers", () => {
      expect(capitalize("123abc")).toBe("123abc");
      expect(capitalize("abc123")).toBe("Abc123");
    });

    it("should handle strings with special characters", () => {
      expect(capitalize("!hello")).toBe("!hello");
      expect(capitalize("@world")).toBe("@world");
    });

    it("should handle strings with spaces", () => {
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("should handle strings with accented characters", () => {
      expect(capitalize("café")).toBe("Café");
      expect(capitalize("CAFÉ")).toBe("Café");
    });

    it("should handle non-string values (with unexpected behavior)", () => {
      // Quando passamos um número, value[0] retorna undefined porque números não têm índices
      // String(undefined) = "UNDEFINED", então o resultado é "UNDEFINED" + resto em minúsculo
      expect(capitalize(123 as any)).toBe("UNDEFINED23");
      // Boolean true: value[0] = undefined, então "UNDEFINED" + "rue" = "UNDEFINEDrue"
      expect(capitalize(true as any)).toBe("UNDEFINEDrue");
      // Boolean false é falsy, então retorna ""
      expect(capitalize(false as any)).toBe("");
    });
  });

  describe("sanitize", () => {
    it("should remove accents and convert to lowercase", () => {
      expect(sanitize("Café")).toBe("cafe");
      expect(sanitize("São Paulo")).toBe("sao paulo");
      expect(sanitize("José")).toBe("jose");
    });

    it("should handle strings with various accented characters", () => {
      expect(sanitize("áéíóú")).toBe("aeiou");
      expect(sanitize("ÁÉÍÓÚ")).toBe("aeiou");
      expect(sanitize("àèìòù")).toBe("aeiou");
      expect(sanitize("ãõ")).toBe("ao");
      expect(sanitize("ç")).toBe("c");
    });

    it("should convert uppercase to lowercase", () => {
      expect(sanitize("HELLO")).toBe("hello");
      expect(sanitize("Hello World")).toBe("hello world");
    });

    it("should return empty string when value is undefined", () => {
      expect(sanitize()).toBe("");
    });

    it("should return empty string when value is null", () => {
      expect(sanitize(null as any)).toBe("");
    });

    it("should return empty string when value is empty string", () => {
      expect(sanitize("")).toBe("");
    });

    it("should handle strings without accents", () => {
      expect(sanitize("hello")).toBe("hello");
      expect(sanitize("Hello World")).toBe("hello world");
    });

    it("should handle strings with numbers", () => {
      expect(sanitize("Hello123")).toBe("hello123");
      expect(sanitize("123ABC")).toBe("123abc");
    });

    it("should handle strings with special characters", () => {
      expect(sanitize("Hello-World")).toBe("hello-world");
      expect(sanitize("Hello_World")).toBe("hello_world");
      expect(sanitize("Hello.World")).toBe("hello.world");
    });

    it("should handle strings with spaces", () => {
      expect(sanitize("Hello World")).toBe("hello world");
      expect(sanitize("  Hello  World  ")).toBe("  hello  world  ");
    });

    it("should handle mixed case with accents", () => {
      expect(sanitize("Café Élégant")).toBe("cafe elegant");
      expect(sanitize("SÃO PAULO")).toBe("sao paulo");
    });

    it("should handle non-string values (falsy values return empty, others throw)", () => {
      // Valores falsy retornam "" antes de chamar normalize
      expect(sanitize(false as any)).toBe("");
      expect(sanitize(0 as any)).toBe("");
      // Valores truthy não-string lançam erro ao tentar chamar normalize
      expect(() => sanitize(123 as any)).toThrow();
      expect(() => sanitize(true as any)).toThrow();
    });

    it("should handle complex strings with multiple accents", () => {
      expect(sanitize("José María")).toBe("jose maria");
      expect(sanitize("François Müller")).toBe("francois muller");
      expect(sanitize("São José dos Campos")).toBe("sao jose dos campos");
    });
  });
});
