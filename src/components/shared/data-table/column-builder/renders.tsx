import { MoreHorizontal } from "lucide-react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters/currency";
import { formatDate } from "@/utils/formatters/date";

import type {
  BadgeColumnConfig,
  BadgeMapping,
  BadgeVariant,
  BooleanColumnConfig,
  CurrencyColumnConfig,
  DateColumnConfig,
  TableAction,
  TextColumnConfig,
} from "./types";

type TPrimitiveValue = string | number | boolean | bigint;

function getBadgeVariant(
  value: unknown,
  badgeMap?: BadgeMapping,
  defaultVariant: BadgeVariant = "default"
): BadgeVariant {
  if (!badgeMap || typeof value !== "string") return defaultVariant;

  return badgeMap[value] ?? defaultVariant;
}

function getLabel(value: unknown, labelMap?: Record<string, string>): string {
  if (!value) return "-";

  // Evita conversão de objetos para '[object Object]'
  if (typeof value === "object") return "-";

  // Neste ponto, value é primitivo (string, number, boolean, bigint)
  const stringValue = String(value as TPrimitiveValue);

  if (!labelMap) return stringValue;

  return labelMap[stringValue] ?? stringValue;
}

// ============================================================================
// COLUMN RENDERERS
// ============================================================================

/**
 * Renderiza uma célula de texto
 */
export function renderTextCell<TData>(
  config: TextColumnConfig<TData>,
  value: unknown
): React.ReactNode {
  // Evita conversão de objetos para '[object Object]'
  let stringValue = "-";
  if (value && typeof value !== "object") {
    stringValue = String(value as TPrimitiveValue);
  }

  const formattedValue = config.format
    ? config.format(stringValue)
    : stringValue;

  return <div className={cn(config.className)}>{formattedValue}</div>;
}

/**
 * Renderiza uma célula de data
 */
export function renderDateCell<TData>(
  config: DateColumnConfig<TData>,
  value: unknown
): React.ReactNode {
  const formattedDate = formatDate(value, config.dateFormat);

  return <div className={cn(config.className)}>{formattedDate}</div>;
}

/**
 * Renderiza uma célula de moeda
 */
export function renderCurrencyCell<TData>(
  config: CurrencyColumnConfig<TData>,
  value: unknown
): React.ReactNode {
  const formattedValue = formatCurrency(value, config.currency, config.locale);

  return (
    <div className={cn("font-mono", config.className)}>{formattedValue}</div>
  );
}

/**
 * Renderiza uma célula de badge
 */
export function renderBadgeCell<TData>(
  config: BadgeColumnConfig<TData>,
  value: unknown
): React.ReactNode {
  const variant = getBadgeVariant(
    value,
    config.badgeMap,
    config.defaultVariant
  );
  const label = getLabel(value, config.labelMap);

  return (
    <Badge variant={variant} className={cn(config.className)}>
      {label}
    </Badge>
  );
}

/**
 * Renderiza uma célula booleana
 */
export function renderBooleanCell<TData>(
  config: BooleanColumnConfig<TData>,
  value: unknown
): React.ReactNode {
  const boolValue = Boolean(value);
  const label = boolValue
    ? (config.trueLabel ?? "Sim")
    : (config.falseLabel ?? "Não");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase",
        boolValue
          ? "bg-success border-success/50 text-white"
          : "bg-muted text-muted-foreground border-border",
        config.className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          boolValue ? "bg-white/80" : "bg-muted-foreground"
        )}
      />
      {label}
    </span>
  );
}

export function renderActionsCell<TData>(
  row: TData,
  actions: TableAction<TData>[]
): React.ReactNode {
  // Filtra ações visíveis
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          const label =
            typeof action.label === "function"
              ? action.label(row)
              : action.label;
          const key = `${label}-${index}`;

          return (
            <div key={key}>
              {action.hasSeparatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={action.variant}
                onClick={() => action.onClick(row)}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {label}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
