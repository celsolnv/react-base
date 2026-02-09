import { FormProvider } from "react-hook-form";

import { Save } from "lucide-react";

import { PageBottomNav } from "@/components/layouts/bottom-nav/page-bottom-nav";
import { useBottomNav } from "@/components/layouts/bottom-nav/use-bottom-nav";
import { HeaderList } from "@/components/shared";
import { useFormDebug } from "@/hooks/use-form-debug";
import { cn } from "@/lib/utils";

import { UserForm } from "../components/user-form";
import { useUpdateUser } from "./use-update-user";

export default function UpdateUserPage() {
  const { form, isSubmitting, handleCancel, handleSubmit } = useUpdateUser();

  const { isActive: isBottomNavActive } = useBottomNav();

  useFormDebug(form);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderList
        title="Editar Usuário"
        description="Atualize as informações do usuário."
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
            <div
              className={cn("space-y-6", isBottomNavActive ? "pb-24" : "pb-4")}
            >
              <UserForm />
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
