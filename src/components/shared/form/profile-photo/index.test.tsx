import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { ProfilePhotoForm } from "./index";

// Mock do ProfilePhotoCropper
const mockOnChange = vi.fn();
vi.mock("../../profile-photo-cropper", () => ({
  ProfilePhotoCropper: ({
    value,
    onChange,
    initials,
  }: {
    value: unknown;
    onChange: (value: unknown) => void;
    initials: string;
  }) => (
    <div data-testid="profile-photo-cropper">
      <span data-testid="cropper-value">{String(value ?? "null")}</span>
      <span data-testid="cropper-initials">{initials}</span>
      <button
        data-testid="cropper-change-button"
        onClick={() => onChange("new-value")}
      >
        Change Photo
      </button>
    </div>
  ),
}));

// Schema de validação para testes
const testSchema = z.object({
  photo: z.string().optional(),
  avatar: z.string().optional(),
});

type TTestFormData = z.infer<typeof testSchema>;

// Helper para criar um componente wrapper com form
const TestWrapper = ({
  children,
  defaultValues = {},
  resolver,
  onFormReady,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<TTestFormData>;
  resolver?: typeof zodResolver;
  onFormReady?: (form: ReturnType<typeof useForm<TTestFormData>>) => void;
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
    <FormProvider {...form}>
      <Form {...form}>{children}</Form>
    </FormProvider>
  );
};

