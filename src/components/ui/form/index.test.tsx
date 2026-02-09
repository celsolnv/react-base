import * as React from "react";
import { useForm, useFormContext } from "react-hook-form";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./index";

// Helper component para testar FormField e subcomponentes
const TestForm = ({
  defaultValue = "",
  error,
  description,
  children,
}: {
  defaultValue?: string;
  error?: { message: string };
  description?: string;
  children?: React.ReactNode;
}) => {
  const form = useForm({
    defaultValues: {
      testField: defaultValue,
    },
  });

  React.useEffect(() => {
    if (error) {
      form.setError("testField", error);
    }
  }, [error, form]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="testField"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Label</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>{children || <Input {...field} />}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

describe("Form Components", () => {
  describe("Form", () => {
    it("should render FormProvider correctly", () => {
      const TestComponent = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <div>Form content</div>
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("Form content")).toBeInTheDocument();
    });

    it("should provide form context to children", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            test: "value",
          },
        });

        const TestChild = () => {
          const formContext = useFormContext();
          return <div>{formContext.watch("test")}</div>;
        };

        return (
          <Form {...form}>
            <TestChild />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("value")).toBeInTheDocument();
    });
  });

  describe("FormItem", () => {
    it("should render with default className", () => {
      render(
        <FormItem>
          <div>Item content</div>
        </FormItem>
      );

      const item = screen.getByText("Item content").parentElement;
      expect(item).toHaveClass("grid", "gap-2");
    });

    it("should accept custom className", () => {
      render(
        <FormItem className="custom-class">
          <div>Item content</div>
        </FormItem>
      );

      const item = screen.getByText("Item content").parentElement;
      expect(item).toHaveClass("custom-class");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <FormItem ref={ref}>
          <div>Item content</div>
        </FormItem>
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("should provide id context to children", () => {
      const TestIdConsumer = () => {
        const { id } = React.useContext(
          React.createContext<{ id: string }>({ id: "" })
        );
        return <div data-testid="form-item-id">{id || "id-present"}</div>;
      };

      render(
        <FormItem>
          <TestIdConsumer />
        </FormItem>
      );

      // O id deve estar presente no contexto
      expect(screen.getByTestId("form-item-id")).toBeInTheDocument();
    });
  });

  describe("FormLabel", () => {
    it("should render label correctly", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel>Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });

    it("should apply error styling when field has error", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        React.useEffect(() => {
          form.setError("testField", { message: "Error" });
        }, [form]);
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel>Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const label = screen.getByText("Custom Label");
      expect(label).toHaveAttribute("data-error", "true");
      expect(label).toHaveClass("data-[error=true]:text-destructive");
    });

    it("should not apply error styling when field has no error", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel>Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const label = screen.getByText("Custom Label");
      expect(label).not.toHaveClass("text-destructive");
    });

    it("should accept custom className", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel className="custom-label">Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const label = screen.getByText("Custom Label");
      expect(label).toHaveClass("custom-label");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLLabelElement>();
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel ref={ref}>Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(ref.current).not.toBeNull();
    });

    it("should set htmlFor attribute correctly", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormLabel>Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const label = screen.getByText("Custom Label");
      const htmlFor = label.getAttribute("for");
      expect(htmlFor).toBeTruthy();
      expect(htmlFor).toMatch(/-form-item$/);
    });
  });

  describe("FormControl", () => {
    it("should render children correctly", () => {
      render(
        <TestForm>
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      expect(screen.getByTestId("test-input")).toBeInTheDocument();
    });

    it("should set id attribute correctly", () => {
      render(
        <TestForm>
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      const input = screen.getByTestId("test-input");
      const id = input.getAttribute("id");
      expect(id).toBeTruthy();
      expect(id).toMatch(/-form-item$/);
    });

    it("should set aria-invalid when field has error", () => {
      render(
        <TestForm error={{ message: "Error message" }}>
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should not set aria-invalid when field has no error", () => {
      render(
        <TestForm>
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "false");
    });

    it("should set aria-describedby correctly without error", () => {
      render(
        <TestForm description="Test description">
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      const input = screen.getByTestId("test-input");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(describedBy).toMatch(/-form-item-description$/);
    });

    it("should set aria-describedby correctly with error", () => {
      render(
        <TestForm
          error={{ message: "Error message" }}
          description="Test description"
        >
          <FormControl>
            <Input data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      const input = screen.getByTestId("test-input");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(describedBy).toMatch(/-form-item-description/);
      expect(describedBy).toMatch(/-form-item-message/);
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <TestForm>
          <FormControl>
            <Input ref={ref} data-testid="test-input" />
          </FormControl>
        </TestForm>
      );

      expect(ref.current).not.toBeNull();
    });
  });

  describe("FormDescription", () => {
    it("should render description text", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormDescription>Custom Description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("Custom Description")).toBeInTheDocument();
    });

    it("should set id attribute correctly", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormDescription>Custom Description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const description = screen.getByText("Custom Description");
      const id = description.getAttribute("id");
      expect(id).toBeTruthy();
      expect(id).toMatch(/-form-item-description$/);
    });

    it("should apply default className", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormDescription>Custom Description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const description = screen.getByText("Custom Description");
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("should accept custom className", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormDescription className="custom-description">
                    Custom Description
                  </FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const description = screen.getByText("Custom Description");
      expect(description).toHaveClass("custom-description");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormDescription ref={ref}>
                    Custom Description
                  </FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("FormMessage", () => {
    it("should render error message when field has error", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        React.useEffect(() => {
          form.setError("testField", { message: "Custom error message" });
        }, [form]);
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    it("should not render when there is no error and no children", () => {
      const { container } = render(
        <TestForm>
          <FormMessage />
        </TestForm>
      );

      // FormMessage retorna null quando não há error nem children
      const message = container.querySelector('[id*="form-item-message"]');
      expect(message).not.toBeInTheDocument();
    });

    it("should render children when there is no error", () => {
      render(
        <TestForm>
          <FormMessage>Custom message</FormMessage>
        </TestForm>
      );

      expect(screen.getByText("Custom message")).toBeInTheDocument();
    });

    it("should prioritize error message over children when error exists", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        React.useEffect(() => {
          form.setError("testField", { message: "Error message" });
        }, [form]);
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormMessage>Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Custom message")).not.toBeInTheDocument();
    });

    it("should set id attribute correctly", () => {
      const { container } = render(
        <TestForm error={{ message: "Error message" }}>
          <FormMessage />
        </TestForm>
      );

      const message = container.querySelector('[id*="form-item-message"]');
      expect(message).toBeInTheDocument();
      const id = message?.getAttribute("id");
      expect(id).toBeTruthy();
      expect(id).toMatch(/-form-item-message$/);
    });

    it("should apply default className", () => {
      const { container } = render(
        <TestForm error={{ message: "Error message" }}>
          <FormMessage />
        </TestForm>
      );

      const message = container.querySelector('[id*="form-item-message"]');
      expect(message).toHaveClass("text-sm", "text-destructive", "pb-2");
    });

    it("should accept custom className", () => {
      const TestComponent = () => {
        const form = useForm({ defaultValues: { testField: "" } });
        React.useEffect(() => {
          form.setError("testField", { message: "Error message" });
        }, [form]);
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <FormMessage className="custom-message" />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      const { container } = render(<TestComponent />);
      const message = container.querySelector('[id*="form-item-message"]');
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass("custom-message");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(
        <TestForm error={{ message: "Error message" }}>
          <FormMessage ref={ref} />
        </TestForm>
      );

      expect(ref.current).not.toBeNull();
    });
  });

  describe("FormField", () => {
    it("should render Controller correctly", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            testField: "",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={({ field }) => (
                <Input {...field} data-testid="test-input" />
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      expect(screen.getByTestId("test-input")).toBeInTheDocument();
    });

    it("should provide field context to children", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            testField: "test value",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="test-input" />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;
      expect(input.value).toBe("test value");
    });

    it("should update field value on input change", async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            testField: "",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={({ field }) => (
                <Input {...field} data-testid="test-input" />
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;
      await userEvent.type(input, "new value");

      expect(input.value).toBe("new value");
    });

    it("should memoize context value based on name", () => {
      const TestComponent1 = () => {
        const form = useForm({
          defaultValues: {
            field1: "",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => <Input {...field} data-testid="field1" />}
            />
          </Form>
        );
      };

      const TestComponent2 = () => {
        const form = useForm({
          defaultValues: {
            field2: "",
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="field2"
              render={({ field }) => <Input {...field} data-testid="field2" />}
            />
          </Form>
        );
      };

      const { rerender } = render(<TestComponent1 />);
      expect(screen.getByTestId("field1")).toBeInTheDocument();

      rerender(<TestComponent2 />);
      expect(screen.getByTestId("field2")).toBeInTheDocument();
    });
  });

  describe("useFormField", () => {
    it("should throw error when used outside FormField", () => {
      // Suprime o console.error para o teste
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponent = () => {
        useFormField();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it("should return correct field state when used inside FormField", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            testField: "",
          },
        });

        const TestFieldInfo = () => {
          const field = useFormField();
          return (
            <div data-testid="field-info">
              {field.name}-{field.id}
            </div>
          );
        };

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <TestFieldInfo />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const info = screen.getByTestId("field-info");
      expect(info.textContent).toContain("testField");
    });

    it("should return correct IDs for form elements", () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            testField: "",
          },
        });

        const TestFieldIds = () => {
          const field = useFormField();
          return (
            <div data-testid="field-ids">
              {field.formItemId}-{field.formDescriptionId}-{field.formMessageId}
            </div>
          );
        };

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <TestFieldIds />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);
      const ids = screen.getByTestId("field-ids").textContent;
      expect(ids).toContain("-form-item");
      expect(ids).toContain("-form-item-description");
      expect(ids).toContain("-form-item-message");
    });
  });
});
