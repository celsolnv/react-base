import type { Table as TanStackTable } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataTablePagination } from ".";

// Helper para criar um mock do TanStack Table
const createMockTable = (
  pageIndex: number = 0,
  pageSize: number = 10,
  pageCount: number = 5,
  totalCount?: number
): TanStackTable<unknown> => {
  const mockPreviousPage = vi.fn();
  const mockNextPage = vi.fn();
  const mockSetPageIndex = vi.fn();
  const mockGetCanPreviousPage = vi.fn(() => pageIndex > 0);
  const mockGetCanNextPage = vi.fn(() => pageIndex < pageCount - 1);

  return {
    getState: vi.fn(() => ({
      pagination: {
        pageIndex,
        pageSize,
      },
    })),
    getPageCount: vi.fn(() => pageCount),
    previousPage: mockPreviousPage,
    nextPage: mockNextPage,
    setPageIndex: mockSetPageIndex,
    getCanPreviousPage: mockGetCanPreviousPage,
    getCanNextPage: mockGetCanNextPage,
  } as unknown as TanStackTable<unknown>;
};

describe("DataTablePagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render pagination component", () => {
      const mockTable = createMockTable(0, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
    });

    it("should display correct range when totalCount is provided", () => {
      const mockTable = createMockTable(0, 10, 5, 50);
      render(<DataTablePagination table={mockTable} totalCount={50} />);

      expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
      // Verifica se os números estão presentes no texto
      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("1");
      expect(text).toContain("10");
      expect(text).toContain("50");
    });

    it("should display correct range when totalCount is not provided", () => {
      const mockTable = createMockTable(0, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toMatch(/1/);
      // Quando totalCount não é fornecido, end é calculado como Math.min((pageIndex + 1) * pageSize, 0) = 0
      expect(text).toMatch(/0/);
      expect(text).not.toContain("de");
    });

    it("should display correct range for second page", () => {
      const mockTable = createMockTable(1, 10, 5, 50);
      render(<DataTablePagination table={mockTable} totalCount={50} />);

      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("11");
      expect(text).toContain("20");
    });

    it("should display correct range for last page", () => {
      const mockTable = createMockTable(4, 10, 5, 50);
      render(<DataTablePagination table={mockTable} totalCount={50} />);

      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("41");
      expect(text).toContain("50");
    });

    it("should display correct range when end exceeds totalCount", () => {
      const mockTable = createMockTable(0, 10, 1, 5);
      render(<DataTablePagination table={mockTable} totalCount={5} />);

      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("1");
      expect(text).toContain("5");
    });
  });

  describe("Pagination Range", () => {
    it("should show all pages when pageCount is 5 or less", () => {
      const mockTable = createMockTable(0, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      // Deve mostrar todas as 5 páginas (como botões)
      const page1Button = screen.getByText("1", { selector: "button" });
      const page2Button = screen.getByText("2", { selector: "button" });
      const page3Button = screen.getByText("3", { selector: "button" });
      const page4Button = screen.getByText("4", { selector: "button" });
      const page5Button = screen.getByText("5", { selector: "button" });

      expect(page1Button).toBeInTheDocument();
      expect(page2Button).toBeInTheDocument();
      expect(page3Button).toBeInTheDocument();
      expect(page4Button).toBeInTheDocument();
      expect(page5Button).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("should show ellipsis at end when on first pages", () => {
      const mockTable = createMockTable(0, 10, 10);
      render(<DataTablePagination table={mockTable} />);

      // Deve mostrar: 1, 2, 3, 4, 5, ..., 10
      const page1Button = screen.getByText("1", { selector: "button" });
      const page2Button = screen.getByText("2", { selector: "button" });
      const page3Button = screen.getByText("3", { selector: "button" });
      const page4Button = screen.getByText("4", { selector: "button" });
      const page5Button = screen.getByText("5", { selector: "button" });
      const page10Button = screen.getByText("10", { selector: "button" });

      expect(page1Button).toBeInTheDocument();
      expect(page2Button).toBeInTheDocument();
      expect(page3Button).toBeInTheDocument();
      expect(page4Button).toBeInTheDocument();
      expect(page5Button).toBeInTheDocument();
      expect(page10Button).toBeInTheDocument();
      // Verifica se há ellipsis
      const ellipsis = screen.queryAllByText("...");
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("should show ellipsis at start when on last pages", () => {
      const mockTable = createMockTable(9, 10, 10);
      render(<DataTablePagination table={mockTable} />);

      // Deve mostrar: 1, ..., 6, 7, 8, 9, 10
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      const ellipsis = screen.queryAllByText("...");
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("should show ellipsis on both sides when in middle pages", () => {
      const mockTable = createMockTable(4, 10, 10);
      render(<DataTablePagination table={mockTable} />);

      // Deve mostrar: 1, ..., 3, 4, 5, 6, 7, ..., 10
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      const ellipsis = screen.queryAllByText("...");
      expect(ellipsis.length).toBeGreaterThanOrEqual(1);
    });

    it("should highlight current page", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      // Página 3 (pageIndex 2 + 1) deve estar ativa
      const page3Button = screen.getByText("3").closest("button");
      expect(page3Button).toBeDisabled(); // Página ativa está desabilitada
    });
  });

  describe("Navigation Buttons", () => {
    it("should render previous and next buttons", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");

      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it("should call previousPage when previous button is clicked", async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      if (previousButton) {
        await user.click(previousButton);
      }

      expect(mockTable.previousPage).toHaveBeenCalledTimes(1);
    });

    it("should call nextPage when next button is clicked", async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");
      if (nextButton) {
        await user.click(nextButton);
      }

      expect(mockTable.nextPage).toHaveBeenCalledTimes(1);
    });

    it("should disable previous button on first page", () => {
      const mockTable = createMockTable(0, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      expect(previousButton).toBeDisabled();
    });

    it("should enable previous button when not on first page", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      expect(previousButton).not.toBeDisabled();
    });

    it("should disable next button on last page", () => {
      const mockTable = createMockTable(4, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");
      expect(nextButton).toBeDisabled();
    });

    it("should enable next button when not on last page", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("Page Number Buttons", () => {
    it("should call setPageIndex when page number is clicked", async () => {
      const user = userEvent.setup();
      const mockTable = createMockTable(0, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const page2Button = screen.getByText("2");
      await user.click(page2Button);

      expect(mockTable.setPageIndex).toHaveBeenCalledWith(1); // pageIndex é 0-based
    });

    it("should disable current page button", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const page3Button = screen.getByText("3").closest("button");
      expect(page3Button).toBeDisabled();
    });

    it("should enable non-current page buttons", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const page1Button = screen.getByText("1").closest("button");
      const page2Button = screen.getByText("2").closest("button");
      const page4Button = screen.getByText("4").closest("button");
      const page5Button = screen.getByText("5").closest("button");

      expect(page1Button).not.toBeDisabled();
      expect(page2Button).not.toBeDisabled();
      expect(page4Button).not.toBeDisabled();
      expect(page5Button).not.toBeDisabled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle single page", () => {
      const mockTable = createMockTable(0, 10, 1);
      render(<DataTablePagination table={mockTable} />);

      expect(screen.getByText("1", { selector: "button" })).toBeInTheDocument();
      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");
      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should handle very large page count", () => {
      const mockTable = createMockTable(50, 10, 100);
      render(<DataTablePagination table={mockTable} />);

      // Deve mostrar ellipsis e números de página
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should handle pageSize larger than totalCount", () => {
      const mockTable = createMockTable(0, 100, 1, 50);
      render(<DataTablePagination table={mockTable} totalCount={50} />);

      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("1");
      expect(text).toContain("50");
    });

    it("should handle zero totalCount", () => {
      const mockTable = createMockTable(0, 10, 1, 0);
      render(<DataTablePagination table={mockTable} totalCount={0} />);

      const text = screen.getByText(/Mostrando/).textContent;
      expect(text).toContain("0");
    });

    it("should handle pageIndex at boundary (first page)", () => {
      const mockTable = createMockTable(0, 10, 10);
      render(<DataTablePagination table={mockTable} />);

      const previousButton = screen
        .getByText("Ir para página anterior")
        .closest("button");
      expect(previousButton).toBeDisabled();
    });

    it("should handle pageIndex at boundary (last page)", () => {
      const mockTable = createMockTable(9, 10, 10);
      render(<DataTablePagination table={mockTable} />);

      const nextButton = screen
        .getByText("Ir para próxima página")
        .closest("button");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have screen reader text for navigation buttons", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      expect(screen.getByText("Ir para página anterior")).toBeInTheDocument();
      expect(screen.getByText("Ir para próxima página")).toBeInTheDocument();
    });

    it("should have proper button roles", () => {
      const mockTable = createMockTable(2, 10, 5);
      render(<DataTablePagination table={mockTable} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
