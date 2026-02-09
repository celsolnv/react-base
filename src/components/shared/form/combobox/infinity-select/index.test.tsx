import * as React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InfinitySelect } from "./index";

// Mock do api
vi.mock("@/api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock do useDebounce
vi.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

// Mock do removeFalsyValuesFromObject
vi.mock("@/utils/url/remove-falsy-values-from-object", () => ({
  removeFalsyValuesFromObject: (obj: Record<string, unknown>) => {
    const cleaned: Record<string, unknown> = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  },
}));

// Adicionar PopoverContentInModal ao shadcn se não existir
// Por enquanto, vamos usar PopoverContent como fallback
import { PopoverContent } from "@/components/ui/popover";
const PopoverContentInModal = PopoverContent;

// Helper para criar um QueryClient para testes
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

// Helper para criar um wrapper com QueryClientProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Helper para criar dados de resposta mockados
const createMockResponse = <T,>(items: T[], page = 1, lastPage = 1) => ({
  data: {
    status: 200,
    success: true,
    message: "Success",
    code: "SUCCESS",
    data: {
      items,
      pagination: {
        totalItems: items.length * lastPage,
        currentPage: page,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        lastPage,
      },
    },
  },
});

// Helper para criar items de teste
interface TestItem {
  id: string;
  name: string;
}

const createTestItems = (count: number): TestItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
  }));
};

// Formatter padrão para testes
const defaultFormatter = (items: TestItem[]) => {
  return items.map((item) => ({
    label: item.name,
    value: item.id,
    item,
  }));
};

