import { Edit, Power, Trash2 } from "lucide-react";

import { buildColumns } from "@/components/shared";
import masks from "@/utils/masks";

import type { IClient } from "../types";

export interface IAccessProfileTableActions {
  onEdit: (profile: IClient) => void;
  onDelete: (profile: IClient) => void;
  onDeactivate: (profile: IClient) => void;
}

export function getColumns(actions: IAccessProfileTableActions) {
  return buildColumns<IClient>(
    [
      {
        header: "Código",
        accessorKey: "public_code",
        type: "text",
        className: "font-medium w-[10px] truncate text-muted-foreground",
      },
      {
        header: "Nome",
        accessorKey: "id",
        type: "custom",
        className: "max-w-[500px] truncate text-muted-foreground",
        cell: (_value, row: IClient) => {
          if (row.type === "INDIVIDUAL") {
            return row.client_individual_details?.name || "-";
          }
          if (row.type === "CORPORATE") {
            return row.client_corporate_details?.reason_social || "-";
          }
          if (row.type === "PARTNER") {
            return row.client_partner_details?.reason_social || "-";
          }
          return "-";
        },
      },
      {
        header: "Tipo",
        accessorKey: "type",
        type: "custom",
        className: "max-w-[500px] truncate text-muted-foreground",
        cell: (_value, row: IClient) =>
          row.type === "INDIVIDUAL"
            ? "Pessoa Física"
            : row.type === "CORPORATE"
              ? "Pessoa Jurídica"
              : "Parceiro",
      },
      {
        header: "Contato",
        accessorKey: "phone",
        type: "custom",
        cell: (_value, row: IClient) => {
          const phone = row.phone ? masks.phone(row.phone) : null;
          const email = row.email || null;

          if (!phone && !email) {
            return <span className="text-muted-foreground">-</span>;
          }

          return (
            <div className="flex flex-col gap-1">
              {phone && <span className="text-muted-foreground">{phone}</span>}
              {email && (
                <span className="text-muted-foreground text-sm">{email}</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        type: "badge",
        badgeMap: {
          true: "success",
          false: "muted",
          ACTIVE: "success",
          INACTIVE: "muted",
          DEFAULTER: "destructive",
          active: "success",
          inactive: "muted",
          defaulter: "destructive",
        },
        labelMap: {
          true: "ATIVO",
          false: "INATIVO",
          ACTIVE: "ATIVO",
          INACTIVE: "INATIVO",
          DEFAULTER: "INADIMPLENTE",
          active: "ATIVO",
          inactive: "INATIVO",
          defaulter: "INADIMPLENTE",
        },
        defaultVariant: "muted",
      },
    ],
    [
      {
        label: "Editar",
        icon: Edit,
        onClick: (profile) => actions.onEdit(profile),
      },
      {
        label: (profile) =>
          profile.status === "ACTIVE" ? "Desativar" : "Ativar",
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
