import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { CardForm } from "./card";

// Mock do CardFormSkeleton
vi.mock("./card-form-skeleton", () => ({
  CardFormSkeleton: () => (
    <div data-testid="card-form-skeleton">Loading...</div>
  ),
}));

// Schema de validação para testes
const testSchema = z.object({
  name: z.string().optional(),
});

type TTestFormData = z.infer<typeof testSchema>;

// Mock do useFormContext para controlar formState
const mockUseFormContext = vi.fn();
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useFormContext: () => mockUseFormContext(),
  };
});

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
  formStateOverrides = {},
}: {
  children: React.ReactNode;
  defaultValues?: Partial<TTestFormData>;
  formStateOverrides?: {
    isSubmitting?: boolean;
    isLoading?: boolean;
  };
}) => {
  const form = useForm<TTestFormData>({
    defaultValues,
  });

  // Configura o mock do useFormContext
  mockUseFormContext.mockReturnValue({
    ...form,
    formState: {
      ...form.formState,
      isSubmitting:
        formStateOverrides.isSubmitting ?? form.formState.isSubmitting,
      isLoading: formStateOverrides.isLoading ?? form.formState.isLoading,
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>{children}</Form>
    </FormProvider>
  );
};

describe("CardForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockIcon = <span data-testid="test-icon">Icon</span>;
  const mockTitle = "Form Title";
  const mockDescription = "Form Description";
  const mockChildren = <div data-testid="test-children">Form Content</div>;

  describe("Rendering", () => {
    it("should render card with all props when not loading", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(mockTitle)).toBeInTheDocument();
      expect(screen.getByText(mockDescription)).toBeInTheDocument();
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByTestId("test-children")).toBeInTheDocument();
    });

    it("should render CardTitle with correct text", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title="Custom Title"
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("should render CardDescription with correct text", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description="Custom Description"
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText("Custom Description")).toBeInTheDocument();
    });

    it("should render icon in header", () => {
      const customIcon = <span data-testid="custom-icon">Custom Icon</span>;

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={customIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should render children in CardContent", () => {
      const customChildren = (
        <div data-testid="custom-children">Custom Content</div>
      );

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {customChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("custom-children")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should render CardFormSkeleton when isSubmitting is true", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: true, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("card-form-skeleton")).toBeInTheDocument();
      expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
      expect(screen.queryByTestId("test-children")).not.toBeInTheDocument();
    });

    it("should render CardFormSkeleton when isLoading is true", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: true }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("card-form-skeleton")).toBeInTheDocument();
      expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
    });

    it("should render CardFormSkeleton when both isSubmitting and isLoading are true", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: true, isLoading: true }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("card-form-skeleton")).toBeInTheDocument();
      expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
    });

    it("should render card when both isSubmitting and isLoading are false", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(
        screen.queryByTestId("card-form-skeleton")
      ).not.toBeInTheDocument();
      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should apply correct Card classes", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      const card = container.querySelector('[class*="bg-card"]');
      expect(card).toBeInTheDocument();
    });

    it("should apply correct CardHeader classes", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      const header = container.querySelector('[class*="bg-secondary/30"]');
      expect(header).toBeInTheDocument();
    });

    it("should apply correct CardContent classes", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      const content = container.querySelector('[class*="grid"]');
      expect(content).toBeInTheDocument();
    });

    it("should apply correct icon container classes", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      const iconContainer = container.querySelector(
        '[class*="bg-secondary/50"]'
      );
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title string", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm icon={mockIcon} title="" description={mockDescription}>
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      // Verifica que o componente renderiza sem erros
      expect(container.querySelector('[class*="Card"]')).toBeInTheDocument();
      expect(screen.getByTestId("test-children")).toBeInTheDocument();
    });

    it("should handle empty description string", () => {
      const { container } = render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm icon={mockIcon} title={mockTitle} description="">
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      // Verifica que o componente renderiza sem erros
      expect(container.querySelector('[class*="Card"]')).toBeInTheDocument();
      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });

    it("should handle very long title", () => {
      const longTitle = "A".repeat(500);

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={longTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle very long description", () => {
      const longDescription = "B".repeat(1000);

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={longDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("should handle null icon", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm icon={null} title={mockTitle} description={mockDescription}>
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(mockTitle)).toBeInTheDocument();
      expect(screen.getByTestId("test-children")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {null}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {undefined}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Title with @#$% & *()";

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={specialTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const specialDescription = "Description with <>&\"'";

      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={specialDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });
  });

  describe("Form Context Integration", () => {
    it("should read isSubmitting from form context", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: true, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("card-form-skeleton")).toBeInTheDocument();
    });

    it("should read isLoading from form context", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: true }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByTestId("card-form-skeleton")).toBeInTheDocument();
    });

    it("should use form context correctly", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(mockUseFormContext).toHaveBeenCalled();
      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      // CardTitle renderiza como heading
      const title = screen.getByText(mockTitle);
      expect(title).toBeInTheDocument();
    });

    it("should render description text", () => {
      render(
        <TestWrapper
          formStateOverrides={{ isSubmitting: false, isLoading: false }}
        >
          <CardForm
            icon={mockIcon}
            title={mockTitle}
            description={mockDescription}
          >
            {mockChildren}
          </CardForm>
        </TestWrapper>
      );

      expect(screen.getByText(mockDescription)).toBeInTheDocument();
    });
  });
});
