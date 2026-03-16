import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";

interface ISimpleTableProps<TData extends Record<string, unknown>> {
  /**
   * Array de strings representando os nomes das colunas
   */
  readonly columns: readonly string[];
  /**
   * Array de objetos com os dados a serem exibidos
   */
  readonly data: readonly TData[];
  /**
   * Array com as chaves dos objetos ou funções para renderizar o conteúdo
   */
  readonly dataKeys: readonly (
    | keyof TData
    | ((row: TData) => React.ReactNode)
  )[];
  /**
   * Mensagem exibida quando não há dados
   */
  readonly emptyMessage?: string;
  /**
   * Estado de carregamento
   */
  readonly isLoading?: boolean;
  /**
   * Função customizada para renderizar células específicas
   */
  readonly renderCell?: (
    key: keyof TData,
    value: unknown,
    row: TData
  ) => React.ReactNode;
  /**
   * Função para renderizar ações por linha (ex: editar, deletar)
   * Quando fornecida, adiciona uma coluna "Ações" no final da tabela
   */
  readonly actions?: (row: TData) => React.ReactNode;
  /**
   * Título da coluna de ações
   * @default "Ações"
   */
  readonly actionsLabel?: string;
}

export function SimpleTable<TData extends Record<string, unknown>>({
  columns,
  data,
  dataKeys,
  emptyMessage = "Nenhum registro encontrado.",
  isLoading = false,
  renderCell,
  actions,
  actionsLabel = "Ações",
}: Readonly<ISimpleTableProps<TData>>) {
  // Validação básica
  if (columns.length !== dataKeys.length) {
    console.warn(
      "SimpleTable: O número de colunas deve ser igual ao número de dataKeys"
    );
  }

  // Total de colunas incluindo ações se houver
  const totalColumns = actions ? columns.length + 1 : columns.length;

  const renderCellContent = (key: keyof TData, value: unknown, row: TData) => {
    if (renderCell) {
      return renderCell(key, value, row);
    }

    // Renderização padrão
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    // Evitar renderizar [object Object] para objetos e arrays
    if (typeof value === "object") {
      return <span className="text-muted-foreground">-</span>;
    }

    // Converter apenas valores primitivos para string
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint" ||
      typeof value === "symbol"
    ) {
      return String(value);
    }

    return <span className="text-muted-foreground">-</span>;
  };

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 border-border border-b hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={`header-${column}`}
                className="text-foreground/70 h-12 px-4 text-xs font-semibold tracking-wider uppercase"
              >
                {column}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-foreground/70 h-12 px-4 text-right text-xs font-semibold tracking-wider uppercase">
                {actionsLabel}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="text-muted-foreground h-24 text-center"
              >
                Carregando...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => {
              // Tentar usar um ID se disponível, caso contrário usar index
              const rowKey =
                "id" in row && typeof row.id === "string"
                  ? row.id
                  : `row-${rowIndex}`;

              return (
                <TableRow key={rowKey} className="hover:bg-muted/50">
                  {dataKeys.map((key, keyIndex) => {
                    const cellContent =
                      typeof key === "function"
                        ? key(row)
                        : renderCellContent(key, row[key], row);

                    return (
                      <TableCell
                        key={`${rowKey}-${keyIndex}`}
                        className="px-4 py-3"
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                  {actions && (
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
