import { useMemo } from "react";

import { ShieldCheck } from "lucide-react";

import { PermissionGroup } from "@/components/shared/permission-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllPermissionIds,
  groupPermissionsByResource,
  type IPermission,
} from "@/lib/permissions-helper";

interface IPermissionsSelectorProps {
  readonly permissions: IPermission[];
  readonly selectedPermissions: string[];
  readonly onSelectionChange: (selectedIds: string[]) => void;
  readonly loading?: boolean;
}

export function PermissionsSelector({
  permissions,
  selectedPermissions,
  onSelectionChange,
  loading = false,
}: IPermissionsSelectorProps) {
  // Agrupa as permissões por resource
  const groupedPermissions = groupPermissionsByResource(permissions);

  // Todos os IDs disponíveis
  const allPermissionIds = getAllPermissionIds(permissions);

  // Calcula o estado do "Selecionar Tudo" usando useMemo
  // Radix UI Checkbox aceita: true | false | "indeterminate"
  const selectAllState = useMemo(() => {
    const selectedCount = selectedPermissions.filter((id) =>
      allPermissionIds.includes(id)
    ).length;

    if (selectedCount === 0) {
      return false;
    }
    if (selectedCount === allPermissionIds.length) {
      return true;
    }
    return "indeterminate" as const;
  }, [selectedPermissions, allPermissionIds]);

  // Handler do checkbox "Selecionar Tudo"
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? allPermissionIds : []);
  };

  // Handler de mudança individual de permissão
  const handlePermissionChange = (id: string, checked: boolean) => {
    // Encontra a permissão e seu grupo
    const permission = permissions.find((p) => p.id === id);
    if (!permission?.resource) return;

    // Encontra o grupo da permissão
    const group = groupedPermissions.find(
      (g) => g.resource === permission.resource
    );
    if (!group) return;

    // Encontra a ação atual e a ação de "read" (visualizar) do mesmo grupo
    const currentAction = group.actions.find((a) => a.id === id);
    const readAction = group.actions.find((a) => a.type === "read");

    if (checked) {
      // Adiciona o ID se não existir
      const newIds = selectedPermissions.includes(id)
        ? selectedPermissions
        : [...selectedPermissions, id];

      // Regra: Se marcar create/update/delete, marca automaticamente o "read"
      if (
        currentAction &&
        ["create", "update", "delete"].includes(currentAction.type) &&
        readAction &&
        !newIds.includes(readAction.id)
      ) {
        newIds.push(readAction.id);
      }

      onSelectionChange(newIds);
      return;
    }

    // Remove o ID
    let newIds = selectedPermissions.filter((permId) => permId !== id);

    // Regra: Se desmarcar "read", desmarca automaticamente todas as outras do grupo
    if (currentAction?.type === "read") {
      const groupActionIdsSet = new Set(group.actions.map((a) => a.id));
      newIds = newIds.filter((permId) => !groupActionIdsSet.has(permId));
    }

    onSelectionChange(newIds);
  };

  // Handler de mudança em bulk (múltiplos IDs de uma vez)
  const handleBulkPermissionChange = (ids: string[], checked: boolean) => {
    if (checked) {
      // Adiciona todos os IDs que ainda não estão selecionados
      const newIds = [...selectedPermissions];
      ids.forEach((id) => {
        if (!newIds.includes(id)) {
          newIds.push(id);
        }
      });
      onSelectionChange(newIds);
    } else {
      // Remove todos os IDs
      const idsToRemoveSet = new Set(ids);
      const newIds = selectedPermissions.filter(
        (id) => !idsToRemoveSet.has(id)
      );
      onSelectionChange(newIds);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border shadow-card gap-0 pt-0">
        <CardHeader className="bg-secondary/30 border-border gap-1 border-b pt-6 pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-card gap-0 pt-0">
      <CardHeader className="bg-secondary/30 border-border gap-1 border-b pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/50 border-border/50 shadow-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
            <ShieldCheck className="text-foreground/80 h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-card-foreground mb-1 text-lg font-semibold">
              Permissões do Perfil
            </CardTitle>
            <CardDescription>
              Selecione as ações que este perfil poderá executar em cada módulo
              do sistema.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Selecionar Tudo */}
        <div className="border-primary/20 bg-primary/5 flex items-center gap-3 rounded-lg border-2 p-4">
          <Checkbox
            id="select-all"
            checked={selectAllState}
            onCheckedChange={handleSelectAll}
            aria-label="Selecionar todas as permissões"
          />
          <Label
            htmlFor="select-all"
            className="text-foreground cursor-pointer text-sm font-semibold select-none"
          >
            Selecionar Tudo
          </Label>
          <span className="text-muted-foreground ml-auto text-xs">
            {selectedPermissions.length} de {allPermissionIds.length}{" "}
            selecionadas
          </span>
        </div>

        {/* Lista de Grupos de Permissões */}
        <div className="space-y-3">
          {groupedPermissions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Nenhuma permissão disponível
            </div>
          ) : (
            groupedPermissions.map((group) => (
              <PermissionGroup
                key={group.resource}
                group={group}
                selectedIds={selectedPermissions}
                onChange={handlePermissionChange}
                onBulkChange={handleBulkPermissionChange}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
