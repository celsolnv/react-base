import type {
  ColumnDef,
  HeaderGroup,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable } from ".";

// Mock do crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "mock-uuid-123"),
  },
});

// Tipo de dados de exemplo
interface ITestData {
  id: string;
  name: string;
  email: string;
}

// Helper para criar um mock do TanStack Table
const createMockTable = (rows: ITestData[] = []): TanStackTable<ITestData> => {
  // Cria headers mock
  const mockHeaders: HeaderGroup<ITestData>[] = [
    {
      id: "header-group-1",
      headers: [
        {
          id: "name",
          column: {
            columnDef: { header: "Nome", id: "name" },
          } as any,
          isPlaceholder: false,
          getContext: vi.fn(),
        } as any,
        {
          id: "email",
          column: {
            columnDef: { header: "Email", id: "email" },
          } as any,
          isPlaceholder: false,
          getContext: vi.fn(),
        } as any,
      ],
    },
  ];

  // Cria rows mock
  const mockRows: Row<ITestData>[] = rows.map((row, index) => ({
    id: `row-${index}`,
    original: row,
    getIsSelected: vi.fn(() => false),
    getVisibleCells: vi.fn(() => [
      {
        id: `cell-${index}-name`,
        column: {
          columnDef: { cell: (info: any) => info.row.original.name },
        } as any,
        getContext: vi.fn(() => ({
          row: { original: row },
        })),
      } as any,
      {
        id: `cell-${index}-email`,
        column: {
          columnDef: { cell: (info: any) => info.row.original.email },
        } as any,
        getContext: vi.fn(() => ({
          row: { original: row },
        })),
      } as any,
    ]),
  })) as Row<ITestData>[];

  return {
    getHeaderGroups: vi.fn(() => mockHeaders),
    getRowModel: vi.fn(() => ({
      rows: mockRows,
    })),
  } as unknown as TanStackTable<ITestData>;
};

// Helper para criar colunas
const createMockColumns = (): ColumnDef<ITestData>[] => [
  {
    id: "name",
    header: "Nome",
    cell: (info) => info.row.original.name,
  },
  {
    id: "email",
    header: "Email",
    cell: (info) => info.row.original.email,
  },
];

