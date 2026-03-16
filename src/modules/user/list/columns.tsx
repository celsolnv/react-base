import { Edit, Power, Trash2 } from "lucide-react";

import { buildColumns } from "@/components/shared/data-table/column-builder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IUser } from "@/types";
import { getFileUrl } from "@/utils/file";
import { getUserInitials } from "@/utils/text";

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
        header: "Usuário",
        type: "custom",
        className: "font-medium",
        cell: (_, row) => {
          const userName = row.name;
          const profilePicture = getFileUrl(row.profile_picture);
          const initials = getUserInitials(userName);

          return (
            <div className="flex items-center gap-3">
              <Avatar className="border-border size-9 border">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt={userName} />
                ) : null}
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{userName}</span>
            </div>
          );
        },
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
        permission: "user.update",
      },
      {
        label: (user) => (user.is_active ? "Desativar" : "Ativar"),
        icon: Power,
        onClick: (user) => actions.onDeactivate(user),
        permission: "user.update",
      },
      {
        label: "Excluir",
        icon: Trash2,
        onClick: (user) => actions.onDelete(user),
        variant: "destructive",
        hasSeparatorBefore: true,
        permission: "user.destroy",
      },
    ]
  );
}
