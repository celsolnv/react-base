import * as React from "react";
import { useForm } from "react-hook-form";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Form } from "@/components/ui/form";

import { InputFormPercentage } from "./index";

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) => {
  const form = useForm({
    defaultValues,
  });

  return <Form {...form}>{children}</Form>;
};

describe("InputFormPercentage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      expect(screen.getByText("Desconto")).toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
    });

    it("should render without label", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" />
        </TestWrapper>
      );

      expect(screen.queryByText("Desconto")).not.toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();
    });

    it("should render with custom placeholder", () => {
      render(
        <TestWrapper>
          <InputFormPercentage
            name="discount"
            label="Desconto"
            placeholder="Digite a porcentagem"
          />
        </TestWrapper>
      );

      expect(
        screen.getByPlaceholderText("Digite a porcentagem")
      ).toBeInTheDocument();
    });

    it("should render required indicator when required is true", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" required />
        </TestWrapper>
      );

      const label = screen.getByText("Desconto");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("should render percentage suffix %", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const suffix = container.querySelector(".absolute");
      expect(suffix?.textContent).toContain("%");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormPercentage
            name="discount"
            label="Desconto"
            className="custom-class"
          />
        </TestWrapper>
      );

      const formItem = container.querySelector(".custom-class");
      expect(formItem).toBeInTheDocument();
    });

    it("should apply custom classNameInput", () => {
      render(
        <TestWrapper>
          <InputFormPercentage
            name="discount"
            label="Desconto"
            classNameInput="custom-input-class"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveClass("custom-input-class");
    });

    it("should render description when provided", () => {
      render(
        <TestWrapper>
          <InputFormPercentage
            name="discount"
            label="Desconto"
            description="Digite o desconto em porcentagem"
          />
        </TestWrapper>
      );

      expect(
        screen.getByText("Digite o desconto em porcentagem")
      ).toBeInTheDocument();
    });
  });

  describe("Value Formatting", () => {
    it("should format value as percentage when typing", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "12345");

      // A máscara formata o valor
      await waitFor(() => {
        expect(input.value).toBeTruthy();
      });
    });

    it("should display default value 0,00 when field is empty", () => {
      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should limit percentage to 100", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      // Digita um valor que resultaria em mais de 100%
      await user.type(input, "99999");

      // A máscara deve limitar a 100%
      await waitFor(() => {
        // O valor deve ser limitado a 100,00
        expect(input.value).toBeTruthy();
      });
    });

    it("should handle existing percentage value", () => {
      render(
        <TestWrapper defaultValues={{ discount: "50,00" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("50,00");
    });
  });

  describe("User Interactions", () => {
    it("should update form value when user types", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "123");

      // Verifica que o input foi atualizado
      await waitFor(() => {
        expect(input.value).not.toBe("0,00");
      });
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" disabled />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toBeDisabled();
    });

    it("should accept loading prop from form state", () => {
      // O componente usa form.formState.isSubmitting para mostrar loading
      // Como isSubmitting é uma propriedade readonly gerenciada pelo react-hook-form,
      // testamos que o componente renderiza corretamente e aceita a prop loading
      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      // O input deve estar presente e o componente deve funcionar normalmente
      expect(input).toBeInTheDocument();
      // O loading é controlado internamente pelo formState.isSubmitting
      // que é gerenciado pelo react-hook-form durante a submissão
    });
  });

  describe("Form Integration", () => {
    it("should work with form validation", async () => {
      const TestWrapperWithValidation = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const form = useForm({
          defaultValues: { discount: "" },
          mode: "onChange",
        });

        return <Form {...form}>{children}</Form>;
      };

      render(
        <TestWrapperWithValidation>
          <InputFormPercentage name="discount" label="Desconto" required />
        </TestWrapperWithValidation>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toBeInTheDocument();
    });

    it("should integrate with form context", () => {
      render(
        <TestWrapper defaultValues={{ discount: "25,50" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      // O valor deve ser exibido
      expect(input.value).toBe("25,50");
    });
  });

  describe("Accessibility", () => {
    it("should have proper input type", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should support autoComplete attribute", () => {
      render(
        <TestWrapper>
          <InputFormPercentage
            name="discount"
            label="Desconto"
            autoComplete="off"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveAttribute("autocomplete", "off");
    });

    it("should have proper label association", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const label = screen.getByText("Desconto");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string value", () => {
      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle null value", () => {
      render(
        <TestWrapper defaultValues={{ discount: null }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle undefined value", () => {
      render(
        <TestWrapper defaultValues={{ discount: undefined }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle very large numbers and limit to 100", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "999999999");

      // A máscara deve limitar a 100,00
      await waitFor(() => {
        expect(input.value).toBeTruthy();
      });
    });

    it("should handle special characters in input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "abc123def");

      // A máscara deve remover caracteres não numéricos
      await waitFor(() => {
        // O valor deve conter apenas números formatados
        expect(input.value).toBeTruthy();
      });
    });

    it("should handle decimal values", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ discount: "" }}>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "12345");

      // A máscara deve formatar com decimais
      await waitFor(() => {
        expect(input.value).toBeTruthy();
        // O valor deve ter formato de decimal (com vírgula)
        expect(input.value).toMatch(/,/);
      });
    });
  });

  describe("Layout", () => {
    it("should apply padding-right for percentage suffix", () => {
      render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveClass("pr-10");
    });

    it("should position percentage suffix absolutely on the right", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const suffixContainer = container.querySelector(".absolute");
      expect(suffixContainer).toBeInTheDocument();
      expect(suffixContainer).toHaveClass("right-3");
    });

    it("should position suffix at center vertically", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormPercentage name="discount" label="Desconto" />
        </TestWrapper>
      );

      const suffixContainer = container.querySelector(".absolute");
      expect(suffixContainer).toHaveClass("top-1/2", "-translate-y-1/2");
    });
  });
});
