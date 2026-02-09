import type { ColumnDef } from "@tanstack/react-table";

import {
  renderActionsCell,
  renderBadgeCell,
  renderBooleanCell,
  renderCurrencyCell,
  renderDateCell,
  renderTextCell,
} from "./renders";
import type { ColumnConfig, TableAction } from "./types";

type TPrimitiveValue = string | number | boolean | bigint;

export function buildColumns<TData>(
  config: ColumnConfig<TData>[],
  actions?: TableAction<TData>[]
): ColumnDef<TData>[] {
  const columns: ColumnDef<TData>[] = config.map((col) => {
    const baseColumn: ColumnDef<TData> = {
      accessorKey: col.accessorKey as string,
      header: col.header,
    };

    baseColumn.cell = ({ row }) => {
      const value = row.getValue(col.accessorKey as string);

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
        <div className="px-4 text-right">
          {renderActionsCell(row.original, actions)}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  return columns;
}
