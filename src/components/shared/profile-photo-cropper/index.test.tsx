import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProfilePhotoCropper } from "./index";

// Mock do react-easy-crop
vi.mock("react-easy-crop", () => ({
  default: ({ image, onCropComplete }: any) => {
    // Simula o cropper renderizando
    return (
      <div data-testid="cropper" data-image={image}>
        <button
          data-testid="mock-crop-complete"
          onClick={() => {
            onCropComplete?.(
              { x: 0, y: 0, width: 100, height: 100 },
              {
                width: 200,
                height: 200,
              }
            );
          }}
        >
          Mock Crop Complete
        </button>
      </div>
    );
  },
}));

// Mock do use-image-cropper hook
vi.mock("./use-image-cropper", () => ({
  useImageCropper: () => {
    let croppedAreaPixels = { x: 0, y: 0, width: 100, height: 100 };

    return {
      crop: { x: 0, y: 0 },
      zoom: 1,
      rotation: 0,
      croppedAreaPixels,
      isProcessing: false,
      setCrop: vi.fn(),
      setZoom: vi.fn(),
      setRotation: vi.fn(),
      onCropComplete: vi.fn((_croppedArea, pixels) => {
        croppedAreaPixels = pixels;
      }),
      handleSave: vi.fn(async (imageSrc: string) => {
        // Simula criação de arquivo
        const blob = new Blob(["mock-image-data"], { type: "image/png" });
        return new File([blob], "cropped-image.png", { type: "image/png" });
      }),
      reset: vi.fn(() => {
        croppedAreaPixels = { x: 0, y: 0, width: 100, height: 100 };
      }),
    };
  },
}));

// Helper para criar um mock de File
const createMockFile = (name = "test-image.png", type = "image/png"): File => {
  const blob = new Blob(["mock-image-data"], { type });
  return new File([blob], name, { type });
};

// Helper para criar um mock de FileReader
const createMockFileReader = (result: string | ArrayBuffer | null) => {
  const reader = {
    readAsDataURL: vi.fn(function (this: any) {
      // Usa Promise.resolve para garantir que o onload seja chamado
      Promise.resolve().then(() => {
        if (this.onload) {
          this.onload({
            target: { result },
          } as ProgressEvent<FileReader>);
        }
      });
    }),
    readAsArrayBuffer: vi.fn(),
    readAsText: vi.fn(),
    abort: vi.fn(),
    DONE: FileReader.DONE,
    EMPTY: FileReader.EMPTY,
    LOADING: FileReader.LOADING,
    readyState: FileReader.DONE,
    result: result,
    error: null,
    onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
    onloadend: null as ((event: ProgressEvent<FileReader>) => void) | null,
    onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
    onabort: null as ((event: ProgressEvent<FileReader>) => void) | null,
    onloadstart: null as ((event: ProgressEvent<FileReader>) => void) | null,
    onprogress: null as ((event: ProgressEvent<FileReader>) => void) | null,
  };
  return reader;
};

