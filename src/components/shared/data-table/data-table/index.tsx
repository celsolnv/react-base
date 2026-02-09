import {
  type ColumnDef,
  flexRender,
  type Table as TanStackTable,
} from "@tanstack/react-table";

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn";

interface IDataTableProps<TData, TValue> {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  table,
  columns,
  isLoading = false,
}: Readonly<IDataTableProps<TData, TValue>>) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 border-border border-b hover:bg-transparent">
                {columns.map((column) => {
                  const columnId = column.id ?? crypto.randomUUID();
                  return (
                    <TableHead
                      key={`skeleton-header-${columnId}`}
                      className="text-foreground/70 h-12 px-4 text-xs font-semibold tracking-wider uppercase"
                    >
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map(() => {
                const rowId = crypto.randomUUID();
                return (
                  <TableRow key={`skeleton-row-${rowId}`}>
                    {columns.map((column) => {
                      const columnId = column.id ?? crypto.randomUUID();
                      return (
                        <TableCell key={`skeleton-cell-${rowId}-${columnId}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-secondary/50 border-border border-b hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground/70 h-12 px-4 text-xs font-semibold tracking-wider uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
