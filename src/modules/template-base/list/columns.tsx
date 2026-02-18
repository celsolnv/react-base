import { Edit, Power, Trash2 } from "lucide-react";

import { buildColumns } from "@/components/shared";

import type { I__namePascal__ } from "../types";

export interface I__namePascal__TableActions {
  onEdit: (profile: I__namePascal__) => void;
  onDelete: (profile: I__namePascal__) => void;
  onDeactivate: (profile: I__namePascal__) => void;
}

export function getColumns(actions: I__namePascal__TableActions) {
  return buildColumns<I__namePascal__>(
    [
      {
        accessorKey: "name",
        header: "Nome do Perfil",
        type: "text",
        className: "font-medium",
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
