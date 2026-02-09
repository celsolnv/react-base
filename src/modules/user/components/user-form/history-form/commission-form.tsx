import { X } from "lucide-react";

import { Button, Input, Label, Textarea } from "@/components/shadcn";
import Mask from "@/utils/masks";

import type { TCommissionForm } from "./types";

interface ICommissionFormProps {
  form: TCommissionForm;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof TCommissionForm, value: string) => void;
}

export function CommissionForm({
  form,
  isEditing,
  onSave,
  onCancel,
  onChange,
}: Readonly<ICommissionFormProps>) {
  const handleCurrencyChange = (
    field: keyof TCommissionForm,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    const maskedValue = Mask.money(rawValue);
    const valueWithoutPrefix = maskedValue.replace(/^R\$\s*/, "");
    onChange(field, valueWithoutPrefix);
  };

  return (
    <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground font-medium">
          {isEditing ? "Editar Registro" : "Novo Registro"}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="commission-date">Data</Label>
          <Input
            id="commission-date"
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="commission-old-value">Valor Anterior</Label>
          <div className="relative mt-2">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
              R$
            </div>
            <Input
              id="commission-old-value"
              type="text"
              value={form.last_commission}
              onChange={(e) => handleCurrencyChange("last_commission", e)}
              placeholder="0,00"
              className="pl-12"
            />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="commission-new-value">Novo Valor</Label>
          <div className="relative mt-2">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
              R$
            </div>
            <Input
              id="commission-new-value"
              type="text"
              value={form.new_commission}
              onChange={(e) => handleCurrencyChange("new_commission", e)}
              placeholder="0,00"
              className="pl-12"
            />
          </div>
        </div>

        <div className="col-span-12">
          <Label htmlFor="commission-description">Descrição</Label>
          <Textarea
            id="commission-description"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Descreva os detalhes da alteração..."
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