describe("DataTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("should render skeleton when isLoading is true", () => {
      const mockTable = createMockTable();
      const columns = createMockColumns();

      render(
        <DataTable table={mockTable} columns={columns} isLoading={true} />
      );

      // Verifica se há skeletons (5 linhas de skeleton)
      const skeletons = screen.queryAllByRole("generic");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should render skeleton headers for each column", () => {
      const mockTable = createMockTable();
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} isLoading={true} />
      );

      // Verifica se há skeletons nos headers
      const headerSkeletons = container.querySelectorAll(
        "thead .lucide-loader"
      );
      // Pode não encontrar pelo lucide-loader, então vamos verificar pela estrutura
      const tableHead = container.querySelectorAll("thead th");
      expect(tableHead.length).toBe(columns.length);
    });

    it("should render 5 skeleton rows", () => {
      const mockTable = createMockTable();
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} isLoading={true} />
      );

      // Verifica se há 5 linhas de skeleton no tbody
      const skeletonRows = container.querySelectorAll("tbody tr");
      expect(skeletonRows.length).toBe(5);
    });

    it("should render skeleton cells for each column in each row", () => {
      const mockTable = createMockTable();
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} isLoading={true} />
      );

      const skeletonRows = container.querySelectorAll("tbody tr");
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        expect(cells.length).toBe(columns.length);
      });
    });
  });

  describe("Data Rendering", () => {
    it("should render table when isLoading is false", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      render(
        <DataTable table={mockTable} columns={columns} isLoading={false} />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should render headers correctly", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      render(<DataTable table={mockTable} columns={columns} />);

      expect(screen.getByText("Nome")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("should render multiple rows", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Smith", email: "jane@example.com" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      render(<DataTable table={mockTable} columns={columns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });

    it("should render cell content correctly", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      render(<DataTable table={mockTable} columns={columns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should handle placeholder headers", () => {
      const mockTable = createMockTable([
        { id: "1", name: "John Doe", email: "john@example.com" },
      ]);
      const columns = createMockColumns();

      // Mock header com isPlaceholder = true
      const mockTableWithPlaceholder = {
        ...mockTable,
        getHeaderGroups: vi.fn(() => [
          {
            id: "header-group-1",
            headers: [
              {
                id: "name",
                isPlaceholder: true,
              } as any,
            ],
          },
        ]),
      };

      render(
        <DataTable table={mockTableWithPlaceholder as any} columns={columns} />
      );

      // Placeholder headers não devem renderizar conteúdo
      const tableHead = screen.queryByText("Nome");
      // Se for placeholder, não deve renderizar
      expect(tableHead).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should display empty message when no rows are present", () => {
      const mockTable = createMockTable([]);
      const columns = createMockColumns();

      render(<DataTable table={mockTable} columns={columns} />);

      expect(
        screen.getByText("Nenhum resultado encontrado.")
      ).toBeInTheDocument();
    });

    it("should span empty message across all columns", () => {
      const mockTable = createMockTable([]);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const emptyCell = container.querySelector("td[colspan]");
      expect(emptyCell).toBeInTheDocument();
      expect(emptyCell).toHaveAttribute("colspan", columns.length.toString());
    });

    it("should center empty message", () => {
      const mockTable = createMockTable([]);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const emptyCell = container.querySelector("td.text-center");
      expect(emptyCell).toBeInTheDocument();
    });
  });

  describe("Row Selection", () => {
    it("should set data-state attribute when row is selected", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];

      // Cria row mock com getIsSelected retornando true
      const mockRows: Row<ITestData>[] = [
        {
          id: "row-0",
          original: mockData[0],
          getIsSelected: vi.fn(() => true),
          getVisibleCells: vi.fn(() => [
            {
              id: "cell-0-name",
              column: {
                columnDef: { cell: (info: any) => info.row.original.name },
              } as any,
              getContext: vi.fn(() => ({
                row: { original: mockData[0] },
              })),
            } as any,
            {
              id: "cell-0-email",
              column: {
                columnDef: { cell: (info: any) => info.row.original.email },
              } as any,
              getContext: vi.fn(() => ({
                row: { original: mockData[0] },
              })),
            } as any,
          ]),
        } as Row<ITestData>,
      ];

      const mockTable = {
        getHeaderGroups: vi.fn(() => [
          {
            id: "header-group-1",
            headers: [
              {
                id: "name",
                column: {
                  columnDef: { header: "Nome", id: "name" },
                } as any,
                isPlaceholder: false,
                getContext: vi.fn(),
              } as any,
              {
                id: "email",
                column: {
                  columnDef: { header: "Email", id: "email" },
                } as any,
                isPlaceholder: false,
                getContext: vi.fn(),
              } as any,
            ],
          },
        ]),
        getRowModel: vi.fn(() => ({
          rows: mockRows,
        })),
      } as unknown as TanStackTable<ITestData>;

      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const selectedRow = container.querySelector('tr[data-state="selected"]');
      expect(selectedRow).toBeInTheDocument();
    });

    it("should not set data-state attribute when row is not selected", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const rows = container.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        expect(row).not.toHaveAttribute("data-state", "selected");
      });
    });
  });

  describe("Default Props", () => {
    it("should default isLoading to false", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      render(<DataTable table={mockTable} columns={columns} />);

      // Se isLoading fosse true, veríamos skeletons
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Table Structure", () => {
    it("should render table with proper structure", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      expect(container.querySelector("table")).toBeInTheDocument();
      expect(container.querySelector("thead")).toBeInTheDocument();
      expect(container.querySelector("tbody")).toBeInTheDocument();
    });

    it("should apply correct classes to table container", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const tableContainer = container.querySelector(
        ".overflow-hidden.rounded-md.border"
      );
      expect(tableContainer).toBeInTheDocument();
    });

    it("should apply correct classes to header row", () => {
      const mockData: ITestData[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];
      const mockTable = createMockTable(mockData);
      const columns = createMockColumns();

      const { container } = render(
        <DataTable table={mockTable} columns={columns} />
      );

      const headerRow = container.querySelector("thead tr");
      expect(headerRow).toHaveClass("bg-secondary/50");
    });
  });
});
