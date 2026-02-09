import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IBenefit, TBenefitForm } from "./types";

export function useFinancialForm() {
  const form = useFormContext();
  const commissionType = useWatch({
    control: form.control,
    name: "commission_type",
  });
  const valueType = useWatch({
    control: form.control,
    name: "commission_value_type",
  });

  const hasBonus = useMemo(() => {
    return ["commission", "PLR"].includes(commissionType);
  }, [commissionType]);

  const isPercentageBonus = useMemo(() => {
    return valueType === "percentage";
  }, [valueType]);

  useEffect(() => {
    if (form.watch("commission_type") === "None") {
      form.setValue("commission_value", null);
      form.setValue("commission_value_type", null);
      form.setValue("commission_periodicity", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("commission_type")]);

  // Gerenciamento de benefícios
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [benefitForm, setBenefitForm] = useState<TBenefitForm>({
    name: "",
    value: "0,00",
    frequency: "monthly",
  });

  const handleBenefitFieldChange = (
    field: keyof TBenefitForm,
    value: string
  ) => {
    setBenefitForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBenefit = () => {
    if (!benefitForm.name || !benefitForm.value) return;

    append({
      ...benefitForm,
      is_active: true,
    });

    resetBenefitForm();
  };

  const handleEditBenefit = (index: number) => {
    const benefit = fields[index] as IBenefit;
    setBenefitForm({
      name: benefit.name,
      value: benefit.value,
      frequency: benefit.frequency,
    });
    setEditingIndex(index);
    setIsAddingBenefit(true);
  };

  const handleUpdateBenefit = () => {
    if (editingIndex === null || !benefitForm.name || !benefitForm.value)
      return;

    const currentBenefit = fields[editingIndex] as IBenefit;
    update(editingIndex, {
      ...benefitForm,
      is_active: currentBenefit.is_active,
    });

    resetBenefitForm();
  };

  const handleCancelBenefit = () => {
    resetBenefitForm();
  };

  const handleToggleStatus = (index: number) => {
    const benefit = fields[index] as IBenefit;
    update(index, {
      ...benefit,
      is_active: !benefit.is_active,
    });
  };

  const resetBenefitForm = () => {
    setBenefitForm({
      name: "",
      value: "0,00",
      frequency: "monthly",
    });
    setEditingIndex(null);
    setIsAddingBenefit(false);
  };

  return {
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
  };
}
