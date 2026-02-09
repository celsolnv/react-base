import {
  Briefcase,
  History as HistoryIcon,
  Percent,
  Plane,
  TrendingUp,
} from "lucide-react";

import { CardForm } from "@/components/shared";

import {
  commissionColumns,
  professionalColumns,
  promotionColumns,
  vacationColumns,
} from "./columns";
import { CommissionForm } from "./commission-form";
import { HistoryList } from "./history-list";
import { HistorySection } from "./history-section";
import { ProfessionalForm } from "./professional-form";
import { PromotionForm } from "./promotion-form";
import type {
  ICommissionHistory,
  IProfessionalHistory,
  IPromotionHistory,
  IVacationHistory,
} from "./types";
import { useHistoryForm } from "./use-history-form";
import { VacationForm } from "./vacation-form";

export function HistoryForm() {
  const {
    promotions,
    commissions,
    vacations,
    professional,
    expandedSections,
    toggleSection,
    addingStates,
    setAddingState,
    editingIndexes,
    promotionForm,
    setPromotionForm,
    commissionForm,
    setCommissionForm,
    vacationForm,
    setVacationForm,
    professionalForm,
    setProfessionalForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleRemove,
    resetForm,
  } = useHistoryForm();

  return (
    <CardForm
      icon={<HistoryIcon className="h-5 w-5" />}
      title="Histórico"
      description="Histórico de promoções, comissões, férias e profissional"
    >
      <div className="col-span-12 space-y-4">
        {/* Histórico de Promoções */}
        <HistorySection
          icon={<TrendingUp className="h-5 w-5" />}
          title="Histórico de Promoções"
          count={promotions.fields.length}
          isExpanded={expandedSections.promotions}
          isAdding={addingStates.promotions}
          onToggle={() => toggleSection("promotions")}
          onAdd={() => setAddingState("promotions", true)}
          formComponent={
            <PromotionForm
              form={promotionForm}
              isEditing={editingIndexes.promotions !== null}
              onSave={() =>
                editingIndexes.promotions !== null
                  ? handleUpdate("promotions")
                  : handleAdd("promotions")
              }
              onCancel={() => resetForm("promotions")}
              onChange={(field, value) =>
                setPromotionForm((prev) => ({ ...prev, [field]: value }))
              }
            />
          }
        >
          <HistoryList
            columns={promotionColumns}
            data={promotions.fields as IPromotionHistory[]}
            onEdit={(index) => handleEdit("promotions", index)}
            onRemove={(index) => handleRemove("promotions", index)}
          />
        </HistorySection>

        {/* Histórico de Comissão/PLR */}
        <HistorySection
          icon={<Percent className="h-5 w-5" />}
          title="Histórico de Comissão/PLR"
          count={commissions.fields.length}
          isExpanded={expandedSections.commissions}
          isAdding={addingStates.commissions}
          onToggle={() => toggleSection("commissions")}
          onAdd={() => setAddingState("commissions", true)}
          formComponent={
            <CommissionForm
              form={commissionForm}
              isEditing={editingIndexes.commissions !== null}
              onSave={() =>
                editingIndexes.commissions !== null
                  ? handleUpdate("commissions")
                  : handleAdd("commissions")
              }
              onCancel={() => resetForm("commissions")}
              onChange={(field, value) =>
                setCommissionForm((prev) => ({ ...prev, [field]: value }))
              }
            />
          }
        >
          <HistoryList
            columns={commissionColumns}
            data={commissions.fields as ICommissionHistory[]}
            onEdit={(index) => handleEdit("commissions", index)}
            onRemove={(index) => handleRemove("commissions", index)}
          />
        </HistorySection>

        {/* Histórico de Férias */}
        <HistorySection
          icon={<Plane className="h-5 w-5" />}
          title="Histórico de Férias"
          count={vacations.fields.length}
          isExpanded={expandedSections.vacations}
          isAdding={addingStates.vacations}
          onToggle={() => toggleSection("vacations")}
          onAdd={() => setAddingState("vacations", true)}
          formComponent={
            <VacationForm
              form={vacationForm}
              isEditing={editingIndexes.vacations !== null}
              onSave={() =>
                editingIndexes.vacations !== null
                  ? handleUpdate("vacations")
                  : handleAdd("vacations")
              }
              onCancel={() => resetForm("vacations")}
              onChange={(field, value) =>
                setVacationForm((prev) => ({ ...prev, [field]: value }))
              }
            />
          }
        >
          <HistoryList
            columns={vacationColumns}
            data={vacations.fields as IVacationHistory[]}
            onEdit={(index) => handleEdit("vacations", index)}
            onRemove={(index) => handleRemove("vacations", index)}
          />
        </HistorySection>

        {/* Histórico Profissional */}
        <HistorySection
          icon={<Briefcase className="h-5 w-5" />}
          title="Histórico Profissional"
          count={professional.fields.length}
          isExpanded={expandedSections.professional}
          isAdding={addingStates.professional}
          onToggle={() => toggleSection("professional")}
          onAdd={() => setAddingState("professional", true)}
          formComponent={
            <ProfessionalForm
              form={professionalForm}
              isEditing={editingIndexes.professional !== null}
              onSave={() =>
                editingIndexes.professional !== null
                  ? handleUpdate("professional")
                  : handleAdd("professional")
              }
              onCancel={() => resetForm("professional")}
              onChange={(field, value) =>
                setProfessionalForm((prev) => ({ ...prev, [field]: value }))
              }
            />
          }
        >
          <HistoryList
            columns={professionalColumns}
            data={professional.fields as IProfessionalHistory[]}
            onEdit={(index) => handleEdit("professional", index)}
            onRemove={(index) => handleRemove("professional", index)}
          />
        </HistorySection>
      </div>
    </CardForm>
  );
}
