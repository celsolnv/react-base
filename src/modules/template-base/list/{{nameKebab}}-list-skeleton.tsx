import { Skeleton } from "@/components/ui/skeleton";

export function {{namePascal}}ListPageSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-6">
        {/* Header List Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="border-border bg-card shadow-card flex h-full flex-col overflow-hidden rounded-lg border">
          {/* Filtros e Busca Skeleton */}
          <div className="bg-secondary/30 border-border flex shrink-0 items-center gap-4 border-b p-4">
            <Skeleton className="h-10 w-[300px]" /> {/* InputSearch */}
            <Skeleton className="h-10 w-[180px]" /> {/* SelectStatus */}
          </div>

          {/* Tabela Skeleton */}
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="w-full caption-bottom text-sm">
              {/* Table Header */}
              <div className="flex h-10 items-center border-b px-4">
                <Skeleton className="mr-4 h-4 w-[40px]" /> {/* Checkbox */}
                <Skeleton className="mr-auto h-4 w-[150px]" /> {/* Nome */}
                <Skeleton className="mr-8 h-4 w-[100px]" /> {/* Status */}
                <Skeleton className="mr-8 h-4 w-[80px]" /> {/* Data */}
                <Skeleton className="h-4 w-[40px]" /> {/* Actions */}
              </div>

              {/* Table Body - 5 rows */}
              <div className="p-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex h-16 items-center border-b px-4">
                    <Skeleton className="mr-4 h-4 w-[40px]" />
                    <Skeleton className="mr-auto h-4 w-[200px]" />
                    <Skeleton className="mr-8 h-4 w-[100px]" />
                    <Skeleton className="mr-8 h-4 w-[80px]" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between px-2 py-4">
              <Skeleton className="h-4 w-[200px]" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
