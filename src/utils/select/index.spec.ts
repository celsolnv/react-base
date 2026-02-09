import { describe, expect, it } from "vitest";

import {
  arrayToObject,
  filterUniqueProperty,
  findSelect,
  findSelectNullable,
  type IConfigFields,
} from "./index";

describe("select/index", () => {
  describe("findSelect", () => {
    it("should find and return matching option", () => {
      const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
      ];

      const result = findSelect("2", options);

      expect(result).toEqual({ value: "2", label: "Option 2" });
    });

    it("should return default object when value is not found", () => {
      const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];

      const result = findSelect("999", options);

      expect(result).toEqual({
        label: "Não encontrado",
        value: "",
      });
    });

    it("should return default object when options is undefined", () => {
      const result = findSelect("1");

      expect(result).toEqual({
        label: "Não encontrado",
        value: "",
      });
    });

    it("should return default object when options is empty array", () => {
      const result = findSelect("1", []);

      expect(result).toEqual({
        label: "Não encontrado",
        value: "",
      });
    });

    it("should return default object when value is undefined", () => {
      const options = [{ value: "1", label: "Option 1" }];

      const result = findSelect(undefined, options);

      expect(result).toEqual({
        label: "Não encontrado",
        value: "",
      });
    });

    it("should find option with number value", () => {
      const options = [
        { value: 1, label: "Option 1" },
        { value: 2, label: "Option 2" },
      ];

      const result = findSelect(2, options);

      expect(result).toEqual({ value: 2, label: "Option 2" });
    });

    it("should find option with boolean value", () => {
      const options = [
        { value: true, label: "True Option" },
        { value: false, label: "False Option" },
      ];

      const result = findSelect(true, options);

      expect(result).toEqual({ value: true, label: "True Option" });
    });

    it("should find option with false boolean value", () => {
      const options = [
        { value: true, label: "True Option" },
        { value: false, label: "False Option" },
      ];

      const result = findSelect(false, options);

      expect(result).toEqual({ value: false, label: "False Option" });
    });

    it("should use strict equality for comparison", () => {
      const options = [
        { value: "1", label: "String 1" },
        { value: 1, label: "Number 1" },
      ];

      // String "1" !== Number 1
      const result1 = findSelect("1", options);
      expect(result1).toEqual({ value: "1", label: "String 1" });

      const result2 = findSelect(1, options);
      expect(result2).toEqual({ value: 1, label: "Number 1" });
    });

    it("should return first matching option when duplicates exist", () => {
      const options = [
        { value: "1", label: "First Option 1" },
        { value: "1", label: "Second Option 1" },
      ];

      const result = findSelect("1", options);

      expect(result).toEqual({ value: "1", label: "First Option 1" });
    });

    it("should handle empty string value", () => {
      const options = [
        { value: "", label: "Empty Option" },
        { value: "1", label: "Option 1" },
      ];

      const result = findSelect("", options);

      expect(result).toEqual({ value: "", label: "Empty Option" });
    });

    it("should handle zero as value", () => {
      const options = [
        { value: 0, label: "Zero Option" },
        { value: 1, label: "One Option" },
      ];

      const result = findSelect(0, options);

      expect(result).toEqual({ value: 0, label: "Zero Option" });
    });
  });

  describe("findSelectNullable", () => {
    it("should find and return matching option", () => {
      const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];

      const result = findSelectNullable("2", options);

      expect(result).toEqual({ value: "2", label: "Option 2" });
    });

    it("should return null when value is not found", () => {
      const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];

      const result = findSelectNullable("999", options);

      expect(result).toBeNull();
    });

    it("should return null when options is empty array", () => {
      const result = findSelectNullable("1", []);

      expect(result).toBeNull();
    });

    it("should find option with number value", () => {
      const options = [
        { value: 1, label: "Option 1" },
        { value: 2, label: "Option 2" },
      ];

      const result = findSelectNullable(2, options);

      expect(result).toEqual({ value: 2, label: "Option 2" });
    });

    it("should find option with boolean value", () => {
      const options = [
        { value: true, label: "True Option" },
        { value: false, label: "False Option" },
      ];

      const result = findSelectNullable(true, options);

      expect(result).toEqual({ value: true, label: "True Option" });
    });

    it("should find option with false boolean value", () => {
      const options = [
        { value: true, label: "True Option" },
        { value: false, label: "False Option" },
      ];

      const result = findSelectNullable(false, options);

      expect(result).toEqual({ value: false, label: "False Option" });
    });

    it("should use strict equality for comparison", () => {
      const options = [
        { value: "1", label: "String 1" },
        { value: 1, label: "Number 1" },
      ];

      const result1 = findSelectNullable("1", options);
      expect(result1).toEqual({ value: "1", label: "String 1" });

      const result2 = findSelectNullable(1, options);
      expect(result2).toEqual({ value: 1, label: "Number 1" });
    });

    it("should return first matching option when duplicates exist", () => {
      const options = [
        { value: "1", label: "First Option 1" },
        { value: "1", label: "Second Option 1" },
      ];

      const result = findSelectNullable("1", options);

      expect(result).toEqual({ value: "1", label: "First Option 1" });
    });

    it("should handle empty string value", () => {
      const options = [
        { value: "", label: "Empty Option" },
        { value: "1", label: "Option 1" },
      ];

      const result = findSelectNullable("", options);

      expect(result).toEqual({ value: "", label: "Empty Option" });
    });

    it("should handle zero as value", () => {
      const options = [
        { value: 0, label: "Zero Option" },
        { value: 1, label: "One Option" },
      ];

      const result = findSelectNullable(0, options);

      expect(result).toEqual({ value: 0, label: "Zero Option" });
    });
  });

  describe("arrayToObject", () => {
    it("should convert array to object indexed by key", () => {
      const array: IConfigFields[] = [
        { key: "field1", label: "Field 1", required: true, options: null },
        { key: "field2", label: "Field 2", required: false, options: null },
      ];

      const result = arrayToObject(array);

      expect(result).toEqual({
        field1: {
          key: "field1",
          label: "Field 1",
          required: true,
          options: null,
        },
        field2: {
          key: "field2",
          label: "Field 2",
          required: false,
          options: null,
        },
      });
    });

    it("should handle empty array", () => {
      const array: IConfigFields[] = [];

      const result = arrayToObject(array);

      expect(result).toEqual({});
    });

    it("should handle array with single item", () => {
      const array: IConfigFields[] = [
        { key: "field1", label: "Field 1", required: true, options: null },
      ];

      const result = arrayToObject(array);

      expect(result).toEqual({
        field1: {
          key: "field1",
          label: "Field 1",
          required: true,
          options: null,
        },
      });
    });

    it("should handle array with options", () => {
      const array: IConfigFields[] = [
        {
          key: "field1",
          label: "Field 1",
          required: true,
          options: [
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ],
        },
      ];

      const result = arrayToObject(array);

      expect(result).toEqual({
        field1: {
          key: "field1",
          label: "Field 1",
          required: true,
          options: [
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ],
        },
      });
    });

    it("should overwrite duplicate keys with last occurrence", () => {
      const array: IConfigFields[] = [
        {
          key: "field1",
          label: "First Field 1",
          required: true,
          options: null,
        },
        {
          key: "field1",
          label: "Second Field 1",
          required: false,
          options: null,
        },
      ];

      const result = arrayToObject(array);

      // O último valor sobrescreve o anterior
      expect(result).toEqual({
        field1: {
          key: "field1",
          label: "Second Field 1",
          required: false,
          options: null,
        },
      });
    });

    it("should handle array with many items", () => {
      const array: IConfigFields[] = Array.from({ length: 100 }, (_, i) => ({
        key: `field${i}`,
        label: `Field ${i}`,
        required: i % 2 === 0,
        options: null,
      }));

      const result = arrayToObject(array);

      expect(Object.keys(result)).toHaveLength(100);
      expect(result.field0).toEqual({
        key: "field0",
        label: "Field 0",
        required: true,
        options: null,
      });
      expect(result.field99).toEqual({
        key: "field99",
        label: "Field 99",
        required: false,
        options: null,
      });
    });

    it("should handle keys with special characters", () => {
      const array: IConfigFields[] = [
        { key: "field-1", label: "Field 1", required: true, options: null },
        { key: "field_2", label: "Field 2", required: false, options: null },
        { key: "field.3", label: "Field 3", required: true, options: null },
      ];

      const result = arrayToObject(array);

      expect(result["field-1"]).toBeDefined();
      expect(result["field_2"]).toBeDefined();
      expect(result["field.3"]).toBeDefined();
    });

    it("should preserve all properties of IConfigFields", () => {
      const array: IConfigFields[] = [
        {
          key: "field1",
          label: "Field 1",
          required: true,
          options: [{ value: "1", label: "Option 1" }],
        },
      ];

      const result = arrayToObject(array);

      expect(result.field1).toHaveProperty("key");
      expect(result.field1).toHaveProperty("label");
      expect(result.field1).toHaveProperty("required");
      expect(result.field1).toHaveProperty("options");
    });
  });

  describe("filterUniqueProperty", () => {
    it("should return unique values of a property", () => {
      const arr = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
        { name: "John", age: 35 },
      ];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["John", "Jane"]);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when array is empty", () => {
      const arr: Array<any> = [];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return all values when all are unique", () => {
      const arr = [{ name: "John" }, { name: "Jane" }, { name: "Bob" }];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
      expect(result).toHaveLength(3);
    });

    it("should return single value when all items have same property value", () => {
      const arr = [{ name: "John" }, { name: "John" }, { name: "John" }];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["John"]);
      expect(result).toHaveLength(1);
    });

    it("should preserve order of first occurrence", () => {
      const arr = [
        { name: "John" },
        { name: "Jane" },
        { name: "John" },
        { name: "Bob" },
        { name: "Jane" },
      ];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    it("should handle numeric property values", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }];

      const result = filterUniqueProperty(arr, "id");

      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle boolean property values", () => {
      const arr = [{ active: true }, { active: false }, { active: true }];

      const result = filterUniqueProperty(arr, "active");

      expect(result).toEqual([true, false]);
    });

    it("should handle null property values", () => {
      const arr = [{ value: null }, { value: "test" }, { value: null }];

      const result = filterUniqueProperty(arr, "value");

      expect(result).toEqual([null, "test"]);
    });

    it("should handle undefined property values", () => {
      const arr = [
        { value: undefined },
        { value: "test" },
        { value: undefined },
      ];

      const result = filterUniqueProperty(arr, "value");

      expect(result).toEqual([undefined, "test"]);
    });

    it("should handle empty string property values", () => {
      const arr = [{ name: "" }, { name: "John" }, { name: "" }];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["", "John"]);
    });

    it("should handle objects with missing property", () => {
      const arr = [{ name: "John" }, { age: 30 }, { name: "Jane" }];

      const result = filterUniqueProperty(arr, "name");

      expect(result).toEqual(["John", undefined, "Jane"]);
    });

    it("should handle nested property paths (only first level)", () => {
      const arr = [{ user: { name: "John" } }, { user: { name: "Jane" } }];

      // A função só acessa propriedades de primeiro nível
      const result = filterUniqueProperty(arr, "user");

      // user é um objeto, então compara objetos (que são diferentes)
      expect(result).toHaveLength(2);
    });

    it("should handle array with many items", () => {
      const arr = Array.from({ length: 1000 }, (_, i) => ({
        category: `Category ${i % 10}`,
      }));

      const result = filterUniqueProperty(arr, "category");

      // Deve ter 10 categorias únicas (0-9)
      expect(result).toHaveLength(10);
      expect(result[0]).toBe("Category 0");
      expect(result[9]).toBe("Category 9");
    });

    it("should handle property with special characters in name", () => {
      const arr = [
        { "property-name": "value1" },
        { "property-name": "value2" },
        { "property-name": "value1" },
      ];

      const result = filterUniqueProperty(arr, "property-name");

      expect(result).toEqual(["value1", "value2"]);
    });
  });
});
