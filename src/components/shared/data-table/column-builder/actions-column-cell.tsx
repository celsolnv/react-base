import { ActionsCell } from "./renders";
import type { TableAction } from "./types";

interface IActionsColumnCellProps<TData> {
  readonly row: TData;
  readonly actions: TableAction<TData>[];
}

export function ActionsColumnCell<TData>({
  row,
  actions,
}: Readonly<IActionsColumnCellProps<TData>>) {
  return (
    <div className="px-4 text-right">
      <ActionsCell row={row} actions={actions} />
    </div>
  );
}
