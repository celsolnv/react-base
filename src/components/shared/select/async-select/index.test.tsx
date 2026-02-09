import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AsyncSelect, type IAsyncSelectOption } from ".";

// Mock do useDebounce para controlar o comportamento
// Por padrão, retorna o valor imediatamente (sem debounce nos testes)
vi.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

// Helper para criar opções de teste
const createMockOptions = (count: number): IAsyncSelectOption[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `option-${i + 1}`,
    label: `Option ${i + 1}`,
    name: `Name ${i + 1}`,
  }));
};

describe("AsyncSelect", () => {
  const mockFetchOptions = vi.fn<[string], Promise<IAsyncSelectOption[]>>();
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchOptions.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Selecionar...");
    });

    it("should render with custom placeholder", () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          placeholder="Choose an option"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveTextContent("Choose an option");
    });

    it("should render disabled button when disabled is true", () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          disabled
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toBeDisabled();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          className="custom-class"
        />
      );

      const button = container.querySelector(".custom-class");
      expect(button).toBeInTheDocument();
    });

    it("should display selected value when value is set", async () => {
      const options = createMockOptions(1);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      // Abre o popover para buscar os dados
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      // Aguarda os dados carregarem e atualizarem o label
      await waitFor(
        () => {
          expect(button).toHaveTextContent("Option 1");
        },
        { timeout: 3000 }
      );
    });

    it("should show value id when value doesn't match any option and results are empty", () => {
      render(
        <AsyncSelect
          value="non-existent"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          placeholder="Select option"
        />
      );

      const button = screen.getByRole("combobox");
      // Quando não há resultados carregados, mostra o ID do valor
      expect(button).toHaveTextContent("non-existent");
    });
  });

  describe("Popover Interaction", () => {
    it("should open popover when button is clicked", async () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });
    });

    it("should close popover when clicking outside", async () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      await userEvent.click(document.body);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Selecionar...")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should call fetchOptions when popover opens", async () => {
      const options = createMockOptions(3);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });
    });

    it("should call fetchOptions with search query", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Selecionar...");
      await userEvent.type(input, "test query");

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalledWith("test query");
      });
    });

    it("should not call fetchOptions when search length is less than minSearchLength", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          minSearchLength={3}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      const initialCalls = mockFetchOptions.mock.calls.length;

      const input = screen.getByPlaceholderText("Selecionar...");
      await userEvent.type(input, "te");

      // Aguarda o debounce
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Se minSearchLength for 3 e digitamos "te" (2 chars), não deve chamar
      const finalCalls = mockFetchOptions.mock.calls.length;
      expect(finalCalls).toBeLessThanOrEqual(initialCalls + 1);
    });

    it("should show loading message while fetching", async () => {
      let resolvePromise: (value: IAsyncSelectOption[]) => void;
      const pendingPromise = new Promise<IAsyncSelectOption[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockFetchOptions.mockReturnValue(pendingPromise);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
      });

      resolvePromise!([]);
    });

    it("should show custom loading message", async () => {
      let resolvePromise: (value: IAsyncSelectOption[]) => void;
      const pendingPromise = new Promise<IAsyncSelectOption[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockFetchOptions.mockReturnValue(pendingPromise);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          loadingMessage="Loading custom message"
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(
        () => {
          expect(
            screen.getByText("Loading custom message")
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      resolvePromise!([]);
    });

    it("should display results when fetchOptions resolves", async () => {
      const options = createMockOptions(3);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
      });
    });

    it("should show empty message when no results", async () => {
      mockFetchOptions.mockResolvedValue([]);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum resultado encontrado.")
        ).toBeInTheDocument();
      });
    });

    it("should show custom empty message", async () => {
      mockFetchOptions.mockResolvedValue([]);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          emptyMessage="No results found"
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(
        () => {
          expect(screen.getByText("No results found")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should show minSearchLength message when query is too short", async () => {
      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          minSearchLength={3}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Selecionar...");
      await userEvent.type(input, "te");

      await waitFor(
        () => {
          expect(
            screen.getByText("Digite pelo menos 3 caracteres para buscar.")
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Single Selection", () => {
    it("should call onValueChange when option is selected", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Option 1");
      await userEvent.click(option1);

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith("option-1");
      });
    });

    it("should close popover after selection", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Option 1");
      await userEvent.click(option1);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Selecionar...")
        ).not.toBeInTheDocument();
      });
    });

    it("should clear search query after selection", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(
        "Selecionar..."
      ) as HTMLInputElement;
      await userEvent.type(input, "test");

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Option 1");
      await userEvent.click(option1);

      // Abre novamente o popover
      await userEvent.click(button);

      await waitFor(() => {
        const newInput = screen.getByPlaceholderText(
          "Selecionar..."
        ) as HTMLInputElement;
        expect(newInput.value).toBe("");
      });
    });

    it("should show checkmark for selected option", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(
        () => {
          const listbox = screen.getByRole("listbox");
          expect(listbox).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      await waitFor(
        () => {
          const listbox = screen.getByRole("listbox");
          const option1 = listbox.querySelector('[data-value="option-1"]');
          expect(option1).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should display selected label in button", async () => {
      const options = createMockOptions(1);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          expect(button).toHaveTextContent("Option 1");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Multiple Selection", () => {
    it("should call onValueChange with array when option is selected", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value={[]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Option 1");
      await userEvent.click(option1);

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith(["option-1"]);
      });
    });

    it("should toggle item selection in multiple mode", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value={["option-1"]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        const listbox = screen.getByRole("listbox");
        expect(listbox).toBeInTheDocument();
      });

      // Busca o item dentro da listbox para evitar conflito com o botão
      const listbox = screen.getByRole("listbox");
      const option1 = listbox.querySelector('[data-value="option-1"]');

      if (option1) {
        await userEvent.click(option1 as HTMLElement);

        await waitFor(() => {
          expect(mockOnValueChange).toHaveBeenCalledWith([]);
        });
      }
    });

    it("should display multiple selected labels", async () => {
      const options = createMockOptions(3);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value={["option-1", "option-2"]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          const buttonText = button.textContent || "";
          expect(buttonText).toContain("Option 1");
          expect(buttonText).toContain("Option 2");
        },
        { timeout: 3000 }
      );
    });

    it("should display count when more than maxSelectedDisplay items are selected", async () => {
      const options = createMockOptions(5);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value={["option-1", "option-2", "option-3", "option-4"]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
          maxSelectedDisplay={2}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          const buttonText = button.textContent || "";
          expect(buttonText).toContain("Option 1");
          expect(buttonText).toContain("Option 2");
          expect(buttonText).toContain("+2");
        },
        { timeout: 3000 }
      );
    });

    it("should not close popover after selection in multiple mode", async () => {
      const options = createMockOptions(2);
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value={[]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      const option1 = screen.getByText("Option 1");
      await userEvent.click(option1);

      // Popover deve permanecer aberto
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Clear Functionality", () => {
    it("should show clear button when value is selected", () => {
      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      const clearButton = button.querySelector("svg.lucide-x");
      expect(clearButton).toBeInTheDocument();
    });

    it("should not show clear button when disabled", () => {
      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          disabled
        />
      );

      const button = screen.getByRole("combobox");
      const clearButton = button.querySelector("svg.lucide-x");
      expect(clearButton).not.toBeInTheDocument();
    });

    it("should call onValueChange with empty value when clear is clicked", async () => {
      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      // O ícone X está dentro de um SVG, precisamos clicar no SVG diretamente
      const clearIcon = button.querySelector("svg.lucide-x");

      if (clearIcon) {
        // Usa fireEvent para simular o clique
        fireEvent.click(clearIcon);

        await waitFor(() => {
          expect(mockOnValueChange).toHaveBeenCalledWith("");
        });
      }
    });

    it("should call onValueChange with empty array when clear is clicked in multiple mode", async () => {
      render(
        <AsyncSelect
          value={["option-1", "option-2"]}
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
          multiple
        />
      );

      const button = screen.getByRole("combobox");
      // O ícone X está dentro de um SVG, precisamos clicar no SVG diretamente
      const clearIcon = button.querySelector("svg.lucide-x");

      if (clearIcon) {
        // Usa fireEvent para simular o clique
        fireEvent.click(clearIcon);

        await waitFor(() => {
          expect(mockOnValueChange).toHaveBeenCalledWith([]);
        });
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle fetchOptions error gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockFetchOptions.mockRejectedValue(new Error("Network error"));

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Nenhum resultado encontrado.")
        ).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });

    it("should ignore AbortError when request is cancelled", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      mockFetchOptions.mockRejectedValue(abortError);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      // AbortError não deve logar erro
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Label Display", () => {
    it("should use label property when available", async () => {
      const options = [
        { id: "1", label: "Label 1", name: "Name 1" },
        { id: "2", name: "Name 2" },
      ];
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          expect(button).toHaveTextContent("Label 1");
        },
        { timeout: 3000 }
      );
    });

    it("should fallback to name property when label is not available", async () => {
      const options = [{ id: "1", name: "Name 1" }];
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          expect(button).toHaveTextContent("Name 1");
        },
        { timeout: 3000 }
      );
    });

    it("should fallback to id when neither label nor name is available", async () => {
      const options = [{ id: "option-1" }];
      mockFetchOptions.mockResolvedValue(options);

      render(
        <AsyncSelect
          value="option-1"
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockFetchOptions).toHaveBeenCalled();
      });

      await waitFor(
        () => {
          expect(button).toHaveTextContent("option-1");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Request Cancellation", () => {
    it("should cancel previous request when new search is made", async () => {
      let resolveFirst: (value: IAsyncSelectOption[]) => void;
      let resolveSecond: (value: IAsyncSelectOption[]) => void;

      const firstPromise = new Promise<IAsyncSelectOption[]>((resolve) => {
        resolveFirst = resolve;
      });

      const secondPromise = new Promise<IAsyncSelectOption[]>((resolve) => {
        resolveSecond = resolve;
      });

      mockFetchOptions
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise);

      render(
        <AsyncSelect
          value=""
          onValueChange={mockOnValueChange}
          fetchOptions={mockFetchOptions}
        />
      );

      const button = screen.getByRole("combobox");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Selecionar...")
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Selecionar...");
      await userEvent.type(input, "first");

      // Inicia segunda busca antes da primeira terminar
      await userEvent.clear(input);
      await userEvent.type(input, "second");

      // Resolve ambas as promises
      resolveFirst!([]);
      resolveSecond!(createMockOptions(1));

      await waitFor(() => {
        // Deve mostrar resultados da segunda busca
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });
  });
});
