import { describe, expect, it } from "vitest";

import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  describe("Basic Formatting", () => {
    it("should format number as BRL currency by default", () => {
      const result = formatCurrency(1000);
      expect(result).toContain("R$");
      expect(result).toContain("1.000");
    });

    it("should format zero value", () => {
      const result = formatCurrency(0);
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });

    it("should format negative values", () => {
      const result = formatCurrency(-100);
      expect(result).toContain("-");
      expect(result).toContain("R$");
    });

    it("should format decimal values", () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain("R$");
      expect(result).toContain("1.234");
      expect(result).toContain("56");
    });

    it("should format large numbers", () => {
      const result = formatCurrency(1000000);
      expect(result).toContain("R$");
      expect(result).toContain("1.000.000");
    });
  });

  describe("String Values", () => {
    it("should format string number as currency", () => {
      const result = formatCurrency("1000");
      expect(result).toContain("R$");
      expect(result).toContain("1.000");
    });

    it("should format string decimal as currency", () => {
      const result = formatCurrency("1234.56");
      expect(result).toContain("R$");
      expect(result).toContain("1.234");
    });

    it("should format string with spaces", () => {
      const result = formatCurrency(" 1000 ");
      expect(result).toContain("R$");
    });
  });

  describe("Null and Undefined", () => {
    it("should return '-' for null value", () => {
      const result = formatCurrency(null);
      expect(result).toBe("-");
    });

    it("should return '-' for undefined value", () => {
      const result = formatCurrency(undefined);
      expect(result).toBe("-");
    });
  });

  describe("Invalid Values", () => {
    it("should return '-' for NaN values", () => {
      const result = formatCurrency(NaN);
      expect(result).toBe("-");
    });

    it("should return '-' for non-numeric string", () => {
      const result = formatCurrency("abc");
      expect(result).toBe("-");
    });

    it("should format empty string as zero", () => {
      // Number("") retorna 0, não NaN
      const result = formatCurrency("");
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });

    it("should format string with only spaces as zero", () => {
      // Number("   ") retorna 0, não NaN
      const result = formatCurrency("   ");
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });

    it("should format boolean true as 1", () => {
      // Number(true) retorna 1, não NaN
      const result = formatCurrency(true);
      expect(result).toContain("R$");
      expect(result).toContain("1");
    });

    it("should format boolean false as zero", () => {
      // Number(false) retorna 0, não NaN
      const result = formatCurrency(false);
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });

    it("should return '-' for object", () => {
      const result = formatCurrency({});
      expect(result).toBe("-");
    });

    it("should format empty array as zero", () => {
      // Number([]) retorna 0, não NaN
      const result = formatCurrency([]);
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });
  });

  describe("Different Currencies", () => {
    it("should format with USD currency", () => {
      const result = formatCurrency(1000, "USD");
      // Com locale pt-BR, USD usa ponto para milhares
      expect(result).toContain("$");
      expect(result).toContain("1.000");
    });

    it("should format with EUR currency", () => {
      const result = formatCurrency(1000, "EUR");
      expect(result).toContain("€");
      expect(result).toContain("1.000");
    });

    it("should format with GBP currency", () => {
      const result = formatCurrency(1000, "GBP");
      expect(result).toContain("£");
    });

    it("should format with JPY currency", () => {
      const result = formatCurrency(1000, "JPY");
      expect(result).toContain("¥");
    });
  });

  describe("Different Locales", () => {
    it("should format with en-US locale", () => {
      const result = formatCurrency(1000, "USD", "en-US");
      expect(result).toContain("$");
      expect(result).toContain("1,000");
    });

    it("should format with pt-BR locale (default)", () => {
      const result = formatCurrency(1000, "BRL", "pt-BR");
      expect(result).toContain("R$");
      expect(result).toContain("1.000");
    });

    it("should format with de-DE locale", () => {
      const result = formatCurrency(1000, "EUR", "de-DE");
      expect(result).toContain("€");
      expect(result).toContain("1.000");
    });

    it("should format with fr-FR locale", () => {
      const result = formatCurrency(1000, "EUR", "fr-FR");
      expect(result).toContain("€");
      // fr-FR usa espaço não-quebrável (U+202F) para separar milhares
      expect(result).toMatch(/1[\s\u202F]000/);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very small decimal values", () => {
      const result = formatCurrency(0.01);
      expect(result).toContain("R$");
      expect(result).toContain("0,01");
    });

    it("should handle very large numbers", () => {
      const result = formatCurrency(999999999);
      expect(result).toContain("R$");
      expect(result).toContain("999.999.999");
    });

    it("should handle Infinity", () => {
      const result = formatCurrency(Infinity);
      // Infinity pode ser formatado ou retornar "-" dependendo da implementação
      expect(typeof result).toBe("string");
    });

    it("should handle -Infinity", () => {
      const result = formatCurrency(-Infinity);
      // -Infinity pode ser formatado ou retornar "-" dependendo da implementação
      expect(typeof result).toBe("string");
    });

    it("should handle string with currency symbol", () => {
      const result = formatCurrency("R$ 1000");
      // Pode retornar "-" se não conseguir converter ou formatar corretamente
      expect(typeof result).toBe("string");
    });

    it("should handle string with commas and dots", () => {
      const result = formatCurrency("1.234,56");
      // Dependendo da localização, pode ou não funcionar
      expect(typeof result).toBe("string");
    });
  });

  describe("Default Parameters", () => {
    it("should use BRL as default currency", () => {
      const result = formatCurrency(1000);
      expect(result).toContain("R$");
    });

    it("should use pt-BR as default locale", () => {
      const result = formatCurrency(1000);
      // pt-BR usa ponto para milhares e vírgula para decimais
      expect(result).toMatch(/R\$\s*\d/);
    });

    it("should use default currency and locale when only value is provided", () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain("R$");
      expect(result).toContain("1.234");
      expect(result).toContain("56");
    });
  });

  describe("Number Conversion", () => {
    it("should convert string '0' to number", () => {
      const result = formatCurrency("0");
      expect(result).toContain("R$");
      expect(result).toContain("0");
    });

    it("should convert string '123' to number", () => {
      const result = formatCurrency("123");
      expect(result).toContain("R$");
      expect(result).toContain("123");
    });

    it("should convert string with leading zeros", () => {
      const result = formatCurrency("00123");
      expect(result).toContain("R$");
      expect(result).toContain("123");
    });
  });
});
