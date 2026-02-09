import {
  type ColumnDef,
  getCoreRowModel,
  type PaginationState,
  type Table as TanStackTable,
  useReactTable,
} from "@tanstack/react-table";

export interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  pagination,
  onPaginationChange,
}: Readonly<UseDataTableProps<TData, TValue>>): TanStackTable<TData> {
  // React Compiler warning: useReactTable returns functions that cannot be memoized safely.
  // This is expected behavior from TanStack Table and is safe to use.
  // The warning can be safely ignored as the table instance is used directly and not passed to memoized components.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: pageCount !== undefined,
    pageCount: pageCount ?? -1,
    state: pagination ? { pagination } : undefined,
    onPaginationChange: onPaginationChange
      ? (updater) => {
          const currentPagination = pagination ?? {
            pageIndex: 0,
            pageSize: 10,
          };
          const newPagination =
            typeof updater === "function"
              ? updater(currentPagination)
              : updater;
          onPaginationChange(newPagination);
        }
      : undefined,
  });

  return table;
}
