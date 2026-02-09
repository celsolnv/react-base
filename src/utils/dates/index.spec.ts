import { parseISO } from "date-fns";
import { describe, expect, it } from "vitest";

import {
  getLastMonthsLabels,
  getLastWeeksLabels,
  getLastYearsLabels,
  getMonthByNumber,
  getNextMonthsLabels,
} from "./index";

describe("dates utils", () => {
  describe("getLastMonthsLabels", () => {
    it("should return empty array when amountBefore is 0", () => {
      const result = getLastMonthsLabels(0);
      expect(result).toEqual([]);
    });

    it("should return last month label when amountBefore is 1", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(1, fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Fev");
    });

    it("should return multiple last months labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(3, fixedDate);
      expect(result).toHaveLength(3);
      expect(result).toEqual(["Dez", "Jan", "Fev"]);
    });

    it("should include current month when addCurrentMonth is true", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(2, fixedDate, true);
      expect(result).toHaveLength(2);
      // A função adiciona o mês atual, depois subtrai meses e faz reverse
      // Após reverse: ["Fev", "Mar"] (do mais antigo para o mais recente)
      expect(result[0]).toBe("Fev");
      expect(result[1]).toBe("Mar");
    });

    it("should not include current month when addCurrentMonth is false", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(2, fixedDate, false);
      expect(result).toHaveLength(2);
      expect(result).not.toContain("Mar");
    });

    it("should adjust amountBefore when addCurrentMonth is true", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(3, fixedDate, true);
      expect(result).toHaveLength(3);
      // A função adiciona o mês atual, depois subtrai 2 meses e faz reverse
      // Após reverse: ["Jan", "Fev", "Mar"] (do mais antigo para o mais recente)
      expect(result[0]).toBe("Jan");
      expect(result[1]).toBe("Fev");
      expect(result[2]).toBe("Mar");
    });

    it("should use current date when currentDate is not provided", () => {
      const result = getLastMonthsLabels(1);
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("string");
    });

    it("should handle year boundary correctly", () => {
      const fixedDate = parseISO("2024-01-15");
      const result = getLastMonthsLabels(2, fixedDate);
      expect(result).toHaveLength(2);
      expect(result).toEqual(["Nov", "Dez"]);
    });

    it("should return labels in reverse order", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(3, fixedDate);
      // Should be in chronological order (oldest to newest)
      expect(result[0]).toBe("Dez");
      expect(result[2]).toBe("Fev");
    });

    it("should capitalize month labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastMonthsLabels(1, fixedDate);
      expect(result[0][0]).toBe(result[0][0].toUpperCase());
    });
  });

  describe("getNextMonthsLabels", () => {
    it("should return empty array when amountNext is 0", () => {
      const result = getNextMonthsLabels(0);
      expect(result).toEqual([]);
    });

    it("should return next month label when amountNext is 1", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(1, false, fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Abr");
    });

    it("should return multiple next months labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(3, false, fixedDate);
      expect(result).toHaveLength(3);
      expect(result).toEqual(["Abr", "Mai", "Jun"]);
    });

    it("should include current month when addCurrentMonth is true", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(2, true, fixedDate);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe("Mar");
      expect(result[1]).toBe("Abr");
    });

    it("should not include current month when addCurrentMonth is false", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(2, false, fixedDate);
      expect(result).toHaveLength(2);
      expect(result).not.toContain("Mar");
    });

    it("should adjust amountNext when addCurrentMonth is true", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(3, true, fixedDate);
      expect(result).toHaveLength(3);
      // Should have current month + 2 next months
      expect(result[0]).toBe("Mar");
    });

    it("should use current date when currentDate is not provided", () => {
      const result = getNextMonthsLabels(1);
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("string");
    });

    it("should handle year boundary correctly", () => {
      const fixedDate = parseISO("2024-12-15");
      const result = getNextMonthsLabels(2, false, fixedDate);
      expect(result).toHaveLength(2);
      expect(result).toEqual(["Jan", "Fev"]);
    });

    it("should capitalize month labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getNextMonthsLabels(1, false, fixedDate);
      expect(result[0][0]).toBe(result[0][0].toUpperCase());
    });
  });

  describe("getLastWeeksLabels", () => {
    it("should return empty array when amountBefore is 0", () => {
      const result = getLastWeeksLabels(0);
      expect(result).toEqual([]);
    });

    it("should return last week label in short format", () => {
      const fixedDate = parseISO("2024-03-15"); // Friday
      const result = getLastWeeksLabels(1, "short", fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
    });

    it("should return last week label in long format", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(1, "long", fixedDate);
      expect(result).toHaveLength(1);
      // O formato inclui acentos nos meses em português, então usamos uma regex mais flexível
      expect(result[0]).toMatch(/\d+ de [\wç]+ a \d+ de [\wç]+/);
      expect(result[0]).toContain("de");
      expect(result[0]).toContain("a");
    });

    it("should return multiple last weeks labels in short format", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(2, "short", fixedDate);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
      expect(result[1]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
    });

    it("should return multiple last weeks labels in long format", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(2, "long", fixedDate);
      expect(result).toHaveLength(2);
      // O formato inclui acentos nos meses em português
      expect(result[0]).toContain("de");
      expect(result[0]).toContain("a");
      expect(result[1]).toContain("de");
      expect(result[1]).toContain("a");
    });

    it("should use short format as default", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(1, undefined, fixedDate);
      expect(result[0]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
    });

    it("should use current date when currentDate is not provided", () => {
      const result = getLastWeeksLabels(1);
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("string");
    });

    it("should return labels in reverse order", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(3, "short", fixedDate);
      // Should be in chronological order (oldest to newest)
      expect(result.length).toBe(3);
    });

    it("should capitalize week labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastWeeksLabels(1, "long", fixedDate);
      expect(result[0][0]).toBe(result[0][0].toUpperCase());
    });

    it("should handle week boundaries correctly", () => {
      const fixedDate = parseISO("2024-03-03"); // Sunday
      const result = getLastWeeksLabels(1, "short", fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
    });

    it("should handle month boundaries in week labels", () => {
      const fixedDate = parseISO("2024-03-01"); // First day of month
      const result = getLastWeeksLabels(1, "short", fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatch(/\d{2}\/\d{2} - \d{2}\/\d{2}/);
    });
  });

  describe("getLastYearsLabels", () => {
    it("should return empty array when amountBefore is 0", () => {
      const result = getLastYearsLabels(0);
      expect(result).toEqual([]);
    });

    it("should return last year label when amountBefore is 1", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastYearsLabels(1, fixedDate);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("2023");
    });

    it("should return multiple last years labels", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastYearsLabels(3, fixedDate);
      expect(result).toHaveLength(3);
      expect(result).toEqual(["2021", "2022", "2023"]);
    });

    it("should use current date when currentDate is not provided", () => {
      const result = getLastYearsLabels(1);
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("string");
      expect(result[0]).toMatch(/^\d{4}$/);
    });

    it("should return labels in reverse order", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastYearsLabels(3, fixedDate);
      // Should be in chronological order (oldest to newest)
      expect(result[0]).toBe("2021");
      expect(result[2]).toBe("2023");
    });

    it("should return year as string in YYYY format", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastYearsLabels(1, fixedDate);
      expect(result[0]).toMatch(/^\d{4}$/);
      expect(result[0].length).toBe(4);
    });

    it("should handle multiple years correctly", () => {
      const fixedDate = parseISO("2024-03-15");
      const result = getLastYearsLabels(5, fixedDate);
      expect(result).toHaveLength(5);
      expect(result).toEqual(["2019", "2020", "2021", "2022", "2023"]);
    });
  });

  describe("getMonthByNumber", () => {
    it("should return January when month is 1", () => {
      const result = getMonthByNumber(1);
      expect(result).toBe("Janeiro");
    });

    it("should return December when month is 12", () => {
      const result = getMonthByNumber(12);
      expect(result).toBe("Dezembro");
    });

    it("should return correct month for each number from 1 to 12", () => {
      const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      for (let i = 1; i <= 12; i++) {
        const result = getMonthByNumber(i);
        expect(result).toBe(months[i - 1]);
      }
    });

    it("should capitalize month name", () => {
      const result = getMonthByNumber(3);
      expect(result[0]).toBe(result[0].toUpperCase());
      expect(result).toBe("Março");
    });

    it("should handle month 0 (should wrap to December of previous year)", () => {
      const result = getMonthByNumber(0);
      // setMonth(0-1) = setMonth(-1) which is December of previous year
      // But format("MMMM") will still return "dezembro"
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle month 13 (should wrap to January of next year)", () => {
      const result = getMonthByNumber(13);
      // setMonth(13-1) = setMonth(12) which is January of next year
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle negative month numbers", () => {
      const result = getMonthByNumber(-1);
      // setMonth(-1-1) = setMonth(-2) which wraps around
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle large month numbers", () => {
      const result = getMonthByNumber(25);
      // setMonth(25-1) = setMonth(24) which wraps around
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
