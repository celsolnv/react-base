import { describe, expect, it } from "vitest";

import { formatSelectDefault } from "./formatter";

describe("select/formatter", () => {
  describe("formatSelectDefault", () => {
    it("should format response array to option select format", () => {
      const response = [
        { id: "1", name: "Option 1" },
        { id: "2", name: "Option 2" },
        { id: "3", name: "Option 3" },
      ];

      const result = formatSelectDefault(response);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ value: "1", label: "Option 1" });
      expect(result[1]).toEqual({ value: "2", label: "Option 2" });
      expect(result[2]).toEqual({ value: "3", label: "Option 3" });
    });

    it("should use id as value and name as label by default", () => {
      const response = [{ id: "123", name: "Test Name" }];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("123");
      expect(result[0].label).toBe("Test Name");
    });

    it("should format label with id when nameWithId is true", () => {
      const response = [
        { id: "1", name: "Option 1" },
        { id: "2", name: "Option 2" },
      ];

      const result = formatSelectDefault(response, true);

      expect(result[0].label).toBe("1 - Option 1");
      expect(result[1].label).toBe("2 - Option 2");
    });

    it("should format label without id when nameWithId is false", () => {
      const response = [{ id: "1", name: "Option 1" }];

      const result = formatSelectDefault(response, false);

      expect(result[0].label).toBe("Option 1");
    });

    it("should format label without id when nameWithId is not provided (default false)", () => {
      const response = [{ id: "1", name: "Option 1" }];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("Option 1");
    });

    it("should handle empty array", () => {
      const response: Array<{ id: string; name: string }> = [];

      const result = formatSelectDefault(response);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle array with single item", () => {
      const response = [{ id: "1", name: "Single Option" }];

      const result = formatSelectDefault(response);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: "1", label: "Single Option" });
    });

    it("should handle array with many items", () => {
      const response = Array.from({ length: 100 }, (_, i) => ({
        id: String(i + 1),
        name: `Option ${i + 1}`,
      }));

      const result = formatSelectDefault(response);

      expect(result).toHaveLength(100);
      expect(result[0]).toEqual({ value: "1", label: "Option 1" });
      expect(result[99]).toEqual({ value: "100", label: "Option 100" });
    });

    it("should handle numeric ids", () => {
      const response = [
        { id: "123", name: "Numeric ID" },
        { id: "456", name: "Another Numeric ID" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("123");
      expect(result[1].value).toBe("456");
    });

    it("should handle string ids", () => {
      const response = [
        { id: "abc", name: "String ID" },
        { id: "xyz", name: "Another String ID" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("abc");
      expect(result[1].value).toBe("xyz");
    });

    it("should handle uuid ids", () => {
      const response = [
        { id: "550e8400-e29b-41d4-a716-446655440000", name: "UUID ID" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(result[0].label).toBe("UUID ID");
    });

    it("should handle empty name strings", () => {
      const response = [
        { id: "1", name: "" },
        { id: "2", name: "   " },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("");
      expect(result[1].label).toBe("   ");
    });

    it("should handle empty id strings", () => {
      const response = [{ id: "", name: "Empty ID" }];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("");
      expect(result[0].label).toBe("Empty ID");
    });

    it("should handle names with special characters", () => {
      const response = [
        { id: "1", name: "Option & Name" },
        { id: "2", name: "Option <Name>" },
        { id: "3", name: "Option 'Name'" },
        { id: "4", name: 'Option "Name"' },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("Option & Name");
      expect(result[1].label).toBe("Option <Name>");
      expect(result[2].label).toBe("Option 'Name'");
      expect(result[3].label).toBe('Option "Name"');
    });

    it("should handle names with accented characters", () => {
      const response = [
        { id: "1", name: "São Paulo" },
        { id: "2", name: "José" },
        { id: "3", name: "Café" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("São Paulo");
      expect(result[1].label).toBe("José");
      expect(result[2].label).toBe("Café");
    });

    it("should handle names with numbers", () => {
      const response = [
        { id: "1", name: "Option 123" },
        { id: "2", name: "123 Option" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("Option 123");
      expect(result[1].label).toBe("123 Option");
    });

    it("should format label with id and special characters in name", () => {
      const response = [{ id: "1", name: "Option & Name" }];

      const result = formatSelectDefault(response, true);

      expect(result[0].label).toBe("1 - Option & Name");
    });

    it("should format label with id and accented characters in name", () => {
      const response = [{ id: "1", name: "São Paulo" }];

      const result = formatSelectDefault(response, true);

      expect(result[0].label).toBe("1 - São Paulo");
    });

    it("should format label with id when id contains special characters", () => {
      const response = [
        { id: "id-123", name: "Option" },
        { id: "id_456", name: "Option" },
      ];

      const result = formatSelectDefault(response, true);

      expect(result[0].label).toBe("id-123 - Option");
      expect(result[1].label).toBe("id_456 - Option");
    });

    it("should preserve order of items", () => {
      const response = [
        { id: "3", name: "Third" },
        { id: "1", name: "First" },
        { id: "2", name: "Second" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("3");
      expect(result[1].value).toBe("1");
      expect(result[2].value).toBe("2");
    });

    it("should handle very long names", () => {
      const longName = "A".repeat(1000);
      const response = [{ id: "1", name: longName }];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe(longName);
      expect(result[0].label.length).toBe(1000);
    });

    it("should handle very long ids", () => {
      const longId = "1".repeat(1000);
      const response = [{ id: longId, name: "Option" }];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe(longId);
      expect(result[0].value.length).toBe(1000);
    });

    it("should handle very long id with nameWithId true", () => {
      const longId = "1".repeat(100);
      const longName = "A".repeat(100);
      const response = [{ id: longId, name: longName }];

      const result = formatSelectDefault(response, true);

      expect(result[0].label).toBe(`${longId} - ${longName}`);
      expect(result[0].label.length).toBe(100 + 3 + 100); // id + " - " + name
    });

    it("should return correct type IOptionSelect", () => {
      const response = [{ id: "1", name: "Option 1" }];

      const result = formatSelectDefault(response);

      // Verifica que o resultado tem a estrutura correta
      expect(result[0]).toHaveProperty("value");
      expect(result[0]).toHaveProperty("label");
      expect(typeof result[0].value).toBe("string");
      expect(typeof result[0].label).toBe("string");
    });

    it("should handle whitespace in names", () => {
      const response = [
        { id: "1", name: "  Option with spaces  " },
        { id: "2", name: "\tTabbed\tName\t" },
        { id: "3", name: "\nNewline\nName\n" },
      ];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("  Option with spaces  ");
      expect(result[1].label).toBe("\tTabbed\tName\t");
      expect(result[2].label).toBe("\nNewline\nName\n");
    });

    it("should handle whitespace in ids", () => {
      const response = [{ id: " 1 ", name: "Option" }];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe(" 1 ");
    });

    it("should handle mixed case in names", () => {
      const response = [{ id: "1", name: "MiXeD cAsE nAmE" }];

      const result = formatSelectDefault(response);

      expect(result[0].label).toBe("MiXeD cAsE nAmE");
    });

    it("should handle mixed case in ids", () => {
      const response = [{ id: "AbC123", name: "Option" }];

      const result = formatSelectDefault(response);

      expect(result[0].value).toBe("AbC123");
    });
  });
});
