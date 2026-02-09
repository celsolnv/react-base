import * as React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { InputForm } from "./index";

// Mock do useFormContext para controlar formState
const mockUseFormContext = vi.fn();
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useFormContext: () => mockUseFormContext(),
  };
});

// Schema de validação para testes
const testSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().optional(),
  phone: z.string().optional(),
});

type TTestFormData = z.infer<typeof testSchema>;

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
  resolver,
  onFormReady,
  renderChildren,
  formStateOverrides = {},
}: {
  children?: React.ReactNode;
  defaultValues?: Partial<TTestFormData>;
  resolver?: typeof zodResolver;
  onFormReady?: (form: ReturnType<typeof useForm<TTestFormData>>) => void;
  renderChildren?: (
    control: ReturnType<typeof useForm<TTestFormData>>["control"]
  ) => React.ReactNode;
  formStateOverrides?: {
    isSubmitting?: boolean;
  };
}) => {
  const form = useForm<TTestFormData>({
    defaultValues,
    resolver: resolver ? resolver(testSchema) : undefined,
  });

  // Configura o mock do useFormContext
  mockUseFormContext.mockReturnValue({
    ...form,
    formState: {
      ...form.formState,
      isSubmitting:
        formStateOverrides.isSubmitting ?? form.formState.isSubmitting,
    },
  });

  React.useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        {renderChildren ? renderChildren(form.control) : children}
      </Form>
    </FormProvider>
  );
};

