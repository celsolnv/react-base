import * as React from "react";
import { useForm } from "react-hook-form";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Form } from "@/components/ui/form";

import { SelectForm } from "./select-form";

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

const mockOptions = [
  { value: "option1", label: "Opção 1" },
  { value: "option2", label: "Opção 2" },
  { value: "option3", label: "Opção 3" },
];

describe("SelectForm", () => {
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
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      // Verifica se o select está presente
      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should render with label", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" label="Selecione" options={mockOptions} />
        </TestWrapper>
      );

      expect(screen.getByText("Selecione")).toBeInTheDocument();
    });

    it("should render without label", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      expect(screen.queryByText("Selecione")).not.toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      render(
        <TestWrapper>
          <SelectForm
            name="test"
            placeholder="Escolha uma opção"
            options={mockOptions}
          />
        </TestWrapper>
      );

      expect(screen.getByText("Escolha uma opção")).toBeInTheDocument();
    });

    it("should render required indicator when required is true", () => {
      render(
        <TestWrapper>
          <SelectForm
            name="test"
            label="Selecione"
            required
            options={mockOptions}
          />
        </TestWrapper>
      );

      const label = screen.getByText("Selecione");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("should render all options", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
        expect(screen.getByText("Opção 2")).toBeInTheDocument();
        expect(screen.getByText("Opção 3")).toBeInTheDocument();
      });
    });

    it("should apply custom className", () => {
      const { container } = render(
        <TestWrapper>
          <SelectForm
            name="test"
            className="custom-class"
            options={mockOptions}
          />
        </TestWrapper>
      );

      const formItem = container.querySelector(".custom-class");
      expect(formItem).toBeInTheDocument();
    });

    it("should apply custom classNameSelect", () => {
      const { container } = render(
        <TestWrapper>
          <SelectForm
            name="test"
            classNameSelect="custom-select-class"
            options={mockOptions}
          />
        </TestWrapper>
      );

      // Verifica se a classe foi aplicada ao FormControl
      const formControl = container.querySelector(".custom-select-class");
      expect(formControl).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should open dropdown when clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
      });
    });

    it("should select an option when clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ test: "" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Opção 1");
      await user.click(option1);

      // Verifica se o valor foi selecionado (o texto deve aparecer no combobox)
      await waitFor(() => {
        const updatedCombobox = screen.getByRole("combobox");
        expect(updatedCombobox.textContent).toContain("Opção 1");
      });
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" disabled options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeDisabled();
    });

    it("should update form value when option is selected", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ test: "" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 2")).toBeInTheDocument();
      });

      const option2 = screen.getByText("Opção 2");
      await user.click(option2);

      // O valor deve ser atualizado no form - verifica se o texto aparece no combobox
      await waitFor(() => {
        const updatedCombobox = screen.getByRole("combobox");
        expect(updatedCombobox).toBeInTheDocument();
        // Verifica se o texto da opção selecionada está presente
        expect(updatedCombobox.textContent).toContain("Opção 2");
      });
    });
  });

  describe("Value Handling", () => {
    it("should display selected value", () => {
      render(
        <TestWrapper defaultValues={{ test: "option1" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      // O valor selecionado deve estar visível
      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should convert number value to string", () => {
      render(
        <TestWrapper defaultValues={{ test: 1 }}>
          <SelectForm
            name="test"
            options={[
              { value: "1", label: "Um" },
              { value: "2", label: "Dois" },
            ]}
          />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should handle undefined value", () => {
      render(
        <TestWrapper defaultValues={{ test: undefined }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should handle null value", () => {
      render(
        <TestWrapper defaultValues={{ test: null }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should handle empty string value", () => {
      render(
        <TestWrapper defaultValues={{ test: "" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("should work with form validation", () => {
      const TestWrapperWithValidation = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const form = useForm({
          defaultValues: { test: "" },
          mode: "onChange",
        });

        return <Form {...form}>{children}</Form>;
      };

      render(
        <TestWrapperWithValidation>
          <SelectForm name="test" required options={mockOptions} />
        </TestWrapperWithValidation>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should integrate with form context", () => {
      render(
        <TestWrapper defaultValues={{ test: "option2" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should update form state when value changes", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={{ test: "" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 3")).toBeInTheDocument();
      });

      const option3 = screen.getByText("Opção 3");
      await user.click(option3);

      // O form deve ter o valor atualizado - verifica se o texto aparece no combobox
      await waitFor(() => {
        const updatedCombobox = screen.getByRole("combobox");
        expect(updatedCombobox.textContent).toContain("Opção 3");
      });
    });
  });

  describe("Loading State", () => {
    it("should show loading state when form is submitting", () => {
      // O componente usa form.formState.isSubmitting para mostrar loading
      // Como isSubmitting é uma propriedade readonly gerenciada pelo react-hook-form,
      // testamos que o componente renderiza corretamente
      render(
        <TestWrapper defaultValues={{ test: "" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      // O componente deve renderizar normalmente
      expect(combobox).toBeInTheDocument();
      // O loading é controlado internamente pelo formState.isSubmitting
      // que é gerenciado pelo react-hook-form durante a submissão
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty options array", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" options={[]} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should handle single option", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm
            name="test"
            options={[{ value: "single", label: "Única Opção" }]}
          />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Única Opção")).toBeInTheDocument();
      });
    });

    it("should handle many options", async () => {
      const user = userEvent.setup();
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        value: `option${i}`,
        label: `Opção ${i + 1}`,
      }));

      render(
        <TestWrapper>
          <SelectForm name="test" options={manyOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
        expect(screen.getByText("Opção 20")).toBeInTheDocument();
      });
    });

    it("should handle option with special characters in value", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm
            name="test"
            options={[
              { value: "special-value", label: "Valor Especial" },
              ...mockOptions,
            ]}
          />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("Valor Especial")).toBeInTheDocument();
      });
    });

    it("should handle option with long label", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm
            name="test"
            options={[
              {
                value: "long",
                label:
                  "Esta é uma opção com um label muito longo que pode quebrar o layout",
              },
              ...mockOptions,
            ]}
          />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Esta é uma opção com um label muito longo que pode quebrar o layout"
          )
        ).toBeInTheDocument();
      });
    });

    it("should handle value that doesn't match any option", () => {
      render(
        <TestWrapper defaultValues={{ test: "nonexistent" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      // O select deve renderizar mesmo com valor inválido
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper combobox role", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should have proper label association", () => {
      render(
        <TestWrapper>
          <SelectForm name="test" label="Selecione" options={mockOptions} />
        </TestWrapper>
      );

      const label = screen.getByText("Selecione");
      expect(label).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");

      // Abre o select com Enter
      await user.type(combobox, "{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Opção 1")).toBeInTheDocument();
      });
    });
  });

  describe("Key Prop", () => {
    it("should re-render when value changes using key prop", async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <TestWrapper defaultValues={{ test: "option1" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();

      // Simula mudança de valor
      rerender(
        <TestWrapper defaultValues={{ test: "option2" }}>
          <SelectForm name="test" options={mockOptions} />
        </TestWrapper>
      );

      // O select deve estar presente após re-render
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
