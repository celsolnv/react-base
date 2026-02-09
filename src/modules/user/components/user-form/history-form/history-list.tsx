import { Edit, Trash2 } from "lucide-react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn";

interface IColumn {
  header: string;
  accessor: string;
  render?: (value: unknown, row: unknown) => React.ReactNode;
  width?: string;
}

interface IHistoryListProps {
  columns: IColumn[];
  data: any[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function HistoryList({
  columns,
  data,
  onEdit,
  onRemove,
}: Readonly<IHistoryListProps>) {
  if (data.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  const getCellValue = (row: any, column: IColumn) => {
    const value = row[column.accessor];

    if (column.render) {
      return column.render(value, row);
    }

    // Auto-format dates
    if (column.accessor.includes("date") || column.accessor.includes("_date")) {
      return formatDate(value);
    }

    // Auto-format currency
    if (
      column.accessor.includes("salary") ||
      column.accessor.includes("value")
    ) {
      return `R$ ${value}`;
    }

    return value;
  };

  return (
    <div className="border-border rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor} className={column.width}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-[15%] text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map((column) => (
                <TableCell key={column.accessor} className="font-medium">
                  {getCellValue(row, column)}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
