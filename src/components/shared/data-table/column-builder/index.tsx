import type { ColumnDef } from "@tanstack/react-table";

import { ActionsColumnCell } from "./actions-column-cell";
import {
  renderBadgeCell,
  renderBooleanCell,
  renderCurrencyCell,
  renderDateCell,
  renderTextCell,
} from "./renders";
import type { ColumnConfig, TableAction } from "./types";

// Re-exporta tipos para facilitar imports
export type { ColumnConfig, TableAction } from "./types";

type TPrimitiveValue = string | number | boolean | bigint;

/**
 * Função utilitária para obter valor de um objeto usando path aninhado
 * Exemplo: getNestedValue(obj, "user.name") => obj.user.name
 */
function getNestedValue<T>(obj: T, path: string): unknown {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[key];
  }

  return value;
}

export function buildColumns<TData>(
  config: ColumnConfig<TData>[],
  actions?: TableAction<TData>[]
): ColumnDef<TData>[] {
  const columns: ColumnDef<TData>[] = config.map((col) => {
    const accessorKey = col.accessorKey as string;
    const isNestedPath = accessorKey.includes(".");

    const baseColumn: ColumnDef<TData> = {
      accessorKey: isNestedPath ? accessorKey.replace(/\./g, "_") : accessorKey,
      header: col.header,
    };

    baseColumn.cell = ({ row }) => {
      const value = isNestedPath
        ? getNestedValue(row.original, accessorKey)
        : row.getValue(accessorKey);

      switch (col.type) {
        case "text":
          return renderTextCell(col, value);

        case "date":
          return renderDateCell(col, value);

        case "currency":
          return renderCurrencyCell(col, value);

        case "badge":
          return renderBadgeCell(col, value);

        case "boolean":
          return renderBooleanCell(col, value);

        case "custom":
          return col.cell(value, row.original);

        default: {
          // Evita conversão de objetos para '[object Object]'
          const displayValue =
            value && typeof value !== "object"
              ? String(value as TPrimitiveValue)
              : "-";
          return <div>{displayValue}</div>;
        }
      }
    };

    return baseColumn;
  });

  // Adiciona coluna de ações se fornecida
  if (actions && actions.length > 0) {
    columns.push({
      id: "actions",
      header: () => <div className="px-4 text-right">Ações</div>,
      cell: ({ row }) => (
        <ActionsColumnCell row={row.original} actions={actions} />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  return columns;
}
