import { useFormContext } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";

import { CardFormSkeleton } from "./card-form-skeleton";

interface ICardFormProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly children: React.ReactNode;
}
export function CardForm({
  icon,
  title,
  description,
  children,
}: ICardFormProps) {
  const {
    formState: { isSubmitting, isLoading },
  } = useFormContext();
  const loading = isSubmitting || isLoading;

  if (loading) {
    return <CardFormSkeleton />;
  }

  return (
    <Card className="bg-card border-border shadow-card gap-0 pt-0">
      <CardHeader className="bg-secondary/30 border-border gap-1 border-b pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/50 border-border/50 shadow-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-card-foreground mb-1 text-lg font-semibold">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-12">
        {children}
      </CardContent>
    </Card>
  );
}