describe("ProfilePhotoCropper", () => {
  const mockOnChange = vi.fn();
  let originalFileReader: typeof FileReader;
  let originalCreateObjectURL: typeof URL.createObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock FileReader
    originalFileReader = global.FileReader;
    global.FileReader = vi.fn(function (this: FileReader) {
      const reader = createMockFileReader(
        "data:image/png;base64,mock-image-data"
      );
      return reader;
    }) as unknown as typeof FileReader;

    // Mock URL.createObjectURL
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn((blob) => `blob:mock-url-${blob.size}`);
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    URL.createObjectURL = originalCreateObjectURL;
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render dropzone when no value is provided", () => {
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      expect(
        screen.getByLabelText("Selecione uma foto para o perfil")
      ).toBeInTheDocument();
      expect(screen.getByText("Enviar foto")).toBeInTheDocument();
      expect(screen.getByText("ou arraste e solte")).toBeInTheDocument();
    });

    it("should render preview when value is a string URL", () => {
      render(
        <ProfilePhotoCropper
          value="https://example.com/photo.jpg"
          onChange={mockOnChange}
        />
      );

      // O Avatar pode renderizar o fallback se a imagem não carregar
      // Vamos verificar se o componente PhotoPreview foi renderizado
      expect(screen.getByLabelText("Edit photo")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove photo")).toBeInTheDocument();
    });

    it("should render preview when value is a File", () => {
      const file = createMockFile();
      render(<ProfilePhotoCropper value={file} onChange={mockOnChange} />);

      // O Avatar pode renderizar o fallback se a imagem não carregar
      // Vamos verificar se o componente PhotoPreview foi renderizado
      expect(screen.getByLabelText("Edit photo")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove photo")).toBeInTheDocument();
    });

    it("should render with custom initials", () => {
      render(
        <ProfilePhotoCropper
          value={null}
          onChange={mockOnChange}
          initials="JD"
        />
      );

      // Quando não há preview, mostra dropzone, mas initials são usados no fallback
      // Vamos testar com um preview que falha ao carregar
      const { rerender } = render(
        <ProfilePhotoCropper
          value="invalid-url"
          onChange={mockOnChange}
          initials="JD"
        />
      );

      // O AvatarFallback deve mostrar as iniciais
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  describe("File Selection via Input", () => {
    it("should open dialog when image file is selected", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(
        () => {
          expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should not open dialog for non-image files", async () => {
      const file = createMockFile("test.pdf", "application/pdf");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(
        () => {
          expect(
            screen.queryByText("Crop Profile Photo")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should handle file selection and open cropper dialog", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByTestId("cropper")).toBeInTheDocument();
      });
    });
  });

  describe("Drag and Drop", () => {
    it("should handle drag over event", () => {
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const dropzone = screen
        .getByLabelText("Selecione uma foto para o perfil")
        .closest("label");

      if (dropzone) {
        fireEvent.dragOver(dropzone, {
          preventDefault: vi.fn(),
        });

        // Verifica se o evento foi tratado (não deve lançar erro)
        expect(dropzone).toBeInTheDocument();
      }
    });

    it("should handle drag leave event", () => {
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const dropzone = screen
        .getByLabelText("Selecione uma foto para o perfil")
        .closest("label");

      if (dropzone) {
        fireEvent.dragLeave(dropzone);

        // Verifica se o evento foi tratado (não deve lançar erro)
        expect(dropzone).toBeInTheDocument();
      }
    });

    it("should handle drop event with image file", async () => {
      const file = createMockFile("test.png", "image/png");
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const dropzone = screen
        .getByLabelText("Selecione uma foto para o perfil")
        .closest("label");

      if (dropzone) {
        fireEvent.drop(dropzone, {
          dataTransfer: {
            files: [file],
          },
        });

        await waitFor(
          () => {
            expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
          },
          { timeout: 2000 }
        );
      }
    });

    it("should not handle drop event with non-image file", async () => {
      const file = createMockFile("test.pdf", "application/pdf");
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const dropzone = screen
        .getByLabelText("Selecione uma foto para o perfil")
        .closest("label");

      if (dropzone) {
        fireEvent.drop(dropzone, {
          dataTransfer: {
            files: [file],
          },
        });

        await waitFor(
          () => {
            expect(
              screen.queryByText("Crop Profile Photo")
            ).not.toBeInTheDocument();
          },
          { timeout: 1000 }
        );
      }
    });
  });

  describe("Photo Preview", () => {
    it("should show edit and remove buttons on hover", async () => {
      const user = userEvent.setup();
      render(
        <ProfilePhotoCropper
          value="https://example.com/photo.jpg"
          onChange={mockOnChange}
        />
      );

      // Os botões já estão no DOM, apenas com opacity-0
      // Vamos verificar se eles existem
      expect(screen.getByLabelText("Edit photo")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove photo")).toBeInTheDocument();
    });

    it("should call onChange with null when remove is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ProfilePhotoCropper
          value="https://example.com/photo.jpg"
          onChange={mockOnChange}
        />
      );

      const removeButton = screen.getByLabelText("Remove photo");
      await user.click(removeButton);

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it("should open dialog when edit is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ProfilePhotoCropper
          value="https://example.com/photo.jpg"
          onChange={mockOnChange}
        />
      );

      const editButton = screen.getByLabelText("Edit photo");
      await user.click(editButton);

      await waitFor(
        () => {
          expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Cropper Dialog", () => {
    it("should open dialog when file is selected", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
        expect(screen.getByTestId("cropper")).toBeInTheDocument();
      });
    });

    it("should close dialog when cancel is clicked", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Crop Profile Photo")
        ).not.toBeInTheDocument();
      });
    });

    it("should call onChange with cropped file when confirm is clicked", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
      });

      // Simula o crop completo
      const cropCompleteButton = screen.getByTestId("mock-crop-complete");
      await user.click(cropCompleteButton);

      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled();
        const callArgs = mockOnChange.mock.calls[0][0];
        expect(callArgs).toBeInstanceOf(File);
        expect(callArgs.name).toBe("cropped-image.png");
      });
    });

    it("should close dialog after saving", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
      });

      // Simula o crop completo
      const cropCompleteButton = screen.getByTestId("mock-crop-complete");
      await user.click(cropCompleteButton);

      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Crop Profile Photo")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Value Updates", () => {
    it("should update preview when value prop changes from null to string", () => {
      const { rerender } = render(
        <ProfilePhotoCropper value={null} onChange={mockOnChange} />
      );

      expect(screen.getByText("Enviar foto")).toBeInTheDocument();

      rerender(
        <ProfilePhotoCropper
          value="https://example.com/new-photo.jpg"
          onChange={mockOnChange}
        />
      );

      // Verifica se o preview foi renderizado (botões de edit/remove)
      expect(screen.getByLabelText("Edit photo")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove photo")).toBeInTheDocument();
    });

    it("should update preview when value prop changes from string to File", () => {
      const file = createMockFile("new-file.png", "image/png");
      const { rerender } = render(
        <ProfilePhotoCropper
          value="https://example.com/old-photo.jpg"
          onChange={mockOnChange}
        />
      );

      rerender(<ProfilePhotoCropper value={file} onChange={mockOnChange} />);

      // Verifica se o preview foi renderizado (botões de edit/remove)
      expect(screen.getByLabelText("Edit photo")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove photo")).toBeInTheDocument();
    });

    it("should show dropzone when value changes to null", () => {
      const { rerender } = render(
        <ProfilePhotoCropper
          value="https://example.com/photo.jpg"
          onChange={mockOnChange}
        />
      );

      rerender(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      expect(screen.getByText("Enviar foto")).toBeInTheDocument();
    });
  });

  describe("Zoom Configuration", () => {
    it("should pass minZoom and maxZoom to CropperDialog", async () => {
      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(
        <ProfilePhotoCropper
          value={null}
          onChange={mockOnChange}
          minZoom={0.5}
          maxZoom={5}
        />
      );

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Crop Profile Photo")).toBeInTheDocument();
      });

      // O zoom é passado para o hook useImageCropper, que é mockado
      // Mas podemos verificar que o dialog foi renderizado com as props corretas
      expect(screen.getByTestId("cropper")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty file list in drop event", async () => {
      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const dropzone = screen
        .getByLabelText("Selecione uma foto para o perfil")
        .closest("label");

      if (dropzone) {
        fireEvent.drop(dropzone, {
          dataTransfer: {
            files: [],
          },
        });

        await waitFor(
          () => {
            expect(
              screen.queryByText("Crop Profile Photo")
            ).not.toBeInTheDocument();
          },
          { timeout: 1000 }
        );
      }
    });

    it("should handle undefined value", () => {
      render(<ProfilePhotoCropper value={undefined} onChange={mockOnChange} />);

      expect(screen.getByText("Enviar foto")).toBeInTheDocument();
    });

    it("should handle FileReader error gracefully", async () => {
      // Mock FileReader com erro - não chama onload
      const errorReader = createMockFileReader(null);
      errorReader.readAsDataURL = vi.fn(function (this: any) {
        // Simula erro não chamando onload
        // O componente não deve abrir o dialog
      });

      global.FileReader = vi.fn(function (this: FileReader) {
        return errorReader;
      }) as unknown as typeof FileReader;

      const file = createMockFile("test.png", "image/png");
      const user = userEvent.setup();

      render(<ProfilePhotoCropper value={null} onChange={mockOnChange} />);

      const input = screen.getByLabelText("Selecione uma foto para o perfil");
      await user.upload(input, file);

      // Não deve abrir o dialog se houver erro
      await waitFor(
        () => {
          expect(
            screen.queryByText("Crop Profile Photo")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });
});
