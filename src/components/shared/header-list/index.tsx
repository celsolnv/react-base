import { Link } from "@tanstack/react-router";
import { ShieldPlus } from "lucide-react";

import { Button } from "@/components/shadcn";

interface IHeaderListProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonLink?: string;
}

export function HeaderList({
  title,
  description,
  buttonText = "Novo",
  buttonIcon = <ShieldPlus className="mr-2 h-4 w-4" />,
  buttonLink,
}: Readonly<IHeaderListProps>) {
  return (
    <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {buttonLink && (
        <Button asChild>
          <Link to={buttonLink}>
            {buttonIcon}
            {buttonText}
          </Link>
        </Button>
      )}
    </div>
  );
}
