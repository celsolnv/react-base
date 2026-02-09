import { Edit, Power, Trash2 } from "lucide-react";

import { buildColumns } from "@/components/shared";
import type { IAccessProfile } from "@/types/IAcessProfile";

export interface IAccessProfileTableActions {
  onEdit: (profile: IAccessProfile) => void;
  onDelete: (profile: IAccessProfile) => void;
  onDeactivate: (profile: IAccessProfile) => void;
}

export function getColumns(actions: IAccessProfileTableActions) {
  return buildColumns<IAccessProfile>(
    [
      {
        accessorKey: "name",
        header: "Nome do Perfil",
        type: "text",
        className: "font-medium",
      },
      {
        accessorKey: "note",
        header: "Descrição",
        type: "text",
        className: "max-w-[500px] truncate text-muted-foreground",
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
        onClick: (profile) => actions.onEdit(profile),
      },
      {
        label: (profile) => (profile.is_active ? "Desativar" : "Ativar"),
        icon: Power,
        onClick: (profile) => actions.onDeactivate(profile),
      },
      {
        label: "Excluir",
        icon: Trash2,
        onClick: (profile) => actions.onDelete(profile),
        variant: "destructive",
        hasSeparatorBefore: true,
      },
    ]
  );
}
