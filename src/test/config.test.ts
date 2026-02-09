import { describe, expect, it } from "vitest";

describe("Test Configuration", () => {
  it("should have working test configuration", () => {
    expect(true).toBe(true);
  });

  it("should have access to DOM testing utilities", () => {
    // Criar um elemento e adicioná-lo ao documento para que ele esteja realmente no DOM
    const div = document.createElement("div");
    document.body.appendChild(div);

    try {
      // Esta afirmação verifica se as extensões do jest-dom estão funcionando
      expect(div).toBeInTheDocument();
    } finally {
      // Limpar após o teste
      document.body.removeChild(div);
    }
  });
});
