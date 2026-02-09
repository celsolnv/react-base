import { Plus, Wallet } from "lucide-react";

import { Button, Separator } from "@/components/shadcn";
import {
  CardForm,
  InputFormCurrency,
  InputFormPercentage,
  SelectForm,
} from "@/components/shared";
import { periodicityOptions, valueTypeOptions } from "@/constants/options";

import { commissionTypeOptions } from "../../../constants/options";
import { BenefitForm } from "./benefit-form";
import { BenefitList } from "./benefit-list";
import type { IBenefit } from "./types";
import { useFinancialForm } from "./use-financial-form";

export function FinancialForm() {
  const {
    hasBonus,
    isPercentageBonus,
    fields,
    remove,
    isAddingBenefit,
    editingIndex,
    benefitForm,
    handleBenefitFieldChange,
    handleAddBenefit,
    handleEditBenefit,
    handleUpdateBenefit,
    handleCancelBenefit,
    handleToggleStatus,
    setIsAddingBenefit,
  } = useFinancialForm();
  return (
    <CardForm
      title="Dados de Financeiros"
      description="Defina as informações financeiras do usuário."
      icon={<Wallet className="text-foreground/80 h-5 w-5" />}
    >
      <InputFormCurrency
        label="Salário"
        name="salary"
        placeholder="Salário"
        className="col-span-12 sm:col-span-6"
        required
      />
      <SelectForm
        label="Comissão/PLR"
        name="commission_type"
        options={commissionTypeOptions}
        placeholder="Comissão/PLR"
        className="col-span-12 sm:col-span-6"
        required
      />
      <Separator className="col-span-12 sm:col-span-12" />
      {hasBonus && (
        <>
          <SelectForm
            label="Tipo de valor"
            name="commission_value_type"
            options={valueTypeOptions}
            placeholder="Tipo de valor"
            className="col-span-12 sm:col-span-4"
            required
          />
          {isPercentageBonus && (
            <InputFormPercentage
              label="Valor"
              name="commission_value"
              placeholder="Percentual"
              className="col-span-12 sm:col-span-4"
              required
            />
          )}
          {!isPercentageBonus && (
            <InputFormCurrency
              label="Valor"
              name="commission_value"
              placeholder="Valor"
              className="col-span-12 sm:col-span-4"
              required
            />
          )}
          <SelectForm
            label="Periodicidade"
            name="commission_periodicity"
            options={periodicityOptions}
            placeholder="Periodicidade"
            className="col-span-12 sm:col-span-4"
            required
          />
          <Separator className="col-span-12 my-4 sm:col-span-12" />
        </>
      )}

      {/* Seção de Benefícios */}
      <div className="col-span-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground text-lg font-semibold">
                Benefícios
              </h3>
              <p className="text-muted-foreground text-sm">
                Gerencie os benefícios do usuário
              </p>
            </div>
          </div>

          <BenefitList
            benefits={fields as IBenefit[]}
            onEdit={handleEditBenefit}
            onRemove={remove}
            onToggleStatus={handleToggleStatus}
          />

          {isAddingBenefit && (
            <BenefitForm
              benefitForm={benefitForm}
              isEditing={editingIndex !== null}
              onSave={
                editingIndex !== null ? handleUpdateBenefit : handleAddBenefit
              }
              onCancel={handleCancelBenefit}
              onChange={handleBenefitFieldChange}
            />
          )}

          {!isAddingBenefit && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsAddingBenefit(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Benefício
            </Button>
          )}
        </div>
      </div>
    </CardForm>
  );
}
