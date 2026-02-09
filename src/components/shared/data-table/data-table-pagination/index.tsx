import type { Table as TanStackTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface IDataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  totalCount?: number;
}

function getPaginationRange(
  currentPage: number,
  pageCount: number
): (number | string)[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis-end", pageCount];
  }

  if (currentPage >= pageCount - 2) {
    return [
      1,
      "ellipsis-start",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "ellipsis-end",
    pageCount,
  ];
}

export function DataTablePagination<TData>({
  table,
  totalCount,
}: Readonly<IDataTablePaginationProps<TData>>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalCount ?? 0);

  const pageNumbers = getPaginationRange(currentPage, pageCount);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {totalCount !== undefined ? (
          <>
            Mostrando{" "}
            <span className="text-foreground font-medium">{start}</span>
            {"-"}
            <span className="text-foreground font-medium">{end}</span> de{" "}
            <span className="text-foreground font-medium">{totalCount}</span>
          </>
        ) : (
          <>
            Mostrando{" "}
            <span className="text-foreground font-medium">{start}</span>
            {"-"}
            <span className="text-foreground font-medium">{end}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para página anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span key={page} className="text-muted-foreground px-2 text-sm">
                  ...
                </span>
              );
            }
            const pageNum = page as number;
            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(pageNum - 1)}
                disabled={isActive}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para próxima página</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
