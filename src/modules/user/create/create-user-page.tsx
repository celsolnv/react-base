import { FormProvider } from "react-hook-form";

import { Lock } from "lucide-react";

import { PageBottomNav } from "@/components/layouts/bottom-nav/page-bottom-nav";
import { useBottomNav } from "@/components/layouts/bottom-nav/use-bottom-nav";
import { HeaderList } from "@/components/shared";
import { cn } from "@/lib/utils";

import { UserForm } from "../components/user-form";
import { useCreateUser } from "./use-create-user";

export default function CreateUserPage() {
  const { form, isSubmitting, handleCancel, handleSubmit } = useCreateUser();

  const { isActive: isBottomNavActive } = useBottomNav();

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderList
        title="Novo Usuário"
        description="Preencha as informações abaixo para cadastrar um novo usuário no sistema."
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
        submitLabel="Criar Usuário"
        submitIcon={<Lock className="h-4 w-4" />}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
}
