import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InputSearch } from "./input-search";

describe("InputSearch", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render input with search icon", () => {
      const handleSearchChange = vi.fn();
      const { container } = render(
        <InputSearch search="" handleSearchChange={handleSearchChange} />
      );

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toBeInTheDocument();

      // Verifica se o ícone Search está presente (lucide-react renderiza como SVG)
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render with default search value", () => {
      const handleSearchChange = vi.fn();
      render(
        <InputSearch search="teste" handleSearchChange={handleSearchChange} />
      );

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toHaveValue("teste");
    });

    it("should render with empty search value", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toHaveValue("");
    });

    it("should have correct placeholder", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
    });

    it("should have autoFocus attribute", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toHaveFocus();
    });

    it("should have correct CSS classes on container", () => {
      const handleSearchChange = vi.fn();
      const { container } = render(
        <InputSearch search="" handleSearchChange={handleSearchChange} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(
        "relative",
        "w-full",
        "sm:w-auto",
        "sm:max-w-[320px]",
        "sm:min-w-[280px]"
      );
    });

    it("should have correct CSS classes on input", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toHaveClass(
        "bg-background/60",
        "border-border",
        "hover:bg-background/80",
        "focus:bg-background",
        "pr-9",
        "pl-9"
      );
    });
  });

  describe("Debounce Functionality", () => {
    it("should debounce handleSearchChange calls", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;

      // Simula digitação
      fireEvent.change(input, { target: { value: "test" } });

      // handleSearchChange não deve ser chamado imediatamente
      expect(handleSearchChange).not.toHaveBeenCalled();

      // Avança o timer em 500ms (tempo do debounce)
      vi.advanceTimersByTime(500);

      // Agora deve ter sido chamado uma vez com o último valor
      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith("test");
    });

    it("should only call handleSearchChange once after multiple rapid changes", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;

      // Simula múltiplas mudanças rápidas
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.change(input, { target: { value: "abc" } });

      // handleSearchChange não deve ser chamado ainda
      expect(handleSearchChange).not.toHaveBeenCalled();

      // Avança o timer
      vi.advanceTimersByTime(500);

      // Deve ser chamado apenas uma vez com o último valor
      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith("abc");
    });

    it("should reset debounce timer on new input", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;

      // Primeira mudança
      fireEvent.change(input, { target: { value: "a" } });

      // Avança 300ms (menos que 500ms)
      vi.advanceTimersByTime(300);
      expect(handleSearchChange).not.toHaveBeenCalled();

      // Segunda mudança (reseta o timer)
      fireEvent.change(input, { target: { value: "ab" } });

      // Avança mais 300ms (total 600ms desde o primeiro "a", mas apenas 300ms desde "ab")
      vi.advanceTimersByTime(300);
      expect(handleSearchChange).not.toHaveBeenCalled();

      // Avança mais 200ms (total 500ms desde "ab")
      vi.advanceTimersByTime(200);
      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith("ab");
    });

    it("should call handleSearchChange with correct value after debounce", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "search term" } });

      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith("search term");
    });
  });

  describe("User Interaction", () => {
    it("should update input value when user types", () => {
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "teste" } });

      expect(input).toHaveValue("teste");
    });

    it("should handle empty string input", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(
        <InputSearch search="initial" handleSearchChange={handleSearchChange} />
      );

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "" } });

      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith("");
    });

    it("should handle long search strings", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      const longString = "a".repeat(1000);

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: longString } });

      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith(longString);
      expect(input).toHaveValue(longString);
    });

    it("should handle special characters", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "test@123!@#$%" } });

      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith("test@123!@#$%");
    });

    it("should handle multiple sequential searches", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;

      // Primeira busca
      fireEvent.change(input, { target: { value: "first" } });
      vi.advanceTimersByTime(500);
      expect(handleSearchChange).toHaveBeenCalledWith("first");

      // Segunda busca
      fireEvent.change(input, { target: { value: "" } });
      fireEvent.change(input, { target: { value: "second" } });
      vi.advanceTimersByTime(500);
      expect(handleSearchChange).toHaveBeenCalledWith("second");
      expect(handleSearchChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string as search prop", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toHaveValue("");
    });

    it("should handle whitespace-only search value", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "   " } });

      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith("   ");
    });

    it("should handle search value with newlines", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      // Input não permite newlines normalmente, mas testamos se o componente lida bem
      fireEvent.change(input, { target: { value: "test\nline" } });

      vi.advanceTimersByTime(500);

      // O input HTML normalmente remove newlines, mas testamos o comportamento
      expect(handleSearchChange).toHaveBeenCalled();
    });

    it("should maintain input value when handleSearchChange is called", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "test" } });

      vi.advanceTimersByTime(500);

      // O valor deve permanecer no input após o debounce
      expect(input).toHaveValue("test");
      expect(handleSearchChange).toHaveBeenCalledWith("test");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible input element", () => {
      const handleSearchChange = vi.fn();
      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toBeInTheDocument();
      // Input type="text" é o padrão quando não especificado
      expect(input).not.toHaveAttribute("type", "password");
      expect(input).not.toHaveAttribute("type", "email");
    });

    it("should be keyboard navigable", () => {
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      expect(input).toHaveFocus(); // autoFocus

      // Testa navegação com teclado
      fireEvent.change(input, { target: { value: "test" } });
      expect(input).toHaveValue("test");
    });
  });

  describe("Integration", () => {
    it("should work with controlled component pattern", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn((value: string) => {
        // Simula um componente controlado atualizando o estado
        // No teste, apenas verificamos que a função foi chamada
      });

      const { rerender } = render(
        <InputSearch search="" handleSearchChange={handleSearchChange} />
      );

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "new value" } });
      vi.advanceTimersByTime(500);

      expect(handleSearchChange).toHaveBeenCalledWith("new value");

      // Simula rerender com novo valor de search
      rerender(
        <InputSearch
          search="new value"
          handleSearchChange={handleSearchChange}
        />
      );
      expect(input).toHaveValue("new value");
    });

    it("should handle rapid typing and debounce correctly", () => {
      vi.useFakeTimers();
      const handleSearchChange = vi.fn();

      render(<InputSearch search="" handleSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText(
        "Buscar..."
      ) as HTMLInputElement;

      // Simula digitação muito rápida
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, {
          target: { value: `0123456789`.substring(0, i + 1) },
        });
        vi.advanceTimersByTime(50); // Avança pouco tempo entre cada digitação
      }

      // Ainda não deve ter chamado (menos de 500ms desde a última)
      expect(handleSearchChange).not.toHaveBeenCalled();

      // Avança o tempo restante
      vi.advanceTimersByTime(500);

      // Deve ter chamado apenas uma vez com todos os dígitos
      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith("0123456789");
    });
  });
});