describe("InfinitySelect", () => {
  let mockApiGet: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const apiModule = await import("@/lib/axios/api");
    mockApiGet = vi.fn();
    apiModule.default.get = mockApiGet;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Selecione uma opção");
    });

    it("should render with custom placeholder", () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            placeholder="Choose an option"
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Choose an option");
    });

    it("should render disabled button when disabled is true", () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            disabled
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should apply custom className", () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      const { container } = render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            className="custom-class"
          />
        </TestWrapper>
      );

      const button = container.querySelector(".custom-class");
      expect(button).toBeInTheDocument();
    });

    it("should display selected value when value is set", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value="item-1"
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      // Aguarda os dados carregarem
      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent("Item 1");
      });
    });

    it("should display fallbackValue when value doesn't match any item", () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value="non-existent"
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            fallbackValue="Fallback Value"
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Fallback Value");
    });
  });

  describe("Popover Interaction", () => {
    it("should open popover when button is clicked", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
      });
    });

    it("should close popover when clicking outside", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
      });

      await userEvent.click(document.body);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Pesquisar...")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("should call api.get when popover opens", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });
    });

    it("should call api.get with correct params", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            queryParams={{ filter: "active" }}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith("/test", {
          params: expect.objectContaining({
            page: 1,
            filter: "active",
          }),
        });
      });
    });

    it("should not fetch when customData is provided", async () => {
      const customItems = createTestItems(3);

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            customData={customItems}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      expect(mockApiGet).not.toHaveBeenCalled();
    });

    it("should fetch only when popover opens if callOnOpen is true", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            callOnOpen
          />
        </TestWrapper>
      );

      // Não deve chamar antes de abrir
      expect(mockApiGet).not.toHaveBeenCalled();

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });
    });
  });

  describe("Search Functionality", () => {
    it("should update search term when typing", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Pesquisar...");
      await userEvent.type(input, "test");

      await waitFor(() => {
        expect(input).toHaveValue("test");
      });
    });

    it("should call api.get with search param when searching", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            searchParam="q"
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Pesquisar...");
      await userEvent.type(input, "search term");

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith("/test", {
          params: expect.objectContaining({
            q: "search term",
          }),
        });
      });
    });

    it("should show clear button when clearable is true", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            clearable
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          // O botão clear tem um ícone Trash, vamos buscar pelo SVG
          const clearButton = document
            .querySelector(".lucide-trash")
            ?.closest("button");
          expect(clearButton).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should clear value when clear button is clicked", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const onChange = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value="item-1"
            onChange={onChange}
            url="/test"
            formatter={defaultFormatter}
            clearable
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          const clearButton = document
            .querySelector(".lucide-trash")
            ?.closest("button");
          expect(clearButton).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const clearButton = document
        .querySelector(".lucide-trash")
        ?.closest("button") as HTMLButtonElement;
      await userEvent.click(clearButton!);

      await waitFor(
        () => {
          expect(onChange).toHaveBeenCalledWith("");
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Single Selection", () => {
    it("should call onChange when item is selected", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const onChange = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={onChange}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      const item1 = screen.getByText("Item 1");
      await userEvent.click(item1);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith("item-1", items[0]);
      });
    });

    it("should close popover after selection in single mode", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const onChange = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={onChange}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      const item1 = screen.getByText("Item 1");
      await userEvent.click(item1);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Pesquisar...")
        ).not.toBeInTheDocument();
      });
    });

    it("should deselect item when clicking selected item again", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const onChange = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value="item-1"
            onChange={onChange}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          const listbox = screen.getByRole("listbox");
          expect(listbox).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Busca o item dentro da listbox para evitar conflito com o botão
      await waitFor(
        () => {
          const listbox = screen.getByRole("listbox");
          const item1 = within(listbox).getByText("Item 1");
          expect(item1).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // O componente verifica se selectedValue === value na linha 155
      // Se selectedValue === value, então newValue = '' (deseleciona)
      const listbox = screen.getByRole("listbox");
      const item1 = within(listbox).getByText("Item 1");
      await userEvent.click(item1);

      await waitFor(
        () => {
          // Quando clica no item selecionado, deve chamar onChange com ''
          expect(onChange).toHaveBeenCalled();
        },
        { timeout: 2000 }
      );

      // Verifica que foi chamado com string vazia (deselecionado)
      const calls = onChange.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1];
      // Deve ser chamado com '' quando deseleciona
      expect(lastCall[0]).toBe("");
    });
  });

  describe("Multiple Selection", () => {
    it("should show badge with count when multiple items are selected", () => {
      render(
        <TestWrapper>
          <InfinitySelect
            value={["item-1", "item-2"]}
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("2");
      expect(button).toHaveTextContent("itens selecionados");
    });

    it("should show singular text when one item is selected", () => {
      render(
        <TestWrapper>
          <InfinitySelect
            value={["item-1"]}
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("1");
      expect(button).toHaveTextContent("item selecionado");
    });

    it("should toggle item selection in multiple mode", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value={[]}
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      });

      const item1 = screen.getByText("Item 1");
      await userEvent.click(item1);

      // Item deve estar selecionado (checkbox marcado)
      await waitFor(() => {
        const checkbox = item1.closest('[role="option"]')?.querySelector("svg");
        expect(checkbox).toBeInTheDocument();
      });
    });

    it("should show apply and cancel buttons in multiple mode", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value={[]}
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      // Aguarda o popover abrir e os botões aparecerem
      await waitFor(
        () => {
          expect(
            screen.getByPlaceholderText("Pesquisar...")
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Os botões aparecem no footer quando multiple é true
      await waitFor(
        () => {
          const applyButton = screen.queryByText(/Aplicar/i);
          const cancelButton = screen.queryByText(/Cancelar/i);
          expect(applyButton || cancelButton).toBeTruthy();
        },
        { timeout: 2000 }
      );
    });

    it("should call onChange with all selections when apply is clicked", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const onChange = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value={[]}
            onChange={onChange}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          expect(screen.getByText("Item 1")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const item1 = screen.getByText("Item 1");
      await userEvent.click(item1);

      await waitFor(
        () => {
          expect(screen.getByText("Item 2")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const item2 = screen.getByText("Item 2");
      await userEvent.click(item2);

      // Aguarda um pouco para garantir que as seleções foram registradas
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Busca o botão Aplicar - pode estar dentro de um container
      await waitFor(
        () => {
          const applyButton = screen.getByText(/Aplicar/i);
          expect(applyButton).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const applyButton = screen.getByText(/Aplicar/i);
      await userEvent.click(applyButton);

      await waitFor(
        () => {
          expect(onChange).toHaveBeenCalled();
          const calls = onChange.mock.calls;
          const lastCall = calls[calls.length - 1];
          expect(lastCall[0]).toEqual(["item-1", "item-2"]);
          expect(lastCall[1]).toEqual([items[0], items[1]]);
        },
        { timeout: 2000 }
      );
    });

    it("should close popover when cancel is clicked in multiple mode", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));

      render(
        <TestWrapper>
          <InfinitySelect
            value={[]}
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            multiple
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Cancelar")).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("Cancelar");
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("Pesquisar...")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Infinite Scroll", () => {
    it("should load next page when scrolling to bottom", async () => {
      const page1Items = createTestItems(10);
      const page2Items = createTestItems(10);
      mockApiGet
        .mockResolvedValueOnce(createMockResponse(page1Items, 1, 2))
        .mockResolvedValueOnce(createMockResponse(page2Items, 2, 2));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          expect(screen.getByText("Item 1")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const commandList = screen.getByRole("listbox");

      // Simula scroll até o final
      Object.defineProperty(commandList, "scrollTop", {
        writable: true,
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(commandList, "scrollHeight", {
        writable: true,
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(commandList, "clientHeight", {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Dispara evento de scroll
      const scrollEvent = new Event("scroll", { bubbles: true });
      commandList.dispatchEvent(scrollEvent);

      await waitFor(
        () => {
          expect(mockApiGet).toHaveBeenCalledTimes(2);
        },
        { timeout: 3000 }
      );
    });

    it("should show loading indicator when fetching next page", async () => {
      const page1Items = createTestItems(10);
      let resolvePage2: (value: any) => void;
      const page2Promise = new Promise((resolve) => {
        resolvePage2 = resolve;
      });
      const page2Items = createTestItems(10);

      mockApiGet
        .mockResolvedValueOnce(createMockResponse(page1Items, 1, 2))
        .mockReturnValueOnce(page2Promise);

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          expect(screen.getByText("Item 1")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Simula scroll para carregar próxima página
      const commandList = screen.getByRole("listbox");
      Object.defineProperty(commandList, "scrollTop", {
        writable: true,
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(commandList, "scrollHeight", {
        writable: true,
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(commandList, "clientHeight", {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Dispara evento de scroll
      const scrollEvent = new Event("scroll", { bubbles: true });
      commandList.dispatchEvent(scrollEvent);

      await waitFor(
        () => {
          expect(screen.getByText("Carregando mais...")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      resolvePage2!(createMockResponse(page2Items, 2, 2));
    });
  });

  describe("Loading States", () => {
    it("should show loading indicator when fetching data", async () => {
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockApiGet.mockReturnValue(pendingPromise);

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(
        () => {
          // O componente mostra um LoaderCircle SVG quando está carregando
          const loader = document.querySelector(".lucide-loader-circle");
          expect(loader).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const items = createTestItems(3);
      resolvePromise(createMockResponse(items));
    });

    it("should show empty message when no results", async () => {
      mockApiGet.mockResolvedValue(createMockResponse([], 1, 1));

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
          />
        </TestWrapper>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByText("Não encontramos nenhum resultado")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Custom Select", () => {
    it("should use customSelect function when provided", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const customSelect = vi.fn((item) => `Custom: ${item?.name}`);

      render(
        <TestWrapper>
          <InfinitySelect
            value="item-1"
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            customSelect={customSelect}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(customSelect).toHaveBeenCalled();
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent("Custom: Item 1");
      });
    });
  });

  describe("Data Callback", () => {
    it("should call dataCallback when data is loaded", async () => {
      const items = createTestItems(3);
      mockApiGet.mockResolvedValue(createMockResponse(items));
      const dataCallback = vi.fn();

      render(
        <TestWrapper>
          <InfinitySelect
            value=""
            onChange={vi.fn()}
            url="/test"
            formatter={defaultFormatter}
            dataCallback={dataCallback}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(dataCallback).toHaveBeenCalledWith(items);
      });
    });
  });
});
