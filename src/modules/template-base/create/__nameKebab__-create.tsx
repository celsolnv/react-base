import { FormProvider } from "react-hook-form";

import { Lock } from "lucide-react";

import { PageBottomNav } from "@/components/layouts/bottom-nav/page-bottom-nav";
import { useBottomNav } from "@/components/layouts/bottom-nav/use-bottom-nav";
import { HeaderList } from "@/components/shared";
import { cn } from "@/lib/utils";

import { __namePascal__Form } from "../components/form";
import { useCreate__namePascal__ } from "./use-__nameKebab__-create";

export default function Create__namePascal__Page() {
  const { form, isSubmitting, handleCancel, handleSubmit } =
    useCreate__namePascal__();

  const { isActive: isBottomNavActive } = useBottomNav();

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderList
        title="Novo {{labelPt}}"
        description="Defina o nome, descrição e configure este novo {{labelPt}}."
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
            <div
              className={cn("space-y-6", isBottomNavActive ? "pb-24" : "pb-4")}
            >
              <__namePascal__Form />
            </div>
          </div>
        </form>
      </FormProvider>

      <PageBottomNav
        onSubmit={() => {
          form.handleSubmit(handleSubmit)();
        }}
        submitLabel="Criar {{labelPt}}"
        submitIcon={<Lock className="h-4 w-4" />}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
}
