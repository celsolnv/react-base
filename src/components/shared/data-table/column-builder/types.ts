import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import type { badgeVariants } from "@/components/ui/badge/variants";

/**
 * Tipo base para todas as configurações de coluna
 */
interface BaseColumnConfig<TData> {
  accessorKey: keyof TData;
  header: string;
  className?: string;
  width?: string;
}

/**
 * Configuração para coluna de texto simples
 */
export interface TextColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "text";
  format?: (value: string) => string;
}

/**
 * Configuração para coluna de data
 */
export interface DateColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "date";
  dateFormat?: Intl.DateTimeFormatOptions;
}

/**
 * Configuração para coluna de moeda
 */
export interface CurrencyColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "currency";
  currency?: string;
  locale?: string;
}

/**
 * Tipo de variante do Badge extraído do componente
 */
export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>;

export interface BadgeMapping {
  [value: string]: BadgeVariant;
}

/**
 * Configuração para coluna de badge
 */
export interface BadgeColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "badge";
  badgeMap?: BadgeMapping;
  labelMap?: Record<string, string>;
  defaultVariant?: BadgeVariant;
}

/**
 * Configuração para coluna booleana
 */
export interface BooleanColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "boolean";
  trueLabel?: string;
  falseLabel?: string;
  trueBadgeVariant?: BadgeVariant;
  falseBadgeVariant?: BadgeVariant;
}

/**
 * Configuração para coluna customizada
 */
export interface CustomColumnConfig<TData> extends BaseColumnConfig<TData> {
  type: "custom";
  cell: (value: unknown, row: TData) => React.ReactNode;
}

/**
 * Union type discriminado para todas as configurações de coluna
 */
export type ColumnConfig<TData> =
  | TextColumnConfig<TData>
  | DateColumnConfig<TData>
  | CurrencyColumnConfig<TData>
  | BadgeColumnConfig<TData>
  | BooleanColumnConfig<TData>
  | CustomColumnConfig<TData>;

/**
 * Interface para ações da tabela
 */
export interface TableAction<TData> {
  label: string | ((row: TData) => string);
  icon?: LucideIcon;
  onClick: (row: TData) => void;
  variant?: "default" | "destructive";
  hasSeparatorBefore?: boolean;
  hidden?: (row: TData) => boolean;
}
