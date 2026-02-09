import { Card, CardContent, CardHeader, Skeleton } from "@/components/shadcn";

export function CardFormSkeleton() {
  return (
    <Card className="bg-card border-border shadow-card gap-0 pt-0">
      <CardHeader className="bg-secondary/30 border-border gap-1 border-b pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/50 border-border/50 shadow-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div>
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-12">
        <Skeleton className="h-10 sm:col-span-6" />
        <Skeleton className="h-10 sm:col-span-6" />
        <Skeleton className="h-10 sm:col-span-12" />
        <Skeleton className="h-10 sm:col-span-6" />
        <Skeleton className="h-10 sm:col-span-6" />
      </CardContent>
    </Card>
  );
}
