import { FormProvider } from "react-hook-form";

import { Lock } from "lucide-react";

import { PageBottomNav } from "@/components/layouts/bottom-nav/page-bottom-nav";
import { useBottomNav } from "@/components/layouts/bottom-nav/use-bottom-nav";
import { HeaderList } from "@/components/shared";
import { cn } from "@/lib/utils";

import { AccessLevelForm } from "../components";
import { useCreateAccessLevel } from "./use-create-access-level";

export default function CreateAccessLevelPage() {
  const { form, isSubmitting, handleCancel, handleSubmit, permissions } =
    useCreateAccessLevel();

  const { isActive: isBottomNavActive } = useBottomNav();

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderList
        title="Novo Perfil de Acesso"
        description="Defina o nome, descrição e configure as permissões granulares para este novo perfil."
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
        submitLabel="Criar Perfil de Acesso"
        submitIcon={<Lock className="h-4 w-4" />}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
}
