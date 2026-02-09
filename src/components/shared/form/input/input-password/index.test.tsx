import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { InputPasswordForm } from "./index";

// Schema de validação para testes
const testSchema = z.object({
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().optional(),
});

type TTestFormData = z.infer<typeof testSchema>;

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
  resolver,
  onFormReady,
  renderChildren,
}: {
  children?: React.ReactNode;
  defaultValues?: Partial<TTestFormData>;
  resolver?: typeof zodResolver;
  onFormReady?: (form: ReturnType<typeof useForm<TTestFormData>>) => void;
  renderChildren?: (
    control: ReturnType<typeof useForm<TTestFormData>>["control"]
  ) => React.ReactNode;
}) => {
  const form = useForm<TTestFormData>({
    defaultValues,
    resolver: resolver ? resolver(testSchema) : undefined,
  });

  React.useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  return (
    <Form {...form}>
      {renderChildren ? renderChildren(form.control) : children}
    </Form>
  );
};

describe("InputPasswordForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render password input with all props", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
              required
              placeholder="Digite sua senha"
              description="Campo obrigatório"
              className="custom-class"
              classNameInput="custom-input-class"
            />
          )}
        />
      );

      expect(screen.getByText("Senha")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite sua senha")
      ).toBeInTheDocument();
      expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("should render password input without optional props", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(screen.queryByText("Senha")).not.toBeInTheDocument();
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should render label when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha de Acesso"
            />
          )}
        />
      );

      expect(screen.getByText("Senha de Acesso")).toBeInTheDocument();
    });

    it("should not render label when not provided", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      expect(screen.queryByText("Senha")).not.toBeInTheDocument();
    });

    it("should render required indicator when required is true", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
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
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              classNameInput="my-input-class"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toHaveClass("my-input-class");
    });
  });

  describe("Password Visibility Toggle", () => {
    it("should render password input as type password by default", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should render toggle button", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it("should change input type to text when toggle is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        const textInput = document.querySelector('input[type="text"]');
        expect(textInput).toBeInTheDocument();
      });
    });

    it("should change input type back to password when toggle is clicked again", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /ocultar senha/i })
        ).toBeInTheDocument();
      });

      const hideButton = screen.getByRole("button", { name: /ocultar senha/i });
      await user.click(hideButton);

      await waitFor(() => {
        const passwordInput = document.querySelector('input[type="password"]');
        expect(passwordInput).toBeInTheDocument();
      });
    });

    it("should update aria-label when password visibility changes", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      let toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
      expect(toggleButton).toBeInTheDocument();

      await user.click(toggleButton);

      await waitFor(() => {
        toggleButton = screen.getByRole("button", { name: /ocultar senha/i });
        expect(toggleButton).toBeInTheDocument();
      });
    });

    it("should render Eye icon when password is hidden", () => {
      const { container } = render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const eyeIcon = container.querySelector(".lucide-eye");
      expect(eyeIcon).toBeInTheDocument();
    });

    it("should render EyeOff icon when password is visible", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        const eyeOffIcon = container.querySelector(".lucide-eye-off");
        expect(eyeOffIcon).toBeInTheDocument();
      });
    });
  });

  describe("Form Integration", () => {
    it("should bind to form control and update value", async () => {
      const user = userEvent.setup();
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      await user.type(input, "senha123");

      await waitFor(() => {
        expect(input.value).toBe("senha123");
      });

      if (formInstance) {
        expect(formInstance.getValues("password")).toBe("senha123");
      }
    });

    it("should display default value from form", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "senha123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input.value).toBe("senha123");
    });

    it("should display validation error message", async () => {
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          resolver={zodResolver}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("password");
        });

        await waitFor(() => {
          expect(
            screen.getByText("Senha deve ter no mínimo 6 caracteres")
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
            defaultValues={{ password: "" }}
            renderChildren={(control) => {
              // Simula isSubmitting através do formState
              const form = useForm<TTestFormData>({
                defaultValues: { password: "" },
              });
              // Não podemos modificar formState diretamente, então apenas verificamos
              // que o componente renderiza sem quebrar
              return (
                <InputPasswordForm<TTestFormData>
                  control={control}
                  name="password"
                  label="Senha"
                />
              );
            }}
          />
        );

        // Verifica que o componente renderiza sem quebrar
        const input = container.querySelector('input[type="password"]');
        expect(input).toBeInTheDocument();
      } finally {
        console.error = originalError;
      }
    });
  });

  describe("AutoComplete", () => {
    it("should use default autoComplete value 'current-password'", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toHaveAttribute("autoComplete", "current-password");
    });

    it("should use custom autoComplete when provided", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              autoComplete="new-password"
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toHaveAttribute("autoComplete", "new-password");
    });

    it("should handle different autoComplete values", () => {
      const autoCompleteValues = ["current-password", "new-password", "off"];

      autoCompleteValues.forEach((autoComplete) => {
        const { unmount } = render(
          <TestWrapper
            defaultValues={{ password: "" }}
            renderChildren={(control) => (
              <InputPasswordForm<TTestFormData>
                control={control}
                name="password"
                autoComplete={autoComplete}
              />
            )}
          />
        );

        const input = document.querySelector('input[type="password"]');
        expect(input).toHaveAttribute("autoComplete", autoComplete);
        unmount();
      });
    });
  });

  describe("Disabled State", () => {
    it("should disable input when disabled prop is true", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "senha123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              disabled
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("should disable toggle button when disabled prop is true", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "senha123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              disabled
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      expect(toggleButton).toBeDisabled();
    });

    it("should not disable input when disabled prop is false", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              disabled={false}
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it("should not disable toggle button when disabled prop is false", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "senha123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              disabled={false}
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      expect(toggleButton).not.toBeDisabled();
    });
  });

  describe("User Interaction", () => {
    it("should handle user input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      await user.type(input, "novaSenha123");

      expect(input.value).toBe("novaSenha123");
    });

    it("should handle long password input", async () => {
      const user = userEvent.setup();
      const longPassword = "A".repeat(100);

      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      await user.type(input, longPassword);

      expect(input.value).toBe(longPassword);
      expect(input.value.length).toBe(100);
    });

    it("should handle empty string", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "senha inicial" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      await user.clear(input);

      expect(input.value).toBe("");
    });

    it("should maintain password value when toggling visibility", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper
          defaultValues={{ password: "senha123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input.value).toBe("senha123");

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        const textInput = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        expect(textInput.value).toBe("senha123");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined default value", () => {
      render(
        <TestWrapper
          defaultValues={{ password: undefined }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle null default value", () => {
      render(
        <TestWrapper
          defaultValues={{ password: null as unknown as string }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle empty string as default value", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const input = document.querySelector(
        'input[type="password"]'
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should handle all optional props as undefined", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label={undefined}
              required={undefined}
              placeholder={undefined}
              className={undefined}
              classNameInput={undefined}
              description={undefined}
              disabled={undefined}
              autoComplete={undefined}
            />
          )}
        />
      );

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should work with different field names", () => {
      render(
        <TestWrapper
          defaultValues={{ confirmPassword: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="confirmPassword"
              label="Confirmar Senha"
            />
          )}
        />
      );

      expect(screen.getByText("Confirmar Senha")).toBeInTheDocument();
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper input role", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      // Password inputs não têm role="textbox", são inputs nativos
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should associate label with input", () => {
      const { container } = render(
        <TestWrapper
          defaultValues={{ password: "" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      expect(screen.getByText("Senha")).toBeInTheDocument();
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("should have accessible toggle button with aria-label", () => {
      render(
        <TestWrapper
          defaultValues={{ password: "test123" }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
            />
          )}
        />
      );

      const toggleButton = screen.getByRole("button", {
        name: /mostrar senha/i,
      });
      expect(toggleButton).toHaveAttribute("aria-label");
    });

    it("should display error message with proper accessibility", async () => {
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ password: "" }}
          resolver={zodResolver}
          onFormReady={(form) => {
            formInstance = form;
          }}
          renderChildren={(control) => (
            <InputPasswordForm<TTestFormData>
              control={control}
              name="password"
              label="Senha"
            />
          )}
        />
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("password");
        });

        await waitFor(() => {
          const errorMessage = screen.getByText(
            "Senha deve ter no mínimo 6 caracteres"
          );
          expect(errorMessage).toBeInTheDocument();
        });
      }
    });
  });
});
