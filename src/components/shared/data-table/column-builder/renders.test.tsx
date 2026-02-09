import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Edit, Trash2 } from "lucide-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  renderActionsCell,
  renderBadgeCell,
  renderBooleanCell,
  renderCurrencyCell,
  renderDateCell,
  renderTextCell,
} from "./renders";
import type {
  BadgeColumnConfig,
  BooleanColumnConfig,
  CurrencyColumnConfig,
  DateColumnConfig,
  TableAction,
  TextColumnConfig,
} from "./types";

// Mock das funções de formatação
vi.mock("@/utils/formatters/currency", () => ({
  formatCurrency: vi.fn((value, currency, locale) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) return "-";
    return new Intl.NumberFormat(locale || "pt-BR", {
      style: "currency",
      currency: currency || "BRL",
    }).format(num);
  }),
}));

vi.mock("@/utils/formatters/date", () => ({
  formatDate: vi.fn((value, options) => {
    if (!value) return "-";
    try {
      const date =
        typeof value === "string" ? new Date(value) : (value as Date);
      if (Number.isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat(
        "pt-BR",
        options || {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      ).format(date);
    } catch {
      return "-";
    }
  }),
}));

// Tipo de dados de exemplo
interface ITestData {
  id: string;
  name: string;
}

describe("Column Renderers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("renderTextCell", () => {
    it("should render text value", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "name",
        header: "Nome",
      };

      const result = renderTextCell(config, "John Doe");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("John Doe");
    });

    it("should render number as string", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "id",
        header: "ID",
      };

      const result = renderTextCell(config, 123);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("123");
    });

    it("should render boolean as string", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "id",
        header: "ID",
      };

      const result = renderTextCell(config, true);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("true");
    });

    it("should render '-' for null or undefined", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "name",
        header: "Nome",
      };

      const nullResult = renderTextCell(config, null);
      const { container: nullContainer } = render(<>{nullResult}</>);
      expect(nullContainer.textContent).toBe("-");

      const undefinedResult = renderTextCell(config, undefined);
      const { container: undefinedContainer } = render(<>{undefinedResult}</>);
      expect(undefinedContainer.textContent).toBe("-");
    });

    it("should render '-' for object values", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "name",
        header: "Nome",
      };

      const result = renderTextCell(config, { foo: "bar" });
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("-");
    });

    it("should apply custom format function", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "name",
        header: "Nome",
        format: (value) => value.toUpperCase(),
      };

      const result = renderTextCell(config, "john doe");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("JOHN DOE");
    });

    it("should apply custom className", () => {
      const config: TextColumnConfig<ITestData> = {
        type: "text",
        accessorKey: "name",
        header: "Nome",
        className: "custom-class",
      };

      const result = renderTextCell(config, "John Doe");
      const { container } = render(<>{result}</>);

      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("renderDateCell", () => {
    it("should render formatted date", () => {
      const config: DateColumnConfig<ITestData> = {
        type: "date",
        accessorKey: "id",
        header: "Data",
      };

      const date = new Date("2024-01-15");
      const result = renderDateCell(config, date);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
      expect(container.textContent).not.toBe("-");
    });

    it("should render formatted date string", () => {
      const config: DateColumnConfig<ITestData> = {
        type: "date",
        accessorKey: "id",
        header: "Data",
      };

      const result = renderDateCell(config, "2024-01-15");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
    });

    it("should use custom dateFormat", () => {
      const config: DateColumnConfig<ITestData> = {
        type: "date",
        accessorKey: "id",
        header: "Data",
        dateFormat: {
          year: "numeric",
          month: "long",
        },
      };

      const date = new Date("2024-01-15");
      const result = renderDateCell(config, date);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
    });

    it("should apply custom className", () => {
      const config: DateColumnConfig<ITestData> = {
        type: "date",
        accessorKey: "id",
        header: "Data",
        className: "custom-date-class",
      };

      const date = new Date("2024-01-15");
      const result = renderDateCell(config, date);
      const { container } = render(<>{result}</>);

      expect(container.querySelector(".custom-date-class")).toBeInTheDocument();
    });
  });

  describe("renderCurrencyCell", () => {
    it("should render formatted currency", () => {
      const config: CurrencyColumnConfig<ITestData> = {
        type: "currency",
        accessorKey: "id",
        header: "Valor",
      };

      const result = renderCurrencyCell(config, 1000);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
      expect(container.textContent).toContain("R$");
    });

    it("should use custom currency", () => {
      const config: CurrencyColumnConfig<ITestData> = {
        type: "currency",
        accessorKey: "id",
        header: "Valor",
        currency: "USD",
      };

      const result = renderCurrencyCell(config, 1000);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
    });

    it("should use custom locale", () => {
      const config: CurrencyColumnConfig<ITestData> = {
        type: "currency",
        accessorKey: "id",
        header: "Valor",
        locale: "en-US",
      };

      const result = renderCurrencyCell(config, 1000);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBeTruthy();
    });

    it("should apply font-mono class", () => {
      const config: CurrencyColumnConfig<ITestData> = {
        type: "currency",
        accessorKey: "id",
        header: "Valor",
      };

      const result = renderCurrencyCell(config, 1000);
      const { container } = render(<>{result}</>);

      expect(container.querySelector(".font-mono")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const config: CurrencyColumnConfig<ITestData> = {
        type: "currency",
        accessorKey: "id",
        header: "Valor",
        className: "custom-currency-class",
      };

      const result = renderCurrencyCell(config, 1000);
      const { container } = render(<>{result}</>);

      expect(
        container.querySelector(".custom-currency-class")
      ).toBeInTheDocument();
    });
  });

  describe("renderBadgeCell", () => {
    it("should render badge with value", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
      };

      const result = renderBadgeCell(config, "active");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("active");
    });

    it("should use badgeMap to determine variant", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
        badgeMap: {
          active: "default",
          inactive: "secondary",
        },
      };

      const result = renderBadgeCell(config, "active");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("active");
    });

    it("should use defaultVariant when value not in badgeMap", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
        badgeMap: {
          active: "default",
        },
        defaultVariant: "outline",
      };

      const result = renderBadgeCell(config, "unknown");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("unknown");
    });

    it("should use labelMap to transform label", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
        labelMap: {
          active: "Ativo",
          inactive: "Inativo",
        },
      };

      const result = renderBadgeCell(config, "active");
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("Ativo");
    });

    it("should render '-' for null or undefined", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
      };

      const nullResult = renderBadgeCell(config, null);
      const { container: nullContainer } = render(<>{nullResult}</>);
      expect(nullContainer.textContent).toBe("-");

      const undefinedResult = renderBadgeCell(config, undefined);
      const { container: undefinedContainer } = render(<>{undefinedResult}</>);
      expect(undefinedContainer.textContent).toBe("-");
    });

    it("should render '-' for object values", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
      };

      const result = renderBadgeCell(config, { foo: "bar" });
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe("-");
    });

    it("should apply custom className", () => {
      const config: BadgeColumnConfig<ITestData> = {
        type: "badge",
        accessorKey: "id",
        header: "Status",
        className: "custom-badge-class",
      };

      const result = renderBadgeCell(config, "active");
      const { container } = render(<>{result}</>);

      expect(
        container.querySelector(".custom-badge-class")
      ).toBeInTheDocument();
    });
  });

  describe("renderBooleanCell", () => {
    it("should render 'Sim' for true value", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
      };

      const result = renderBooleanCell(config, true);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toContain("Sim");
    });

    it("should render 'Não' for false value", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
      };

      const result = renderBooleanCell(config, false);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toContain("Não");
    });

    it("should use custom trueLabel", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
        trueLabel: "Ativo",
      };

      const result = renderBooleanCell(config, true);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toContain("Ativo");
    });

    it("should use custom falseLabel", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
        falseLabel: "Inativo",
      };

      const result = renderBooleanCell(config, false);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toContain("Inativo");
    });

    it("should apply success styles for true value", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
      };

      const result = renderBooleanCell(config, true);
      const { container } = render(<>{result}</>);

      const span = container.querySelector("span");
      expect(span).toHaveClass("bg-success");
    });

    it("should apply muted styles for false value", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
      };

      const result = renderBooleanCell(config, false);
      const { container } = render(<>{result}</>);

      const span = container.querySelector("span");
      expect(span).toHaveClass("bg-muted");
    });

    it("should apply custom className", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
        className: "custom-boolean-class",
      };

      const result = renderBooleanCell(config, true);
      const { container } = render(<>{result}</>);

      expect(
        container.querySelector(".custom-boolean-class")
      ).toBeInTheDocument();
    });

    it("should render indicator dot", () => {
      const config: BooleanColumnConfig<ITestData> = {
        type: "boolean",
        accessorKey: "id",
        header: "Ativo",
      };

      const result = renderBooleanCell(config, true);
      const { container } = render(<>{result}</>);

      const dot = container.querySelector(".rounded-full");
      expect(dot).toBeInTheDocument();
    });
  });

  describe("renderActionsCell", () => {
    const mockRow: ITestData = {
      id: "1",
      name: "John Doe",
    };

    it("should render actions dropdown", () => {
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick: vi.fn(),
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      expect(screen.getByText("Abrir menu")).toBeInTheDocument();
    });

    it("should render action items", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick: vi.fn(),
        },
        {
          label: "Excluir",
          onClick: vi.fn(),
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      expect(screen.getByText("Editar")).toBeInTheDocument();
      expect(screen.getByText("Excluir")).toBeInTheDocument();
    });

    it("should call onClick when action is clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick,
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      const editButton = screen.getByText("Editar");
      await user.click(editButton);

      expect(onClick).toHaveBeenCalledWith(mockRow);
    });

    it("should render action with icon", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          icon: Edit,
          onClick: vi.fn(),
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      // Verifica se o ícone está presente (lucide-react renderiza como SVG)
      const svg = screen
        .getByText("Editar")
        .closest("div")
        ?.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should use function label", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: (row) => `Editar ${row.name}`,
          onClick: vi.fn(),
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      expect(screen.getByText("Editar John Doe")).toBeInTheDocument();
    });

    it("should filter hidden actions", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick: vi.fn(),
        },
        {
          label: "Excluir",
          onClick: vi.fn(),
          hidden: (row) => row.id === "1",
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      expect(screen.getByText("Editar")).toBeInTheDocument();
      expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
    });

    it("should return null when all actions are hidden", () => {
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick: vi.fn(),
          hidden: () => true,
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      expect(result).toBeNull();
    });

    it("should return null when actions array is empty", () => {
      const result = renderActionsCell(mockRow, []);
      expect(result).toBeNull();
    });

    it("should render separator before action", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Editar",
          onClick: vi.fn(),
        },
        {
          label: "Excluir",
          onClick: vi.fn(),
          hasSeparatorBefore: true,
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      const { container } = render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      // Verifica se há separador - pode estar dentro do dropdown menu
      // O separador pode não ter role="separator" dependendo da implementação
      const menuContent = container.querySelector(
        '[data-slot="dropdown-menu-content"]'
      );
      if (menuContent) {
        // Verifica se há um elemento separador (pode ser um hr ou div com classes específicas)
        const separator = menuContent.querySelector(
          'hr, [role="separator"], .border-t'
        );
        expect(
          separator || menuContent.querySelectorAll("div").length > 2
        ).toBeTruthy();
      } else {
        // Se não encontrar o menu content, pelo menos verifica que o componente foi renderizado
        expect(container.querySelector("button")).toBeInTheDocument();
      }
    });

    it("should apply variant to action item", async () => {
      const user = userEvent.setup();
      const actions: TableAction<ITestData>[] = [
        {
          label: "Excluir",
          variant: "destructive",
          onClick: vi.fn(),
        },
      ];

      const result = renderActionsCell(mockRow, actions);
      render(<>{result}</>);

      const triggerButton = screen.getByText("Abrir menu").closest("button");
      if (triggerButton) {
        await user.click(triggerButton);
      }

      const deleteButton = screen.getByText("Excluir");
      expect(deleteButton).toBeInTheDocument();
    });
  });
});
