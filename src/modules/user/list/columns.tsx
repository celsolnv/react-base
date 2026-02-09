import { Edit, Power, Trash2 } from "lucide-react";

import { buildColumns } from "@/components/shared";
import type { IUser } from "@/types/IUser";

export interface IUserTableActions {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onDeactivate: (user: IUser) => void;
}

export function getColumns(actions: IUserTableActions) {
  return buildColumns<IUser>(
    [
      {
        accessorKey: "name",
        header: "Nome do Usuário",
        type: "text",
        className: "font-medium",
      },
      {
        accessorKey: "email",
        header: "E-mail",
        type: "text",
        className: "text-muted-foreground",
      },
      {
        accessorKey: "is_active",
        header: "Status",
        type: "boolean",
        trueLabel: "ATIVO",
        falseLabel: "INATIVO",
        trueBadgeVariant: "success",
        falseBadgeVariant: "muted",
      },
    ],
    [
      {
        label: "Editar",
        icon: Edit,
        onClick: (user) => actions.onEdit(user),
      },
      {
        label: (user) => (user.is_active ? "Desativar" : "Ativar"),
        icon: Power,
        onClick: (user) => actions.onDeactivate(user),
      },
      {
        label: "Excluir",
        icon: Trash2,
        onClick: (user) => actions.onDelete(user),
        variant: "destructive",
        hasSeparatorBefore: true,
      },
    ]
  );
}
