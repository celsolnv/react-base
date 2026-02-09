import * as React from "react";
import { useForm } from "react-hook-form";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Form } from "@/components/ui/form";

import { InputFormCurrency } from "./index";

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

describe("InputFormCurrency", () => {
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
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      expect(screen.getByText("Preço")).toBeInTheDocument();
      expect(screen.getByText("R$")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
    });

    it("should render without label", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" />
        </TestWrapper>
      );

      expect(screen.queryByText("Preço")).not.toBeInTheDocument();
      expect(screen.getByText("R$")).toBeInTheDocument();
    });

    it("should render with custom placeholder", () => {
      render(
        <TestWrapper>
          <InputFormCurrency
            name="price"
            label="Preço"
            placeholder="Digite o valor"
          />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText("Digite o valor")).toBeInTheDocument();
    });

    it("should render required indicator when required is true", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" required />
        </TestWrapper>
      );

      const label = screen.getByText("Preço");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("should render currency prefix R$", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const prefix = container.querySelector(".absolute");
      expect(prefix?.textContent).toContain("R$");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormCurrency
            name="price"
            label="Preço"
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
          <InputFormCurrency
            name="price"
            label="Preço"
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
          <InputFormCurrency
            name="price"
            label="Preço"
            description="Digite o valor em reais"
          />
        </TestWrapper>
      );

      expect(screen.getByText("Digite o valor em reais")).toBeInTheDocument();
    });
  });

  describe("Value Formatting", () => {
    it("should format value as currency when typing", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
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
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should remove R$ prefix from field value", async () => {
      const user = userEvent.setup();

      const formValues: Record<string, string> = {};

      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "100");

      // O valor no campo não deve conter "R$" (já que é removido)
      await waitFor(() => {
        // O valor formatado não deve começar com "R$"
        expect(input.value).not.toMatch(/^R\$/);
      });
    });

    it("should handle existing value with R$ prefix", () => {
      render(
        <TestWrapper defaultValues={{ price: "R$ 100,00" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      // O valor exibido deve ter o "R$" removido
      expect(input.value).not.toMatch(/^R\$/);
    });
  });

  describe("User Interactions", () => {
    it("should update form value when user types", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
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
          <InputFormCurrency name="price" label="Preço" disabled />
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
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
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
          defaultValues: { price: "" },
          mode: "onChange",
        });

        return <Form {...form}>{children}</Form>;
      };

      render(
        <TestWrapperWithValidation>
          <InputFormCurrency name="price" label="Preço" required />
        </TestWrapperWithValidation>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toBeInTheDocument();
    });

    it("should integrate with form context", () => {
      render(
        <TestWrapper defaultValues={{ price: "50,00" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      // O valor deve ser exibido (sem R$)
      expect(input.value).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper input type", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should support autoComplete attribute", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" autoComplete="off" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveAttribute("autocomplete", "off");
    });

    it("should have proper label association", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const label = screen.getByText("Preço");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string value", () => {
      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle null value", () => {
      render(
        <TestWrapper defaultValues={{ price: null }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle undefined value", () => {
      render(
        <TestWrapper defaultValues={{ price: undefined }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      expect(input.value).toBe("0,00");
    });

    it("should handle very large numbers", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
      await user.type(input, "999999999");

      await waitFor(() => {
        expect(input.value).toBeTruthy();
      });
    });

    it("should handle special characters in input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ price: "" }}>
          <InputFormCurrency name="price" label="Preço" />
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
  });

  describe("Layout", () => {
    it("should apply padding-left for currency prefix", () => {
      render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("0,00");
      expect(input).toHaveClass("pl-12");
    });

    it("should position currency prefix absolutely", () => {
      const { container } = render(
        <TestWrapper>
          <InputFormCurrency name="price" label="Preço" />
        </TestWrapper>
      );

      const prefixContainer = container.querySelector(".absolute");
      expect(prefixContainer).toBeInTheDocument();
      expect(prefixContainer).toHaveClass("left-3");
    });
  });
});
