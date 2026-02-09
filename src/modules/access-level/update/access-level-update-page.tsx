import { FormProvider } from "react-hook-form";

import { Save } from "lucide-react";

import { PageBottomNav } from "@/components/layouts/bottom-nav/page-bottom-nav";
import { useBottomNav } from "@/components/layouts/bottom-nav/use-bottom-nav";
import { HeaderList } from "@/components/shared";
import { cn } from "@/lib/utils";

import { AccessLevelForm } from "../components";
import { useUpdateAccessLevel } from "./use-update-access-level";

export default function UpdateAccessLevelPage() {
  const {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
    permissions,
    accessProfile,
  } = useUpdateAccessLevel();

  const { isActive: isBottomNavActive } = useBottomNav();

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderList
        title="Editar Perfil de Acesso"
        description={`Atualize as informações e permissões do perfil "${accessProfile?.name || ""}".`}
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
            <div
              className={cn("space-y-6", isBottomNavActive ? "pb-24" : "pb-4")}
            >
              <AccessLevelForm
                control={form.control}
                permissions={permissions}
                errors={form.formState.errors}
              />
            </div>
          </div>
        </form>
      </FormProvider>

      <PageBottomNav
        onSubmit={() => {
          form.handleSubmit(handleSubmit)();
        }}
        submitLabel="Salvar Alterações"
        submitIcon={<Save className="h-4 w-4" />}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
}
