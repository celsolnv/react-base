import { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ACTION_LABELS,
  type IGroupedPermissions,
} from "@/lib/permissions-helper";
import { cn } from "@/lib/utils";

interface IPermissionGroupProps {
  group: IGroupedPermissions;
  selectedIds: string[];
  onChange: (id: string, checked: boolean) => void;
  onBulkChange?: (ids: string[], checked: boolean) => void; // Novo: mudança em bulk
  className?: string;
}

export function PermissionGroup({
  group,
  selectedIds,
  onChange,
  onBulkChange,
  className,
}: IPermissionGroupProps) {
  const [isMasterChecked, setIsMasterChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  // IDs das ações deste grupo (memoizado)
  const actionIds = useMemo(
    () => group.actions.map((a) => a.id),
    [group.actions]
  );

  // Calcula o estado do checkbox mestre
  useEffect(() => {
    const selectedCount = actionIds.filter((id) =>
      selectedIds.includes(id)
    ).length;

    if (selectedCount === 0) {
      setIsMasterChecked(false);
      setIsIndeterminate(false);
    } else if (selectedCount === actionIds.length) {
      setIsMasterChecked(true);
      setIsIndeterminate(false);
    } else {
      setIsMasterChecked(false);
      setIsIndeterminate(true);
    }
  }, [selectedIds, actionIds]);

  // Handler do checkbox mestre - usa bulk change se disponível
  const handleMasterChange = (checked: boolean) => {
    if (onBulkChange) {
      // Usa bulk change para atualizar todos de uma vez (evita race conditions)
      onBulkChange(actionIds, checked);
    } else {
      // Fallback: chama onChange para cada ID (pode ter race conditions)
      actionIds.forEach((id) => {
        onChange(id, checked);
      });
    }
  };

  // Handler dos checkboxes individuais
  const handleActionChange = (id: string, checked: boolean) => {
    onChange(id, checked);
  };

  return (
    <div
      className={cn(
        "border-border bg-card/50 hover:bg-card/70 flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors",
        className
      )}
    >
      {/* Checkbox Mestre + Nome do Recurso */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Checkbox
          id={`master-${group.resource}`}
          checked={isMasterChecked}
          onCheckedChange={handleMasterChange}
          aria-label={`Selecionar todas as permissões de ${group.displayName}`}
          className={cn(
            isIndeterminate && "data-[state=checked]:bg-primary/60"
          )}
        />
        <Label
          htmlFor={`master-${group.resource}`}
          className="text-foreground cursor-pointer text-sm font-medium select-none"
        >
          {group.displayName}
        </Label>
      </div>

      {/* Grid de Ações */}
      <div className="flex items-center gap-6">
        {group.actions.map((action) => {
          const isChecked = selectedIds.includes(action.id);
          const actionLabel = ACTION_LABELS[action.type];

          return (
            <div key={action.id} className="flex items-center gap-2">
              <Checkbox
                id={action.id}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleActionChange(action.id, checked === true)
                }
                aria-label={`${actionLabel} ${group.displayName}`}
              />
              <Label
                htmlFor={action.id}
                className="text-muted-foreground cursor-pointer text-sm whitespace-nowrap select-none"
              >
                {actionLabel}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
