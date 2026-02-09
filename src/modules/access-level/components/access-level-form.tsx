import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Building2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormMessage,
} from "@/components/shadcn";
import { InputForm, TextareaForm } from "@/components/shared";
import type { IPermission } from "@/lib/permissions-helper";

import { PermissionsSelector } from "./permissions-selector";

interface IAccessLevelFormProps {
  readonly control: Control;
  readonly permissions: IPermission[];
  readonly isLoading?: boolean;
}

export function AccessLevelForm({
  control,
  permissions,
  isLoading = false,
}: IAccessLevelFormProps) {
  return (
    <div className="space-y-6">
      {/* Dados do Perfil */}
      <Card className="bg-card border-border shadow-card gap-0 pt-0">
        <CardHeader className="bg-secondary/30 border-border gap-1 border-b pt-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/50 border-border/50 shadow-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
              <Building2 className="text-foreground/80 h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-card-foreground mb-1 text-lg font-semibold">
                Dados do Perfil
              </CardTitle>
              <CardDescription>
                Defina as informações básicas que identificam este perfil de
                acesso no sistema.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <InputForm
            control={control}
            name="name"
            label="Nome do Perfil"
            placeholder="Ex: Gerente de Frota"
            description="Nome único para identificar este perfil."
            required
          />

          <TextareaForm
            control={control}
            name="note"
            label="Descrição"
            placeholder="Ex: Acesso completo ao módulo de frota..."
            description="Informações adicionais sobre o propósito (opcional)."
          />
        </CardContent>
      </Card>

      {/* Seleção de Permissões - Integrado com React Hook Form */}
      <Controller
        control={control}
        name="permissions"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <PermissionsSelector
              permissions={permissions}
              selectedPermissions={field.value}
              onSelectionChange={field.onChange}
              loading={isLoading || !permissions || permissions.length === 0}
            />
            {fieldState.error && (
              <FormMessage className="text-destructive text-sm font-medium">
                {fieldState.error.message}
              </FormMessage>
            )}
          </div>
        )}
      />
    </div>
  );
}
