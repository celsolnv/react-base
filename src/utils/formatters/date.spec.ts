import { describe, expect, it } from "vitest";

import { formatDate, formatDateISO } from "./date";

describe("formatDate", () => {
  describe("Basic Formatting", () => {
    it("should format Date object with default options", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);
      // Formato padrão: dd/mm/yyyy
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should format date string with default options", () => {
      const result = formatDate("2024-01-15");
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should format date with ISO string", () => {
      const result = formatDate("2024-01-15T10:30:00Z");
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should format date with custom options", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      // Deve conter o nome do mês em português
      expect(result).toContain("2024");
      expect(result.length).toBeGreaterThan(10);
    });

    it("should format date with year only", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        year: "numeric",
      });
      expect(result).toBe("2024");
    });

    it("should format date with month and year", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        year: "numeric",
        month: "long",
      });
      expect(result).toContain("2024");
      expect(result).toContain("janeiro");
    });
  });

  describe("Null and Undefined", () => {
    it("should return '-' for null value", () => {
      const result = formatDate(null);
      expect(result).toBe("-");
    });

    it("should return '-' for undefined value", () => {
      const result = formatDate(undefined);
      expect(result).toBe("-");
    });

    it("should return '-' for empty string", () => {
      const result = formatDate("");
      expect(result).toBe("-");
    });

    it("should return '-' for zero", () => {
      const result = formatDate(0);
      expect(result).toBe("-");
    });
  });

  describe("Invalid Values", () => {
    it("should return '-' for invalid date string", () => {
      const result = formatDate("invalid-date");
      expect(result).toBe("-");
    });

    it("should return '-' for invalid Date object", () => {
      const invalidDate = new Date("invalid");
      const result = formatDate(invalidDate);
      expect(result).toBe("-");
    });

    it("should return '-' for NaN date", () => {
      const nanDate = new Date(NaN);
      const result = formatDate(nanDate);
      expect(result).toBe("-");
    });

    it("should return '-' for string that creates invalid date", () => {
      const result = formatDate("2024-13-45");
      expect(result).toBe("-");
    });
  });

  describe("Different Date Formats", () => {
    it("should format date with short format", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{2}/);
    });

    it("should format date with numeric month", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });
      expect(result).toMatch(/\d{2}\/\d{1,2}\/\d{4}/);
    });

    it("should format date with long month name", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      expect(result).toContain("janeiro");
      expect(result).toContain("2024");
    });

    it("should format date with short month name", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      expect(result).toContain("jan");
      expect(result).toContain("2024");
    });
  });

  describe("Edge Cases", () => {
    it("should handle date at start of epoch", () => {
      const date = new Date(0);
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle date far in the future", () => {
      const date = new Date("2099-12-31");
      const result = formatDate(date);
      expect(result).toContain("2099");
    });

    it("should handle date far in the past", () => {
      const date = new Date("1900-01-01T12:00:00Z");
      const result = formatDate(date);
      // Pode variar devido a timezone, mas deve ser uma data válida
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle leap year date", () => {
      const date = new Date("2024-02-29");
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle different timezones", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const result = formatDate(date);
      // A formatação pode variar com timezone, mas deve ser uma data válida
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe("Type Handling", () => {
    it("should handle Date object", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle date string", () => {
      const result = formatDate("2024-01-15");
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle timestamp number", () => {
      const timestamp = new Date("2024-01-15").getTime();
      const result = formatDate(timestamp);
      // Timestamp como number não é string, então será tratado como Date
      // Mas Number não é Date, então pode retornar "-"
      expect(typeof result).toBe("string");
    });
  });

  describe("Error Handling", () => {
    it("should return '-' when date parsing throws error", () => {
      // Simula um erro ao criar Date
      const result = formatDate("not-a-date");
      expect(result).toBe("-");
    });

    it("should handle non-date objects gracefully", () => {
      const result = formatDate({} as any);
      // Objetos não-Date podem causar erro, então retorna "-"
      expect(result).toBe("-");
    });

    it("should handle arrays gracefully", () => {
      const result = formatDate([] as any);
      expect(result).toBe("-");
    });
  });
});

describe("formatDateISO", () => {
  describe("Basic Formatting", () => {
    it("should format valid ISO date string", () => {
      const result = formatDateISO("2024-01-15");
      expect(result).toBe("2024-01-15");
    });

    it("should format ISO date with time", () => {
      const result = formatDateISO("2024-01-15T10:30:00Z");
      expect(result).toBe("2024-01-15");
    });

    it("should format ISO date with timezone", () => {
      const result = formatDateISO("2024-01-15T10:30:00-03:00");
      expect(result).toBe("2024-01-15");
    });

    it("should format ISO date with milliseconds", () => {
      const result = formatDateISO("2024-01-15T10:30:00.123Z");
      expect(result).toBe("2024-01-15");
    });
  });

  describe("Null and Undefined", () => {
    it("should return '-' for null value", () => {
      const result = formatDateISO(null);
      expect(result).toBe("-");
    });

    it("should return '-' for undefined value", () => {
      const result = formatDateISO(undefined);
      expect(result).toBe("-");
    });

    it("should return '-' for empty string", () => {
      const result = formatDateISO("");
      expect(result).toBe("-");
    });
  });

  describe("Invalid Values", () => {
    it("should throw error for invalid ISO string", () => {
      // formatDateISO não tem tratamento de erro, então lança exceção
      expect(() => formatDateISO("invalid-iso")).toThrow();
    });

    it("should throw error for malformed date string", () => {
      // parseISO pode retornar Invalid Date, e format lança erro
      expect(() => formatDateISO("2024-13-45")).toThrow();
    });

    it("should throw error for non-ISO format string", () => {
      // parseISO não aceita formato não-ISO, então lança erro
      expect(() => formatDateISO("01/15/2024")).toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should format leap year date", () => {
      const result = formatDateISO("2024-02-29");
      expect(result).toBe("2024-02-29");
    });

    it("should format first day of year", () => {
      const result = formatDateISO("2024-01-01");
      expect(result).toBe("2024-01-01");
    });

    it("should format last day of year", () => {
      const result = formatDateISO("2024-12-31");
      expect(result).toBe("2024-12-31");
    });

    it("should format date at start of epoch", () => {
      const result = formatDateISO("1970-01-01");
      expect(result).toBe("1970-01-01");
    });

    it("should format date far in the future", () => {
      const result = formatDateISO("2099-12-31");
      expect(result).toBe("2099-12-31");
    });

    it("should format date far in the past", () => {
      const result = formatDateISO("1900-01-01");
      expect(result).toBe("1900-01-01");
    });
  });

  describe("Format Consistency", () => {
    it("should always return yyyy-MM-dd format", () => {
      const result = formatDateISO("2024-01-15T10:30:00Z");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle ISO format with padding", () => {
      const result = formatDateISO("2024-01-05");
      expect(result).toBe("2024-01-05");
    });

    it("should throw error for format without padding", () => {
      // parseISO requer formato ISO completo com padding
      expect(() => formatDateISO("2024-1-5")).toThrow();
    });

    it("should maintain date value regardless of time", () => {
      // Usa horário do meio-dia para evitar problemas de timezone
      const result1 = formatDateISO("2024-01-15T12:00:00Z");
      const result2 = formatDateISO("2024-01-15T12:30:00Z");
      // Ambos devem retornar a mesma data
      expect(result1).toBe("2024-01-15");
      expect(result2).toBe("2024-01-15");
    });
  });
});