describe("InputForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render input with all props", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
              required
              placeholder="Digite seu nome"
              description="Campo obrigatório"
              className="custom-class"
              classNameInput="custom-input-class"
            />
          )}
        />
      );

      expect(screen.getByText("Nome")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite seu nome")
      ).toBeInTheDocument();
      expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("should render input without optional props", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = document.querySelector('input[name="name"]');
      expect(input).toBeInTheDocument();
      expect(screen.queryByText("Nome")).not.toBeInTheDocument();
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should render label when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome Completo"
            />
          )}
        />
      );

      expect(screen.getByText("Nome Completo")).toBeInTheDocument();
    });

    it("should not render label when not provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      expect(screen.queryByText("Nome")).not.toBeInTheDocument();
    });

    it("should render required indicator when required is true", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
              required
            />
          )}
        />
      );

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("should not render required indicator when required is false", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
              required={false}
            />
          )}
        />
      );

      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should render description when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              description="Este campo é opcional"
            />
          )}
        />
      );

      expect(screen.getByText("Este campo é opcional")).toBeInTheDocument();
    });

    it("should not render description when not provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      expect(
        screen.queryByText("Este campo é opcional")
      ).not.toBeInTheDocument();
    });

    it("should render placeholder when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              placeholder="Digite aqui..."
            />
          )}
        />
      );

      expect(screen.getByPlaceholderText("Digite aqui...")).toBeInTheDocument();
    });

    it("should apply custom className to FormItem", () => {
      const { container } = render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              className="my-custom-class"
            />
          )}
        />
      );

      const formItem = container.querySelector(".my-custom-class");
      expect(formItem).toBeInTheDocument();
    });

    it("should apply custom classNameInput to Input", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              classNameInput="my-input-class"
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("my-input-class");
    });
  });

  describe("Input Types", () => {
    it("should render text input by default", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      // Type text é o padrão, pode não ter o atributo explicitamente
      const type = input.getAttribute("type");
      expect(type === null || type === "text").toBe(true);
    });

    it("should render email input when type is email", () => {
      render(
        <TestWrapper
          defaultValues={{ email: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="email"
              type="email"
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("should render password input when type is password", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              type="password"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should render number input when type is number", () => {
      render(
        <TestWrapper
          defaultValues={{ age: undefined }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="age"
              type="number"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it("should apply min attribute when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ age: undefined }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="age"
              type="number"
              min="0"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="number"]');
      expect(input).toHaveAttribute("min", "0");
    });
  });

  describe("Form Integration", () => {
    it("should bind to form control and update value", async () => {
      const user = userEvent.setup();
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "João Silva");

      await waitFor(() => {
        expect(input.value).toBe("João Silva");
      });

      if (formInstance) {
        expect(formInstance.getValues("name")).toBe("João Silva");
      }
    });

    it("should display default value from form", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "Valor padrão" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByDisplayValue("Valor padrão");
      expect(input).toBeInTheDocument();
    });

    it("should display validation error message", async () => {
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          resolver={zodResolver}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("name");
        });

        await waitFor(() => {
          expect(
            screen.getByText("Nome deve ter no mínimo 3 caracteres")
          ).toBeInTheDocument();
        });
      }
    });

    it("should show loading state when form is submitting", () => {
      // Suprime o warning do React sobre atributo loading
      const originalError = console.error;
      console.error = vi.fn();

      try {
        const { container } = render(
          <TestWrapper
            defaultValues={{ name: "" }}
            formStateOverrides={{ isSubmitting: true }}
            renderChildren={(control) => (
              <InputForm<TTestFormData>
                control={control}
                name="name"
                label="Nome"
              />
            )}
          />
        );

        // Quando loading é true, o Input renderiza um Skeleton ao invés do input
        // Verifica que o componente renderiza sem quebrar
        const skeleton = container.querySelector('[data-slot="skeleton"]');
        expect(skeleton).toBeInTheDocument();
      } finally {
        console.error = originalError;
      }
    });
  });

  describe("Mask Functionality", () => {
    it("should apply mask function to value", () => {
      const maskFn = vi.fn((value: string) => value.replace(/\D/g, ""));

      render(
        <TestWrapper
          defaultValues={{ phone: "1234567890" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="phone"
              mask={maskFn}
            />
          )}
        />
      );

      expect(maskFn).toHaveBeenCalled();
    });

    it("should handle mask with empty value", () => {
      const maskFn = vi.fn((value: string) => value || "");

      render(
        <TestWrapper
          defaultValues={{ phone: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="phone"
              mask={maskFn}
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should handle mask with null value", () => {
      const maskFn = vi.fn((value: string) => value || "");

      render(
        <TestWrapper
          defaultValues={{ phone: null as unknown as string }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="phone"
              mask={maskFn}
            />
          )}
        />
      );

      expect(maskFn).toHaveBeenCalled();
    });

    it("should not apply mask when mask function is not provided", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "Test Value" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByDisplayValue("Test Value");
      expect(input).toBeInTheDocument();
    });

    it("should apply CPF mask correctly", () => {
      const cpfMask = (value: string) => {
        const onlyNumbers = value.replace(/\D/g, "");
        let formatted = onlyNumbers.substring(0, 3);
        if (onlyNumbers.length > 3) {
          formatted += "." + onlyNumbers.substring(3, 6);
        }
        if (onlyNumbers.length > 6) {
          formatted += "." + onlyNumbers.substring(6, 9);
        }
        if (onlyNumbers.length > 9) {
          formatted += "-" + onlyNumbers.substring(9, 11);
        }
        return formatted;
      };

      render(
        <TestWrapper
          defaultValues={{ phone: "12345678901" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="phone"
              mask={cpfMask}
            />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("123.456.789-01");
    });
  });

  describe("User Interaction", () => {
    it("should handle user input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "Novo texto");

      expect(input.value).toBe("Novo texto");
    });

    it("should handle disabled state", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "Texto inicial" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" disabled />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("should not be disabled when disabled prop is false", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              disabled={false}
            />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it("should handle long text input", async () => {
      const longText = "A".repeat(1000);

      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: longText } });

      expect(input.value).toBe(longText);
      expect(input.value.length).toBe(1000);
    });

    it("should handle empty string", async () => {
      render(
        <TestWrapper
          defaultValues={{ name: "Texto inicial" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "" } });

      expect(input.value).toBe("");
    });
  });

  describe("AutoComplete", () => {
    it("should apply autoComplete attribute when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ email: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="email"
              autoComplete="email"
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autoComplete", "email");
    });

    it("should handle different autoComplete values", () => {
      const autoCompleteValues = ["name", "email", "tel", "url"];

      autoCompleteValues.forEach((autoComplete) => {
        const { unmount } = render(
          <TestWrapper
            defaultValues={{ name: "" }}
            renderChildren={(control) => (
              <InputForm<TTestFormData>
                control={control}
                name="name"
                autoComplete={
                  autoComplete as React.ComponentProps<"input">["autoComplete"]
                }
              />
            )}
          />
        );

        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("autoComplete", autoComplete);
        unmount();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined default value", () => {
      render(
        <TestWrapper
          defaultValues={{ phone: undefined }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="phone" />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle null default value", () => {
      render(
        <TestWrapper
          defaultValues={{ phone: null as unknown as string }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="phone" />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle empty string as default value", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle all optional props as undefined", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label={undefined}
              required={undefined}
              placeholder={undefined}
              className={undefined}
              classNameInput={undefined}
              description={undefined}
              mask={undefined}
              type={undefined}
              min={undefined}
              disabled={undefined}
              autoComplete={undefined}
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should handle legacy control prop", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData> control={control} name="name" />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper input role", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should associate label with input", () => {
      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      const input = screen.getByLabelText("Nome");
      expect(input).toBeInTheDocument();
    });

    it("should display error message with proper accessibility", async () => {
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ name: "" }}
          resolver={zodResolver}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputForm<TTestFormData>
              control={control}
              name="name"
              label="Nome"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("name");
        });

        await waitFor(() => {
          const errorMessage = screen.getByText(
            "Nome deve ter no mínimo 3 caracteres"
          );
          expect(errorMessage).toBeInTheDocument();
        });
      }
    });
  });
});
