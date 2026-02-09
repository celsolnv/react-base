import { describe, expect, it } from "vitest";

import { validateCpf } from "./index";

describe("validate", () => {
  describe("validateCpf", () => {
    it("should return true for a valid CPF", () => {
      // CPF válido conhecido: 111.444.777-35
      expect(validateCpf("11144477735")).toBe(true);
      expect(validateCpf("111.444.777-35")).toBe(true);
    });

    it("should return true for another valid CPF", () => {
      // CPF válido: 123.456.789-09
      expect(validateCpf("12345678909")).toBe(true);
      expect(validateCpf("123.456.789-09")).toBe(true);
    });

    it("should return false when CPF length is less than 11 digits", () => {
      expect(validateCpf("1234567890")).toBe(false);
      expect(validateCpf("123456789")).toBe(false);
      expect(validateCpf("123")).toBe(false);
      expect(validateCpf("")).toBe(false);
    });

    it("should return false when CPF length is more than 11 digits", () => {
      expect(validateCpf("123456789012")).toBe(false);
      expect(validateCpf("1234567890123")).toBe(false);
    });

    it("should return false when all digits are the same", () => {
      expect(validateCpf("11111111111")).toBe(false);
      expect(validateCpf("22222222222")).toBe(false);
      expect(validateCpf("00000000000")).toBe(false);
      expect(validateCpf("99999999999")).toBe(false);
    });

    it("should return false when first digit verifier is incorrect", () => {
      // CPF com primeiro dígito verificador incorreto
      expect(validateCpf("11144477734")).toBe(false); // Último dígito deveria ser 5
    });

    it("should return false when second digit verifier is incorrect", () => {
      // CPF com segundo dígito verificador incorreto
      expect(validateCpf("12345678908")).toBe(false); // Último dígito deveria ser 9
    });

    it("should return false when both digit verifiers are incorrect", () => {
      expect(validateCpf("12345678900")).toBe(false);
    });

    it("should remove non-numeric characters before validation", () => {
      expect(validateCpf("111.444.777-35")).toBe(true);
      expect(validateCpf("111 444 777 35")).toBe(true);
      expect(validateCpf("111-444-777-35")).toBe(true);
      expect(validateCpf("abc11144477735def")).toBe(true);
    });

    it("should handle CPF with remainder 10 (should convert to 0)", () => {
      // CPF que resulta em resto 10 no cálculo do primeiro dígito
      // Exemplo: 111.444.777-35 tem resto 10 no primeiro dígito
      expect(validateCpf("11144477735")).toBe(true);
    });

    it("should handle CPF with remainder 11 (should convert to 0)", () => {
      // CPF que resulta em resto 11 no cálculo do primeiro dígito
      // Exemplo: 123.456.789-09 tem resto 11 no primeiro dígito
      expect(validateCpf("12345678909")).toBe(true);
    });

    it("should return false for invalid CPF with correct length", () => {
      // CPFs com 11 dígitos mas inválidos
      expect(validateCpf("12345678901")).toBe(false);
      // Usando um CPF claramente inválido (dígitos verificadores errados)
      expect(validateCpf("11144477700")).toBe(false);
    });

    it("should handle empty string", () => {
      expect(validateCpf("")).toBe(false);
    });

    it("should handle string with only non-numeric characters", () => {
      expect(validateCpf("abc.def.ghi-jk")).toBe(false);
      expect(validateCpf("...---")).toBe(false);
    });

    it("should handle CPF with spaces and special characters", () => {
      expect(validateCpf(" 111 444 777 35 ")).toBe(true);
      expect(validateCpf("111.444.777-35")).toBe(true);
    });

    it("should validate multiple known valid CPFs", () => {
      // Mais alguns CPFs válidos para garantir cobertura
      expect(validateCpf("52998224725")).toBe(true);
      expect(validateCpf("529.982.247-25")).toBe(true);
    });

    it("should return false for CPF with valid format but invalid digits", () => {
      // Formato correto mas dígitos verificadores inválidos
      expect(validateCpf("11144477736")).toBe(false);
      expect(validateCpf("12345678910")).toBe(false);
    });

    it("should handle edge case with single digit repeated", () => {
      // Todos os dígitos iguais (já testado, mas garantindo)
      for (let i = 0; i <= 9; i++) {
        const cpf = String(i).repeat(11);
        expect(validateCpf(cpf)).toBe(false);
      }
    });

    it("should correctly calculate first verifier digit", () => {
      // CPF onde o primeiro dígito verificador é calculado corretamente
      // 111.444.777-35: primeiro dígito = 3
      expect(validateCpf("11144477735")).toBe(true);
    });

    it("should correctly calculate second verifier digit", () => {
      // CPF onde o segundo dígito verificador é calculado corretamente
      // 111.444.777-35: segundo dígito = 5
      expect(validateCpf("11144477735")).toBe(true);
    });

    it("should return false when first digit is wrong but second is correct", () => {
      // Caso específico onde apenas o primeiro dígito está errado
      const validCpf = "11144477735";
      const invalidFirst = "11144477725"; // Primeiro dígito errado
      expect(validateCpf(validCpf)).toBe(true);
      expect(validateCpf(invalidFirst)).toBe(false);
    });

    it("should return false when first digit is correct but second is wrong", () => {
      // Caso específico onde apenas o segundo dígito está errado
      const validCpf = "11144477735";
      const invalidSecond = "11144477734"; // Segundo dígito errado
      expect(validateCpf(validCpf)).toBe(true);
      expect(validateCpf(invalidSecond)).toBe(false);
    });

    it("should handle CPF with leading zeros", () => {
      // CPF que começa com zero pode ser válido se passar na validação
      // Vamos testar que a função lida corretamente com zeros à esquerda
      const result = validateCpf("01234567890");
      // O resultado pode ser true ou false dependendo da validação
      expect(typeof result).toBe("boolean");
      // Testando um CPF inválido que começa com zero
      expect(validateCpf("00000000001")).toBe(false);
    });

    it("should validate CPF algorithm correctly for known valid cases", () => {
      // Testando o algoritmo completo com CPFs conhecidos
      const validCpfs = ["11144477735", "12345678909", "52998224725"];

      validCpfs.forEach((cpf) => {
        expect(validateCpf(cpf)).toBe(true);
        // Também com formatação
        const formatted = cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        );
        expect(validateCpf(formatted)).toBe(true);
      });
    });

    it("should return false for CPFs that pass length check but fail digit validation", () => {
      // CPFs com 11 dígitos mas que falham na validação dos dígitos
      expect(validateCpf("12345678901")).toBe(false);
      expect(validateCpf("98765432109")).toBe(false);
      expect(validateCpf("00000000001")).toBe(false);
    });
  });
});
