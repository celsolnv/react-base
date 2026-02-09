import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDataTable } from ".";

// Tipos de teste
interface TTestData {
  id: number;
  name: string;
  email: string;
}

type TTestValue = string;

describe("useDataTable", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Dados e colunas de teste
  const mockData: TTestData[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const mockColumns: ColumnDef<TTestData, TTestValue>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ];

  describe("Basic Usage", () => {
    it("should return a table instance with required props", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(result.current).toBeDefined();
      expect(result.current.getRowModel).toBeDefined();
      expect(result.current.getCoreRowModel).toBeDefined();
    });

    it("should handle empty data array", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: [],
          columns: mockColumns,
        })
      );

      expect(result.current).toBeDefined();
      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(0);
    });

    it("should handle empty columns array", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: [],
        })
      );

      expect(result.current).toBeDefined();
    });

    it("should process data correctly", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(3);
      expect(rows[0]?.original.name).toBe("John Doe");
      expect(rows[1]?.original.name).toBe("Jane Smith");
      expect(rows[2]?.original.name).toBe("Bob Johnson");
    });
  });

  describe("Pagination Configuration", () => {
    it("should enable manual pagination when pageCount is provided", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount: 10,
        })
      );

      expect(result.current.options.manualPagination).toBe(true);
    });

    it("should disable manual pagination when pageCount is undefined", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(result.current.options.manualPagination).toBe(false);
    });

    it("should set pageCount correctly when provided", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount: 5,
        })
      );

      expect(result.current.options.pageCount).toBe(5);
    });

    it("should set pageCount to -1 when not provided", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(result.current.options.pageCount).toBe(-1);
    });

    it("should handle pageCount of 0", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount: 0,
        })
      );

      expect(result.current.options.manualPagination).toBe(true);
      expect(result.current.options.pageCount).toBe(0);
    });
  });

  describe("Pagination State", () => {
    it("should use provided pagination state", () => {
      const pagination: PaginationState = {
        pageIndex: 2,
        pageSize: 5,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination,
        })
      );

      expect(result.current.getState().pagination.pageIndex).toBe(2);
      expect(result.current.getState().pagination.pageSize).toBe(5);
    });

    it("should use default pagination when not provided", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      const pagination = result.current.getState().pagination;
      expect(pagination.pageIndex).toBeDefined();
      expect(pagination.pageSize).toBeDefined();
    });

    it("should handle pagination with pageIndex 0", () => {
      const pagination: PaginationState = {
        pageIndex: 0,
        pageSize: 10,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination,
        })
      );

      expect(result.current.getState().pagination.pageIndex).toBe(0);
    });

    it("should handle pagination with different page sizes", () => {
      const pagination: PaginationState = {
        pageIndex: 0,
        pageSize: 25,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination,
        })
      );

      expect(result.current.getState().pagination.pageSize).toBe(25);
    });
  });

  describe("Pagination Change Callback", () => {
    it("should call onPaginationChange when pagination changes", () => {
      const onPaginationChange = vi.fn();
      const initialPagination: PaginationState = {
        pageIndex: 0,
        pageSize: 10,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination: initialPagination,
          onPaginationChange,
        })
      );

      const newPagination: PaginationState = {
        pageIndex: 1,
        pageSize: 10,
      };

      result.current.setPagination(newPagination);

      expect(onPaginationChange).toHaveBeenCalledWith(newPagination);
    });

    it("should call onPaginationChange with function updater", () => {
      const onPaginationChange = vi.fn();
      const initialPagination: PaginationState = {
        pageIndex: 0,
        pageSize: 10,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination: initialPagination,
          onPaginationChange,
        })
      );

      result.current.setPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));

      expect(onPaginationChange).toHaveBeenCalled();
      const callArgs = onPaginationChange.mock.calls[0]?.[0];
      expect(callArgs).toEqual({
        pageIndex: 1,
        pageSize: 10,
      });
    });

    it("should use default pagination when calling updater without initial pagination", () => {
      const onPaginationChange = vi.fn();

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          onPaginationChange,
        })
      );

      result.current.setPagination((prev) => ({
        ...prev,
        pageIndex: 2,
      }));

      expect(onPaginationChange).toHaveBeenCalled();
      const callArgs = onPaginationChange.mock.calls[0]?.[0];
      expect(callArgs.pageIndex).toBe(2);
      expect(callArgs.pageSize).toBe(10);
    });

    it("should not call onPaginationChange when not provided", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      const newPagination: PaginationState = {
        pageIndex: 1,
        pageSize: 10,
      };

      // Não deve lançar erro mesmo sem callback
      expect(() => {
        result.current.setPagination(newPagination);
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle large datasets", () => {
      const largeData: TTestData[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));

      const { result } = renderHook(() =>
        useDataTable({
          data: largeData,
          columns: mockColumns,
        })
      );

      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(1000);
    });

    it("should handle single item dataset", () => {
      const singleData: TTestData[] = [
        { id: 1, name: "Single User", email: "single@example.com" },
      ];

      const { result } = renderHook(() =>
        useDataTable({
          data: singleData,
          columns: mockColumns,
        })
      );

      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(1);
      expect(rows[0]?.original.name).toBe("Single User");
    });

    it("should handle undefined pageCount", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount: undefined,
        })
      );

      expect(result.current.options.manualPagination).toBe(false);
      expect(result.current.options.pageCount).toBe(-1);
    });

    it("should handle null-like pagination state", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination: undefined,
        })
      );

      expect(result.current).toBeDefined();
      // Deve ter um estado de paginação padrão
      const pagination = result.current.getState().pagination;
      expect(pagination).toBeDefined();
    });

    it("should handle multiple column definitions", () => {
      const multipleColumns: ColumnDef<TTestData, TTestValue>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
      ];

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: multipleColumns,
        })
      );

      expect(result.current).toBeDefined();
      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(3);
    });
  });

  describe("Table Instance Properties", () => {
    it("should provide getRowModel method", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(typeof result.current.getRowModel).toBe("function");
      const rowModel = result.current.getRowModel();
      expect(rowModel.rows).toBeDefined();
    });

    it("should provide getState method", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(typeof result.current.getState).toBe("function");
      const state = result.current.getState();
      expect(state.pagination).toBeDefined();
    });

    it("should provide setPagination method", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(typeof result.current.setPagination).toBe("function");
    });

    it("should provide options property", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(result.current.options).toBeDefined();
      expect(result.current.options.data).toEqual(mockData);
      expect(result.current.options.columns).toEqual(mockColumns);
    });
  });

  describe("Integration Scenarios", () => {
    it("should work with manual pagination and callback", () => {
      const onPaginationChange = vi.fn();
      const pagination: PaginationState = {
        pageIndex: 0,
        pageSize: 2,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pageCount: 2,
          pagination,
          onPaginationChange,
        })
      );

      expect(result.current.options.manualPagination).toBe(true);
      expect(result.current.options.pageCount).toBe(2);
      expect(result.current.getState().pagination.pageIndex).toBe(0);

      const newPagination: PaginationState = {
        pageIndex: 1,
        pageSize: 2,
      };

      result.current.setPagination(newPagination);
      expect(onPaginationChange).toHaveBeenCalledWith(newPagination);
    });

    it("should work without pagination configuration", () => {
      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
        })
      );

      expect(result.current.options.manualPagination).toBe(false);
      expect(result.current.options.pageCount).toBe(-1);
      const rows = result.current.getRowModel().rows;
      expect(rows).toHaveLength(3);
    });

    it("should handle pagination change with function updater and initial state", () => {
      const onPaginationChange = vi.fn();
      const initialPagination: PaginationState = {
        pageIndex: 1,
        pageSize: 5,
      };

      const { result } = renderHook(() =>
        useDataTable({
          data: mockData,
          columns: mockColumns,
          pagination: initialPagination,
          onPaginationChange,
        })
      );

      result.current.setPagination((prev) => ({
        pageIndex: prev.pageIndex + 1,
        pageSize: prev.pageSize,
      }));

      expect(onPaginationChange).toHaveBeenCalled();
      const callArgs = onPaginationChange.mock.calls[0]?.[0];
      expect(callArgs.pageIndex).toBe(2);
      expect(callArgs.pageSize).toBe(5);
    });
  });
});