describe("ProfilePhotoForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with all required props", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="Foto de Perfil" />
        </TestWrapper>
      );

      expect(screen.getByText("Foto de Perfil")).toBeInTheDocument();
      expect(screen.getByTestId("profile-photo-cropper")).toBeInTheDocument();
      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("JD");
    });

    it("should render with custom className", () => {
      const { container } = render(
        <TestWrapper>
          <ProfilePhotoForm
            initials="AB"
            name="photo"
            label="Avatar"
            className="custom-class"
          />
        </TestWrapper>
      );

      const formItem = container.querySelector(".custom-class");
      expect(formItem).toBeInTheDocument();
    });

    it("should render without className", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="XY" name="photo" label="Profile Photo" />
        </TestWrapper>
      );

      expect(screen.getByText("Profile Photo")).toBeInTheDocument();
      expect(screen.getByTestId("profile-photo-cropper")).toBeInTheDocument();
    });

    it("should render with different initials", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="TS" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("TS");
    });

    it("should apply default initials when initials is empty string", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="" name="photo" label="Photo" />
        </TestWrapper>
      );

      // O componente usa initials || "U" como fallback
      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("U");
    });
  });

  describe("Form Integration", () => {
    it("should bind to form control and display default value", () => {
      render(
        <TestWrapper defaultValues={{ photo: "https://example.com/photo.jpg" }}>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-value")).toHaveTextContent(
        "https://example.com/photo.jpg"
      );
    });

    it("should update form value when cropper onChange is called", async () => {
      const user = userEvent.setup();
      let formInstance: ReturnType<typeof useForm<TTestFormData>> | null = null;

      render(
        <TestWrapper
          defaultValues={{ photo: "" }}
          onFormReady={(form) => {
            formInstance = form;
          }}
        >
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      const changeButton = screen.getByTestId("cropper-change-button");
      await user.click(changeButton);

      await waitFor(() => {
        if (formInstance) {
          expect(formInstance.getValues("photo")).toBe("new-value");
        }
      });
    });

    it("should handle undefined form value", () => {
      render(
        <TestWrapper defaultValues={{ photo: undefined }}>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-value")).toHaveTextContent("null");
    });

    it("should handle null form value", () => {
      render(
        <TestWrapper defaultValues={{ photo: null as unknown as string }}>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-value")).toHaveTextContent("null");
    });

    it("should handle empty string form value", () => {
      render(
        <TestWrapper defaultValues={{ photo: "" }}>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-value")).toHaveTextContent("");
    });

    it("should display validation error message", async () => {
      const errorSchema = z.object({
        photo: z.string().min(1, "Foto é obrigatória"),
      });

      type TErrorFormData = z.infer<typeof errorSchema>;

      let formInstance: ReturnType<typeof useForm<TErrorFormData>> | null =
        null;

      const ErrorTestWrapper = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const form = useForm<TErrorFormData>({
          defaultValues: { photo: "" },
          resolver: zodResolver(errorSchema),
        });

        React.useEffect(() => {
          formInstance = form;
        }, [form]);

        return (
          <FormProvider {...form}>
            <Form {...form}>{children}</Form>
          </FormProvider>
        );
      };

      render(
        <ErrorTestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </ErrorTestWrapper>
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("photo");
        });

        await waitFor(() => {
          expect(screen.getByText("Foto é obrigatória")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Props and Behavior", () => {
    it("should pass correct initials to ProfilePhotoCropper", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="AB" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("AB");
    });

    it("should use default initials 'U' when initials is empty", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("U");
    });

    it("should work with different field names", () => {
      render(
        <TestWrapper defaultValues={{ avatar: "avatar-url" }}>
          <ProfilePhotoForm initials="JD" name="avatar" label="Avatar" />
        </TestWrapper>
      );

      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByTestId("cropper-value")).toHaveTextContent(
        "avatar-url"
      );
    });

    it("should apply correct layout classes", () => {
      const { container } = render(
        <TestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      const formItem = container.querySelector(".flex.flex-col.items-center");
      expect(formItem).toBeInTheDocument();
    });

    it("should apply custom className along with default classes", () => {
      const { container } = render(
        <TestWrapper>
          <ProfilePhotoForm
            initials="JD"
            name="photo"
            label="Photo"
            className="my-custom-class"
          />
        </TestWrapper>
      );

      const formItem = container.querySelector(".my-custom-class");
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass("flex", "flex-col", "items-center");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long initials string", () => {
      const longInitials = "A".repeat(100);

      render(
        <TestWrapper>
          <ProfilePhotoForm
            initials={longInitials}
            name="photo"
            label="Photo"
          />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-initials")).toHaveTextContent(
        longInitials
      );
    });

    it("should handle special characters in initials", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="@#" name="photo" label="Photo" />
        </TestWrapper>
      );

      expect(screen.getByTestId("cropper-initials")).toHaveTextContent("@#");
    });

    it("should handle very long label text", () => {
      const longLabel = "A".repeat(200);

      render(
        <TestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label={longLabel} />
        </TestWrapper>
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("should handle empty label string", () => {
      const { container } = render(
        <TestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="" />
        </TestWrapper>
      );

      const label = container.querySelector("label");
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe("");
    });

    it("should handle File object as value", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      render(
        <TestWrapper defaultValues={{ photo: file as unknown as string }}>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </TestWrapper>
      );

      // O mock simplesmente converte para string, então verifica que renderizou
      expect(screen.getByTestId("profile-photo-cropper")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper label association", () => {
      render(
        <TestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="Foto de Perfil" />
        </TestWrapper>
      );

      const label = screen.getByText("Foto de Perfil");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("text-foreground", "mb-2");
    });

    it("should render FormMessage for error display", async () => {
      const errorSchema = z.object({
        photo: z.string().min(1, "Campo obrigatório"),
      });

      type TErrorFormData = z.infer<typeof errorSchema>;

      let formInstance: ReturnType<typeof useForm<TErrorFormData>> | null =
        null;

      const ErrorTestWrapper = ({
        children,
      }: {
        children: React.ReactNode;
      }) => {
        const form = useForm<TErrorFormData>({
          defaultValues: { photo: "" },
          resolver: zodResolver(errorSchema),
        });

        React.useEffect(() => {
          formInstance = form;
        }, [form]);

        return (
          <FormProvider {...form}>
            <Form {...form}>{children}</Form>
          </FormProvider>
        );
      };

      render(
        <ErrorTestWrapper>
          <ProfilePhotoForm initials="JD" name="photo" label="Photo" />
        </ErrorTestWrapper>
      );

      await waitFor(() => {
        expect(formInstance).not.toBeNull();
      });

      if (formInstance) {
        await act(async () => {
          await formInstance.trigger("photo");
        });

        await waitFor(() => {
          expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
        });
      }
    });
  });
});
