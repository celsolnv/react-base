import { type ReactNode } from "react";

import { ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/shadcn";
import { cn } from "@/lib/utils";

interface IHistorySectionProps {
  icon: ReactNode;
  title: string;
  count: number;
  isExpanded: boolean;
  isAdding: boolean;
  onToggle: () => void;
  onAdd: () => void;
  children: ReactNode;
  formComponent?: ReactNode;
}

export function HistorySection({
  icon,
  title,
  count,
  isExpanded,
  isAdding,
  onToggle,
  onAdd,
  children,
  formComponent,
}: Readonly<IHistorySectionProps>) {
  return (
    <div className="border-border space-y-4 rounded-lg border">
      {/* Header - sempre visível */}
      <button
        type="button"
        onClick={onToggle}
        className="hover:bg-muted/50 flex w-full items-center justify-between p-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-foreground/80 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-foreground text-base font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">
              {count} {count === 1 ? "registro" : "registros"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "text-muted-foreground h-5 w-5 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="space-y-4 px-4 pb-4">
          {/* Lista de registros */}
          {children}

          {/* Formulário de adição/edição */}
          {isAdding && formComponent}

          {/* Botão adicionar */}
          {!isAdding && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onAdd}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar {title.replace("Histórico ", "").replace("de ", "")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
