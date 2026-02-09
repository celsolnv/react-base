import {
  generate,
  hasLowerCase,
  hasSpecialCaracter,
  hasUpperCase,
} from "./index";

describe("Password Utils", () => {
  describe("generate", () => {
    it("should generate a password with at least one uppercase letter", () => {
      const password = generate();
      expect(hasUpperCase(password)).toBe(true);
    });

    it("should generate a password with at least one lowercase letter", () => {
      const password = generate();
      expect(hasLowerCase(password)).toBe(true);
    });

    it("should generate a password with at least one special character", () => {
      const password = generate();
      expect(hasSpecialCaracter(password)).toBe(true);
    });

    it("should generate a password with a length of 6 characters", () => {
      const password = generate();
      expect(password.length).toBe(6);
    });
  });

  describe("hasUpperCase", () => {
    it("should return true if the string contains an uppercase letter", () => {
      expect(hasUpperCase("Hello")).toBe(true);
    });

    it("should return false if the string does not contain an uppercase letter", () => {
      expect(hasUpperCase("hello")).toBe(false);
    });
  });

  describe("hasLowerCase", () => {
    it("should return true if the string contains a lowercase letter", () => {
      expect(hasLowerCase("Hello")).toBe(true);
    });

    it("should return false if the string does not contain a lowercase letter", () => {
      expect(hasLowerCase("HELLO")).toBe(false);
    });
  });

  describe("hasSpecialCaracter", () => {
    it("should return true if the string contains a special character", () => {
      expect(hasSpecialCaracter("Hello@")).toBe(true);
    });

    it("should return false if the string does not contain a special character", () => {
      expect(hasSpecialCaracter("Hello")).toBe(false);
    });
  });
});
