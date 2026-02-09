import { X } from "lucide-react";

import { Button, Input, Label, Textarea } from "@/components/shadcn";
import Mask from "@/utils/masks";

import { Fieldset } from "../../fieldset";
import type { TPromotionForm } from "./types";

interface IPromotionFormProps {
  form: TPromotionForm;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof TPromotionForm, value: string) => void;
}

export function PromotionForm({
  form,
  isEditing,
  onSave,
  onCancel,
  onChange,
}: Readonly<IPromotionFormProps>) {
  const handleCurrencyChange = (
    field: keyof TPromotionForm,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    const maskedValue = Mask.money(rawValue);
    const valueWithoutPrefix = maskedValue?.replace(/^R\$\s*/, "");
    onChange(field, valueWithoutPrefix);
  };

  return (
    <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground font-medium">
          {isEditing ? "Editar Promoção" : "Nova Promoção"}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Fieldset
          id="promotion-date"
          label="Data"
          type="date"
          value={form.date}
          onChange={(e) => onChange("date", e.target.value)}
          required
        />

        <div className="col-span-12 sm:col-span-3">
          <Label htmlFor="promotion-old-salary">Salário Anterior</Label>
          <div className="relative mt-2">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
              R$
            </div>
            <Input
              id="promotion-old-salary"
              type="text"
              value={form.last_salary}
              onChange={(e) => handleCurrencyChange("last_salary", e)}
              placeholder="0,00"
              className="pl-12"
            />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-3">
          <Label htmlFor="promotion-new-salary">Novo Salário</Label>
          <div className="relative mt-2">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
              R$
            </div>
            <Input
              id="promotion-new-salary"
              type="text"
              value={form.new_salary}
              onChange={(e) => handleCurrencyChange("new_salary", e)}
              placeholder="0,00"
              className="pl-12"
            />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-3">
          <Label>Diferença</Label>
          <div className="bg-muted text-foreground mt-2 flex h-10 items-center rounded-md px-3 font-medium">
            {(() => {
              const oldValue = parseFloat(
                form.last_salary?.replace(/\./g, "")?.replace(",", ".")
              );
              const newValue = parseFloat(
                form.new_salary?.replace(/\./g, "")?.replace(",", ".")
              );
              const diff = newValue - oldValue;
              const percentage =
                oldValue > 0 ? ((diff / oldValue) * 100).toFixed(1) : "0.0";
              return `${diff >= 0 ? "+" : ""}${percentage}%`;
            })()}
          </div>
        </div>

        <div className="col-span-12">
          <Label htmlFor="promotion-description">Descrição</Label>
          <Textarea
            id="promotion-description"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Descreva os detalhes da promoção..."
            className="mt-2"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onSave}>
          {isEditing ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
