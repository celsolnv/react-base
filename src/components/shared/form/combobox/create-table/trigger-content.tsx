import { X } from "lucide-react";

import { Badge } from "@/components/ui";

import { type IOption } from "./use-creatable-select";

interface ITriggerContentProps {
  value: IOption | IOption[] | null;
  multiple?: boolean;
  placeholder: string;
  handleRemove: (value: string) => void;
}

export function TriggerContent({
  value,
  multiple,
  placeholder,
  handleRemove,
}: Readonly<ITriggerContentProps>) {
  if (multiple) {
    const vals = value as IOption[];
    if (vals.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {vals.map((opt) => (
          <Badge key={opt.value} variant="secondary" className="gap-1 pr-1">
            {opt.label}
            <button
              type="button"
              aria-label={`Remover ${opt.label}`}
              className="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0.5"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(opt.value);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  }

  const single = value as IOption | null;
  if (!single) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <span className="truncate">{single.label}</span>
      <button
        type="button"
        aria-label="Limpar seleção"
        className="hover:bg-muted-foreground/20 ml-auto inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0.5"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRemove(single.value);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
