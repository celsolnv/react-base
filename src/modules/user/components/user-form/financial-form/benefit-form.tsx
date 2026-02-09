import { X } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn";
import { recurrenceOptions } from "@/constants/options";
import Mask from "@/utils/masks";

import { Fieldset } from "../../fieldset";
import type { TBenefitForm } from "./types";

interface IBenefitFormProps {
  benefitForm: TBenefitForm;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof TBenefitForm, value: string) => void;
}

export function BenefitForm({
  benefitForm,
  isEditing,
  onSave,
  onCancel,
  onChange,
}: Readonly<IBenefitFormProps>) {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = Mask.money(rawValue);
    const valueWithoutPrefix = maskedValue.replace(/^R\$\s*/, "");
    onChange("value", valueWithoutPrefix);
  };

  return (
    <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground font-medium">
          {isEditing ? "Editar Benefício" : "Novo Benefício"}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Fieldset
          id="benefit-name"
          label="Nome do benefício"
          value={benefitForm.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Nome do benefício"
          required
        />

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="benefit-value">Valor</Label>
          <div className="relative mt-2">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
              R$
            </div>
            <Input
              id="benefit-value"
              type="text"
              value={benefitForm.value}
              onChange={handleValueChange}
              placeholder="0,00"
              className="pl-12"
            />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="benefit-recurrence">Recorrência</Label>
          <Select
            value={benefitForm.frequency}
            onValueChange={(value) =>
              onChange("frequency", value as "monthly" | "yearly" | "once")
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione a recorrência" />
            </SelectTrigger>
            <SelectContent>
              {recurrenceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
