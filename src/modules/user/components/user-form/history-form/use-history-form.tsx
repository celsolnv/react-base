import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type {
  TCommissionForm,
  THistorySection,
  TProfessionalForm,
  TPromotionForm,
  TVacationForm,
} from "./types";

export function useHistoryForm() {
  const form = useFormContext();

  // Field Arrays para cada seção
  const promotions = useFieldArray({
    control: form.control,
    name: "promotions_history",
  });

  const commissions = useFieldArray({
    control: form.control,
    name: "commission_history",
  });

  const vacations = useFieldArray({
    control: form.control,
    name: "vacations_history",
  });

  const professional = useFieldArray({
    control: form.control,
    name: "professional_history",
  });

  // Estados para controlar seções expandidas
  const [expandedSections, setExpandedSections] = useState<
    Record<THistorySection, boolean>
  >({
    promotions: false,
    commissions: false,
    vacations: false,
    professional: false,
  });

  // Estados para controlar adição de novo item em cada seção
  const [addingStates, setAddingStates] = useState<
    Record<THistorySection, boolean>
  >({
    promotions: false,
    commissions: false,
    vacations: false,
    professional: false,
  });

  // Estados para controlar edição
  const [editingIndexes, setEditingIndexes] = useState<
    Record<THistorySection, number | null>
  >({
    promotions: null,
    commissions: null,
    vacations: null,
    professional: null,
  });

  // Formulários temporários para cada seção
  const [promotionForm, setPromotionForm] = useState<TPromotionForm>({
    date: "",
    last_salary: "0,00",
    new_salary: "0,00",
    note: "",
  });

  const [commissionForm, setCommissionForm] = useState<TCommissionForm>({
    date: "",
    last_commission: "0,00",
    new_commission: "0,00",
    note: "",
  });

  const [vacationForm, setVacationForm] = useState<TVacationForm>({
    start_date: "",
    end_date: "",
    days: 30,
    note: "",
  });

  const [professionalForm, setProfessionalForm] = useState<TProfessionalForm>({
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    note: "",
  });

  // Toggle de seções expandidas
  const toggleSection = (section: THistorySection) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle de estado de adição
  const setAddingState = (section: THistorySection, state: boolean) => {
    setAddingStates((prev) => ({
      ...prev,
      [section]: state,
    }));
  };

  // Funções genéricas para manipulação de items
  const handleAdd = (section: THistorySection) => {
    let data;
    let append;

    switch (section) {
      case "promotions":
        data = promotionForm;
        append = promotions.append;
        break;
      case "commissions":
        data = commissionForm;
        append = commissions.append;
        break;
      case "vacations":
        data = vacationForm;
        append = vacations.append;
        break;
      case "professional":
        data = professionalForm;
        append = professional.append;
        break;
    }

    append(data);
    resetForm(section);
  };

  const handleEdit = (section: THistorySection, index: number) => {
    let fields;
    let setForm;

    switch (section) {
      case "promotions":
        fields = promotions.fields;
        setForm = setPromotionForm;
        break;
      case "commissions":
        fields = commissions.fields;
        setForm = setCommissionForm;
        break;
      case "vacations":
        fields = vacations.fields;
        setForm = setVacationForm;
        break;
      case "professional":
        fields = professional.fields;
        setForm = setProfessionalForm;
        break;
    }

    const item = fields[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm(item as any);
    setEditingIndexes((prev) => ({ ...prev, [section]: index }));
    setAddingState(section, true);
  };

  const handleUpdate = (section: THistorySection) => {
    const editingIndex = editingIndexes[section];
    if (editingIndex === null) return;

    let data;
    let update;

    switch (section) {
      case "promotions":
        data = promotionForm;
        update = promotions.update;
        break;
      case "commissions":
        data = commissionForm;
        update = commissions.update;
        break;
      case "vacations":
        data = vacationForm;
        update = vacations.update;
        break;
      case "professional":
        data = professionalForm;
        update = professional.update;
        break;
    }

    update(editingIndex, data);
    resetForm(section);
  };

  const handleRemove = (section: THistorySection, index: number) => {
    switch (section) {
      case "promotions":
        promotions.remove(index);
        break;
      case "commissions":
        commissions.remove(index);
        break;
      case "vacations":
        vacations.remove(index);
        break;
      case "professional":
        professional.remove(index);
        break;
    }
  };

  const resetForm = (section: THistorySection) => {
    switch (section) {
      case "promotions":
        setPromotionForm({
          date: "",
          last_salary: "0,00",
          new_salary: "0,00",
          note: "",
        });
        break;
      case "commissions":
        setCommissionForm({
          date: "",
          last_commission: "0,00",
          new_commission: "0,00",
          note: "",
        });
        break;
      case "vacations":
        setVacationForm({
          start_date: "",
          end_date: "",
          days: 30,
          note: "",
        });
        break;
      case "professional":
        setProfessionalForm({
          company_name: "",
          role: "",
          start_date: "",
          end_date: "",
          note: "",
        });
        break;
    }

    setEditingIndexes((prev) => ({ ...prev, [section]: null }));
    setAddingState(section, false);
  };

  return {
    // Field arrays
    promotions,
    commissions,
    vacations,
    professional,
    // Estados de expansão
    expandedSections,
    toggleSection,
    // Estados de adição
    addingStates,
    setAddingState,
    // Estados de edição
    editingIndexes,
    // Formulários
    promotionForm,
    setPromotionForm,
    commissionForm,
    setCommissionForm,
    vacationForm,
    setVacationForm,
    professionalForm,
    setProfessionalForm,
    // Ações
    handleAdd,
    handleEdit,
    handleUpdate,
    handleRemove,
    resetForm,
  };
}
